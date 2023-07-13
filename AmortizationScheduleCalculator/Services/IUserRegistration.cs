using AmortizationScheduleCalculator.Model;
using Microsoft.AspNetCore.Mvc;

namespace AmortizationScheduleCalculator.Services
{
    public interface IUserRegistration
    {
        Task<List<User>> GetAllUsers();
        Task<List<User>> AddUser(User user);
        string userLoginValidation(User user);
        string getSecret();
        string CreateToken(User user);
    }
}
