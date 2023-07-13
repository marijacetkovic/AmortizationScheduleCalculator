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

        public CalculateAmortizationPlanController(IDbConnection db,ICalculateAmortizationPlan calculate)
        {
            _db = db;
            _calculate = calculate;
        }

       
        [HttpPost]
        public async Task<IActionResult> CreateNewCalculation(Request scheduleReq)
        {
            GetUserId();
            Console.WriteLine("\n");
       
            Console.WriteLine("\n");
            var scheduleList = new List<Schedule>();
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
        protected void GetUserId()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;

            Console.WriteLine("dasDasdasdas \n");
            Console.WriteLine(identity.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name));
            Console.WriteLine("\n:w:dasDasdasdas \n");
        }
        [HttpGet]
        public async Task<ActionResult<List<Request>>> GetAllRequests()
        {
            string query = "select * from \"Request\"";
            var requests = await _db.QueryAsync<Request>(query);
            return Ok(requests);
        }
    }
}
