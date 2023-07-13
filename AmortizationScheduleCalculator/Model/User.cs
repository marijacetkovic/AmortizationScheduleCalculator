namespace AmortizationScheduleCalculator.Model
{
    public class User
    {
        public int User_Id { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public required string Email { get; set; }
        public required string User_Password { get; set; }
    }
}
