namespace AmortizationScheduleCalculator.Model
{
    public class RequestSummary
    {
        public decimal Monthly_Payment { get; set; }
        public decimal Total_Interest_Paid { get; set; }
        public decimal Total_Loan_Cost { get; set; }
        public DateTime Loan_Payoff_Date { get; set; }
        public int Num_Of_Payments { get; set; }
    }
}
