using AmortizationScheduleCalculator.Context;
using AmortizationScheduleCalculator.Model;
using AmortizationScheduleCalculator.Services;
using Dapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using Npgsql;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static BCrypt.Net.BCrypt;

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
            var result = await _register.AddUser(user);
            return Ok(result);

        }

        [HttpPost("login", Name = "Login")]
        public string userLoginValidation(User user)
        {
            return _register.userLoginValidation(user);
        }

        [HttpGet("secretlink", Name = "Secret"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public string getSecret()
        {
            return _register.getSecret();
        }


        //creating jwt token
        private string CreateToken(User user)
        {
            return _register.CreateToken(user);
        }
    }
}