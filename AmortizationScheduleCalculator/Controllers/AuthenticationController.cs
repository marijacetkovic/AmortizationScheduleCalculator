using Microsoft.AspNetCore.Mvc;

namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthenticationController : Controller
    {
        [HttpGet]
        public string Index()
        {
            //check authentication here
            bool authenticated = false;
            if (authenticated) { return "yaay you can enter"; }
            else { return "not authenticated sorry"; }
        }
    }
}
