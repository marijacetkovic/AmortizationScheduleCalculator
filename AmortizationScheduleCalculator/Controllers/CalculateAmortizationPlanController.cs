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

            var scheduleList = await _calculate.CreateNewCalculation(scheduleReq);
            await _calculate.StoreNewCalculation(scheduleList);
            var id = scheduleList.Summary.Request_Id;
            await _calculate.updateAuditHistory(id.ToString(), id.ToString()); //first entry in audit history
            return Ok(scheduleList);
        }
        [HttpPost("open")]
        public async Task<IActionResult> CreateNewCalculationOpen(Request scheduleReq)
        {

            var scheduleList = await _calculate.CreateNewCalculation(scheduleReq);
            return Ok(scheduleList);
        }

        [HttpPost("edit"), Authorize]
        public async Task<IActionResult> EditCalculation(Request scheduleReq, [FromQuery] string reqId)
        {   
           var scheduleList = await _calculate.EditCalculation(scheduleReq,reqId);
           return Ok(scheduleList);
        }

        [HttpGet("getallrequests"), Authorize]
        public List<Request> GetAllRequests()
        {
            var id = Int32.Parse(_register.getUserId());
            return _db.Query<Request>("select * from \"Request\" where r_user_id=@id and last_version=@value", new { id = id, value = true }).ToList();

        }
        [HttpGet("deleterequest"), Authorize]
        public async Task<ActionResult> DeleteRequest([FromQuery] string reqName)
        {
            var req = await _calculate.updateRequest(reqName);
            return Ok(req);

        }
        [HttpGet("schedule"), Authorize]
        public async Task<IActionResult> GetSchedule([FromQuery] string reqName)

        {
            var amortizationSchedule = await _calculate.getSchedule(reqName);
            return Ok(amortizationSchedule);

        }

        [HttpPost("applypartial"), Authorize]

        public async Task<IActionResult> ApplyPartialPayment([FromQuery] string reqName, Dictionary<int, decimal> missedPayments,decimal fee)
        {

                var amortizationSchedule = await _calculate.ApplyPartialPayments(reqName, missedPayments,fee);
                return Ok(amortizationSchedule);
        }

        [HttpPost("applyearly"), Authorize]

        public async Task<IActionResult> ApplyEarlyPayment([FromQuery] string reqName, Dictionary<int, decimal> earlyPayments)
        {
               var amortizationSchedule = await _calculate.ApplyEarlyPayments(reqName, earlyPayments);
                return Ok(amortizationSchedule); 
        }

        [HttpPost("generatepdf"), Authorize]

        public async Task<FileStreamResult> GeneratePdf([FromQuery] string reqName)
        {
          return await _pdfgenerator.GeneratePdf(reqName);

        }

        [HttpGet("audithistory"), Authorize]

        public async Task<List<Request>> GetAuditHistory([FromQuery] string parentReqName)
        {
            return (await _calculate.getAuditHistory(parentReqName));
        }
        

    }
}
