using AmortizationScheduleCalculator.Model;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using Dapper;
using AmortizationScheduleCalculator.Services;
using System.ComponentModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using static Dapper.SqlMapper;
using System.Security.Claims;
using IronPdf;
using Microsoft.AspNetCore.Html;
using System.Net;
using MimeMapping;

namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalculateAmortizationPlanController : Controller
    {
        private readonly IDbConnection _db;
        private ICalculateAmortizationPlan _calculate;
        private readonly IUserRegistration _register;
        private readonly IPdfGenerator _pdfgenerator;

        public CalculateAmortizationPlanController(IDbConnection db, ICalculateAmortizationPlan calculate, IUserRegistration register, IPdfGenerator pdfgenerator)
        {
            _db = db;
            _calculate = calculate;
            _register = register;
            _pdfgenerator = pdfgenerator;
        }



        [HttpPost, Authorize]
        public async Task<IActionResult> CreateNewCalculation(Request scheduleReq)
        {

            var scheduleList = new AmortizationPlan();
            try
            {
                scheduleList = await _calculate.CreateNewCalculation(scheduleReq);
                return Ok(scheduleList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("getallrequests"), Authorize]
        public List<Request> getAllRequests()
        {
            var id = Int32.Parse(_register.getUserId());
            return _db.Query<Request>("select * from \"Request\" where r_user_id=@id and last_version=@value", new { id = id, value = true }).ToList();

        }
        [HttpGet("deleterequest"), Authorize]
        public async Task<ActionResult> deleteRequest([FromQuery] string reqName)
        {
            Request req;
            try
            {
                req = await _calculate.updateRequest(reqName);
                return Ok(req);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpGet("schedule"), Authorize]
        public async Task<AmortizationPlan> getSchedule([FromQuery] string reqName)

        {
            var amortizationSchedule = new AmortizationPlan();
            try {
                amortizationSchedule = await _calculate.getSchedule(reqName);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return amortizationSchedule;

        }

        [HttpPost("applypartial"), Authorize]

        public async Task<IActionResult> applyPartialPayment([FromQuery] string reqName, Dictionary<int, decimal> missedPayments)
        {

            var amortizationSchedule = new AmortizationPlan();
            try
            {
                amortizationSchedule = await _calculate.ApplyPartialPayments(reqName, missedPayments);
                return Ok(amortizationSchedule);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("applyearly"), Authorize]

        public async Task<IActionResult> applyEarlyPayment([FromQuery] string reqName, Dictionary<int, decimal> earlyPayments)
        {

            var amortizationSchedule = new AmortizationPlan();
            try
            {
                amortizationSchedule = await _calculate.ApplyEarlyPayments(reqName, earlyPayments);
                return Ok(amortizationSchedule);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("generatepdf"), Authorize]

        public async Task<FileStreamResult> GeneratePdf([FromQuery] string reqName)
        {
          return await _pdfgenerator.GeneratePdf(reqName);

        }

        [HttpGet("audithistory"), Authorize]

        public async Task<List<Request>> getAuditHistory([FromQuery] string parentReqName)
        {
            return (await _calculate.getAuditHistory(parentReqName));
        }
        

    }
}
