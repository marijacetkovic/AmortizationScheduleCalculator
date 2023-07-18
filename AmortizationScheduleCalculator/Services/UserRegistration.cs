using AmortizationScheduleCalculator.Model;
using Dapper;
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

        public async Task<int> RegistrateUser(User user)
        {
            user.User_Password = BCrypt.Net.BCrypt.HashPassword(user.User_Password);
            try
            {
                user.User_Id = await _db.QueryFirstAsync<int>("insert into \"User\" (name,surname,email,user_password) values (@Name, @Surname, @Email, @User_Password) returning user_id", user);
                Console.WriteLine(user.User_Id);
                return 1;
            }
            //error is raised when tried to enter email that alr exists
            catch(Exception e) { 
                Console.WriteLine("Email exists");
                return 0;
            }
            

        }

        public string userLoginValidation(UserInput loginUser)
        {
            //first validate credentials - check password for given email (or username)
            var hashedPassword = _db.Query<string>("SELECT user_password FROM \"User\" WHERE email = @Email", loginUser).First();
            //verify password
            if (BCrypt.Net.BCrypt.Verify(loginUser.password, hashedPassword))
            {
                //when validate generate jwt token
                int id = _db.Query<int>("SELECT user_id FROM \"User\" WHERE email = @Email", loginUser).First();
                //var user = new User();
                //user.User_Id = id;
                string token = CreateToken(id);
                return token;

            }
            else
            {
                return "wrong mail or password";
            }

        }


        //creating jwt token
        public string CreateToken(int id)
        {
            Console.WriteLine("create token user id "+id.ToString());
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Name,id.ToString()),
                new Claim(ClaimTypes.Role, "User")
             };
            //var identity = HttpContext.User.Identity;

            //get secret key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddSeconds(20),
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

