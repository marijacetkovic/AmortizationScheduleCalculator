namespace AmortizationScheduleCalculator.Model
{
    public class Schedule
    {
        public Schedule(DateTime currentDate, decimal monthlyPaid, decimal principalPaid, decimal interestPaid, decimal remainingLoan, int sRequestId)
        {
            Current_Date = currentDate;
            Monthly_Paid = monthlyPaid;
            Principal_Paid = principalPaid;
            Interest_Paid = interestPaid;
            Remaining_Loan = remainingLoan;
            S_Request_Id = sRequestId;
        }
        public Schedule() { }
        public int Schedule_Id { get; set; }
        public DateTime Current_Date { get; set; }
        public decimal Monthly_Paid { get; set; }
        public decimal Principal_Paid { get; set; }
        public decimal Interest_Paid { get; set; }
        public decimal Remaining_Loan { get; set; }
        public int S_Request_Id { get; set; }


    }
}
