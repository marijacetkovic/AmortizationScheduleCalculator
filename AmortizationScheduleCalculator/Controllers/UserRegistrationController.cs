using AmortizationScheduleCalculator.Exceptions;
using AmortizationScheduleCalculator.Model;
using AmortizationScheduleCalculator.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserRegistrationController : ControllerBase
    {
        private readonly IUserRegistration _register;

        public UserRegistrationController(IUserRegistration register)
        {
            _register = register;
        }

        [HttpGet("register", Name = "Register")]
        public async Task<ActionResult<List<User>>> GetAllUsers()
        {
            return Ok(await _register.GetAllUsers());
        }

        [HttpPost("register", Name = "Register")]
        public async Task<ActionResult<List<User>>> AddUser(User user)
        {
            var result = await _register.RegistrateUser(user);
            return Ok(result);

        }

        [HttpPost("login", Name = "Login")]
        public ActionResult<string[]> userLoginValidation(UserInput user)
        {
            try
            {
                return Ok(_register.userLoginValidation(user));
            }
            catch (Exception ex)
            {
                // Handle other exceptions if needed
                return BadRequest(ex.Message);
            }

        }

        //  [HttpGet("secretlink", Name = "Secret"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]


    }
}