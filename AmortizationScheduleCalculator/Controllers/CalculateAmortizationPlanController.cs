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

namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalculateAmortizationPlanController : Controller
    {
        private readonly IDbConnection _db;
        private ICalculateAmortizationPlan _calculate;
        private readonly IUserRegistration _register;

        public CalculateAmortizationPlanController(IDbConnection db,ICalculateAmortizationPlan calculate, IUserRegistration register)
        {
            _db = db;
            _calculate = calculate;
            _register = register;
        }

       
        [HttpPost]
        public async Task<IActionResult> CreateNewCalculation([FromBody] Request scheduleReq, [FromQuery] Dictionary<int, decimal> dict)
        {

            var scheduleList = new List<Schedule>();
            try
            {
                scheduleList = await _calculate.CreateNewCalculation(scheduleReq, dict);
                return Ok(scheduleList);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public List<Request> getAllRequests()
        {
            //var id = Int32.Parse(_register.getUserId());
            var id = 1;
            return _db.Query<Request>("select * from \"Request\" where r_user_id=@id", new { id = id }).ToList();

        }
        [HttpGet("schedule"), Authorize]
        public async Task<List<Schedule>> getSchedule([FromQuery] string reqName)

        {
            var amortizationSchedule = 
                (await _db.QueryAsync<Schedule>("select * from \"AmortizationSchedule\" where s_request_id = ( " +
                "select request_id from \"Request\" where request_name=@reqname and r_user_id=@id)",
                new { reqname = reqName,id=Int32.Parse(_register.getUserId())})).ToList();
            return amortizationSchedule;

        }

    }
}
