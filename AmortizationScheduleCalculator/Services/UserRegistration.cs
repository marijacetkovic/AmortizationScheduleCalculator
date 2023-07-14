using AmortizationScheduleCalculator.Model;
using Dapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AmortizationScheduleCalculator.Services
{
    public class UserRegistration:IUserRegistration
    {

        private readonly IDbConnection _db;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserRegistration(IDbConnection db, IConfiguration config, IHttpContextAccessor httpContextAccessor)
        {
            _db = db;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<User>> GetAllUsers()
        {

            string query = "select * from \"User\"";
            
            List<User> users = _db.Query<User>(query).ToList();
            return users;
        }

        public async Task<List<User>> AddUser(User user)
        {
            user.User_Password = BCrypt.Net.BCrypt.HashPassword(user.User_Password);
            user.User_Id = await _db.QueryFirstAsync<int>("insert into \"User\" (name,surname,email,user_password) values (@Name, @Surname, @Email, @User_Password) returning user_id", user);
            Console.WriteLine(user.User_Id);
            return await GetAllUsers();

        }

        public string userLoginValidation(User user)
        {
            Console.WriteLine(user.User_Id);
            //first validate credentials - check password for given email (or username)
            var hashedPassword = _db.Query<string>("SELECT user_password FROM \"User\" WHERE email = @Email", user).First();
            //verify password
            if (BCrypt.Net.BCrypt.Verify(user.User_Password, hashedPassword))
            {
                //when validate generate jwt token
                int id = _db.Query<int>("SELECT user_id FROM \"User\" WHERE email = @Email", user).First();
                user.User_Id = id;
                string token = CreateToken(user);
                return token;

            }
            else
            {
                return "wrong mail or password";
            }

        }

        public string getSecret()
        {
            return "now you know my secret!!!";
        }


        //creating jwt token
        public string CreateToken(User user)
        {
            Console.WriteLine("create token user id "+user.User_Id.ToString());
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Name,user.User_Id.ToString()),
                new Claim(ClaimTypes.Role, "User")
             };
            //var identity = HttpContext.User.Identity;

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

        public string getUserId()
        {
            string result = "";
            if (_httpContextAccessor is not null)
            {
                result = _httpContextAccessor.HttpContext.User?.Identity?.Name;
            }
            return result;
        }
    }
}

