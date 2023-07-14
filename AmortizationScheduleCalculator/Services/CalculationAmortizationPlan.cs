using AmortizationScheduleCalculator.Model;
using Dapper;
using System.Data;

namespace AmortizationScheduleCalculator.Services
{
    public class CalculationAmortizationPlan:ICalculateAmortizationPlan
    {
        private readonly IDbConnection _db;
        private readonly IUserRegistration _register;
        
        

        public CalculationAmortizationPlan(IDbConnection db, IUserRegistration register)
        {
            _db = db;
            _register = register; 
            
        }
        public async Task<List<Schedule>>  CreateNewCalculation(Request scheduleReq)
        {
            Console.WriteLine("ovo debugujem "+_register.getUserId());
            scheduleReq.R_User_Id = Int32.Parse(_register.getUserId());
            var loanAmount = scheduleReq.Loan_Amount;
            var loanPeriod = scheduleReq.Loan_Period;
            var interestRate = scheduleReq.Interest_Rate / 100;
            var loanStartDate = scheduleReq.Loan_Start_Date.Date;

            decimal monthlyPayment;
            decimal totalLoanCost;
            decimal totalInterestPaid;
            decimal additionalCosts;
            DateTime loanPayoffDate;

            //calculate

            int numOfPayments = loanPeriod * 12;
            double monthlyInterestRate = interestRate / 12;
            additionalCosts = scheduleReq.Account_Cost + scheduleReq.Approval_Cost + scheduleReq.Insurance_Cost + scheduleReq.Other_Costs;
            loanAmount += additionalCosts;
            //M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
            monthlyPayment = (decimal)(((double)loanAmount * (monthlyInterestRate * Math.Pow(1 + monthlyInterestRate, numOfPayments))) / (Math.Pow(1 + monthlyInterestRate, numOfPayments) - 1));
            decimal monthlyRounded = Math.Round(monthlyPayment, 2);
            totalLoanCost = monthlyPayment * numOfPayments;
            totalInterestPaid = totalLoanCost - loanAmount;
            loanPayoffDate = loanStartDate.AddMonths(numOfPayments);

            //update calculations

            scheduleReq.Monthly_Payment = monthlyPayment;
            scheduleReq.Total_Interest_Paid = totalInterestPaid;
            scheduleReq.Total_Loan_Cost = totalLoanCost;
            scheduleReq.Loan_Payoff_Date = loanPayoffDate.Date;

            //store to database
            var id = await _db.QuerySingleAsync<int>("insert into \"Request\" " +
                "(loan_amount,loan_period,interest_rate,loan_start_date,approval_cost,insurance_cost, account_cost,other_costs," +
                "monthly_payment,total_interest_paid,total_loan_cost,loan_payoff_date,r_user_id) " +
                "values (@Loan_Amount, @Loan_Period, @Interest_Rate, @Loan_Start_Date, @Approval_Cost, @Insurance_Cost, @Account_Cost, @Other_Costs, " +
                "@Monthly_Payment, @Total_Interest_Paid, @Total_Loan_Cost, @Loan_Payoff_Date,@R_User_Id )" +
                "RETURNING request_id", scheduleReq);
            Console.WriteLine("\n SADdsa asddsa as dads das asd sda \n");
            Console.WriteLine(id);
            // return Ok(await GetAllRequests());



            var currentDate = loanStartDate.Date;
            decimal interestPayment, remainingBalance = loanAmount, principalPayment;
            var scheduleList = new List<Schedule>();
            for (int i = 0; i < numOfPayments; i++)
            {
                currentDate = currentDate.AddMonths(1);
                interestPayment = ((decimal)((double)remainingBalance * monthlyInterestRate));
                principalPayment = monthlyPayment - interestPayment;
                remainingBalance -= principalPayment;

                if (remainingBalance <= 0) remainingBalance = 0;


                principalPayment = Math.Round(principalPayment, 2);
                interestPayment = Math.Round(interestPayment,2);
                var remainingRounded = Math.Round(remainingBalance,2);
                Schedule newSchedule = new Schedule(currentDate, monthlyRounded, principalPayment, interestPayment, remainingRounded, id);
                scheduleList.Add(newSchedule);
                 await _db.ExecuteAsync("insert into \"AmortizationSchedule\" (\"current_date\",monthly_paid,principal_paid,interest_paid,remaining_loan," +
                    "s_request_id)\r\nvalues (@Current_Date,@Monthly_Paid,@Principal_Paid,@Interest_Paid,@Remaining_Loan,@S_Request_Id)", newSchedule);
            }
            return scheduleList;
        }
    }
}
