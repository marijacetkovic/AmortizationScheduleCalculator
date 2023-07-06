using Microsoft.AspNetCore.Mvc;

namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserRegistrationController : ControllerBase
    {

        private readonly ILogger<UserRegistrationController> _logger;

        public UserRegistrationController(ILogger<UserRegistrationController> logger)
        {
            _logger = logger;
        }

        [HttpGet("register", Name = "Register")]
        public IEnumerable<User> GetRegistrationForm()
        {
            User[] userArray = Enumerable.Range(1, 3).Select(index => new User
            {
                BirthDate = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                Username = "marijacet",
                Password = "12345678"
            }).ToArray();
            return userArray;
        }
        [HttpGet("login", Name = "Login")]
        public string GetLoginForm()
        { return "login form here"; }
    }
}