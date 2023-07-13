namespace AmortizationScheduleCalculator.Model
{
    public class Request
    {

        public int Request_Id { get; set; }
        //these user enters
        public required decimal Loan_Amount { get; set; }
        public int Loan_Period { get; set; }
        public double Interest_Rate { get; set; }
        public DateTime Loan_Start_Date { get; set; }

        //these are optional
        public decimal Approval_Cost { get; set; } = 0;
        public decimal Insurance_Cost { get; set; } = 0;
        public decimal Account_Cost { get; set; } = 0;
        public decimal Other_Costs { get; set; } = 0;

        //these get calculated
        public decimal Monthly_Payment { get; set; }
        public decimal Total_Interest_Paid { get; set; }
        public decimal Total_Loan_Cost { get; set; }
        public DateTime Loan_Payoff_Date { get; set; }


    }
}
