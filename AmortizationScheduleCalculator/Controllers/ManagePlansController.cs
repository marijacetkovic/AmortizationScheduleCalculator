using Microsoft.AspNetCore.Mvc;

namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ManagePlansController : Controller
    {
        [HttpGet]
        public string Index()
        {
            //access the database 
            //retreive stored calculated amortization plans and display them
            int numOfPlans = 2 * 2;
            return "number of amortization plans from the database is " + numOfPlans;
        }
    }
}
