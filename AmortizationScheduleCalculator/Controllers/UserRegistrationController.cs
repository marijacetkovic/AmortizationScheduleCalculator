using AmortizationScheduleCalculator.Context;
using AmortizationScheduleCalculator.Model;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Npgsql;
using System.Data;

namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserRegistrationController : ControllerBase
    {

        private readonly IDbConnection _db;

        public UserRegistrationController(IDbConnection db)
        {
            _db = db;
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
            await _db.ExecuteAsync("insert into \"User\" (name,surname,email,user_password) values (@Name, @Surname, @Email, @User_Password)", user);
            return Ok(await GetAllUsers());

        }

        //this gets the 
        [HttpPost("login", Name = "Login")]
        public string GetLoginForm(User user)
        {
            var rowList = _db.Query<int>("SELECT * FROM \"User\" WHERE email = @Email and user_password = @User_Password", user);
            if (rowList == null || !rowList.Any()) {
                return "wrong mail or password";
            }
            else {
                return "youre in";
    
            }

        }
    }
}