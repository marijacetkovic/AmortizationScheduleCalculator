using AmortizationScheduleCalculator.Model;

namespace AmortizationScheduleCalculator.Services
{
    public interface IUserRegistration
    {
        Task<List<User>> GetAllUsers();
        Task<int> RegistrateUser(User user);
        string[] userLoginValidation(UserInput user);
        string CreateToken(int id);
        string getUserId();
        string getCurrentUser(int userId);
    }
}
