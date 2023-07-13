using AmortizationScheduleCalculator.Context;
using AmortizationScheduleCalculator.Model;
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

        private readonly IDbConnection _db;
        private readonly IConfiguration _config;

        public UserRegistrationController(IDbConnection db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }

        [HttpGet("register", Name = "Register")]
        public async Task<ActionResult<List<User>>> GetAllUsers(){
            
            string query = "select * from \"User\"";
            var users = _db.Query<User>(query);
            return Ok(users);
        }

        [HttpPost("register", Name = "Register")]
        public async Task<ActionResult<List<User>>> AddUser(User user)
        {
            user.User_Password = BCrypt.Net.BCrypt.HashPassword(user.User_Password);
            await _db.ExecuteAsync("insert into \"User\" (name,surname,email,user_password) values (@Name, @Surname, @Email, @User_Password)", user);
            return Ok(await GetAllUsers());

        }

        [HttpPost("login", Name = "Login")]
        public string GetLoginForm(User user)
        {
            //first validate credentials - check password for given email (or username)
            var hashedPassword = _db.Query<string>("SELECT user_password FROM \"User\" WHERE email = @Email", user).First();
            //verify password
            if (BCrypt.Net.BCrypt.Verify(user.User_Password, hashedPassword)) {
                //when validate generate jwt token
                string token = CreateToken(user);
                return token;
                
            }
            else {
                return "wrong mail or password";
            }

        }

        [HttpGet("secretlink", Name = "Secret"), Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public string getSecret() {
            return "now you know my secret!!!";
        }


        //creating jwt token
        private string CreateToken(User user) {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Name, user.Email)
             };
            //get secret key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
    }
}