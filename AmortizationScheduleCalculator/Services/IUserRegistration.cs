using AmortizationScheduleCalculator.Model;

namespace AmortizationScheduleCalculator.Services
{
    public interface IUserRegistration
    {
        Task<List<User>> GetAllUsers();
        Task<int> RegistrateUser(User user);
        string userLoginValidation(User user);
        string CreateToken(User user);
        string getUserId();
    }
}
