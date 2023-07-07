using Microsoft.AspNetCore.Mvc;

namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalculateAmortizationPlanController : Controller
    {
        [HttpGet]
        public string Index()
        {
            int calculation = 2 * 2;
            return "your amortization plan is "+ calculation;
        }
    }
}
