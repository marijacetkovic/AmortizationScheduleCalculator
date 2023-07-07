namespace AmortizationScheduleCalculator
{
    //user object that stores relevant information about users
    public class User
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public DateOnly BirthDate { get; set; }
    }
}