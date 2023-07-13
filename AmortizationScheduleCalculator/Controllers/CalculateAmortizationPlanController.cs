using AmortizationScheduleCalculator.Model;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using Dapper;


namespace AmortizationScheduleCalculator.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalculateAmortizationPlanController : Controller
    {
        private readonly IDbConnection _db;

        public CalculateAmortizationPlanController(IDbConnection db)
        {
            _db = db;
        }

        [HttpPost]
        public async Task<ActionResult<List<Request>>> CalculateRequest(Request scheduleReq)
        {
            var loanAmount = scheduleReq.Loan_Amount;
            var loanPeriod = scheduleReq.Loan_Period;
            var interestRate = scheduleReq.Interest_Rate/100;
            var loanStartDate = scheduleReq.Loan_Start_Date;

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
            monthlyPayment = (decimal) (((double)loanAmount * (monthlyInterestRate* Math.Pow(1+monthlyInterestRate, numOfPayments)))/(Math.Pow(1 + monthlyInterestRate, numOfPayments) -1));

            totalLoanCost = monthlyPayment*numOfPayments;
            totalInterestPaid = totalLoanCost - loanAmount;
            loanPayoffDate = loanStartDate.AddMonths(numOfPayments);

            //update calculations

            scheduleReq.Monthly_Payment = monthlyPayment;
            scheduleReq.Total_Interest_Paid = totalInterestPaid;
            scheduleReq.Total_Loan_Cost = totalLoanCost;
            scheduleReq.Loan_Payoff_Date = loanPayoffDate;

            //store to database
            await _db.ExecuteAsync("insert into \"Request\" " +
                "(loan_amount,loan_period,interest_rate,loan_start_date,approval_cost,insurance_cost, account_cost,other_costs," +
                "monthly_payment,total_interest_paid,total_loan_cost,loan_payoff_date) " +
                "values (@Loan_Amount, @Loan_Period, @Interest_Rate, @Loan_Start_Date, @Approval_Cost, @Insurance_Cost, @Account_Cost, @Other_Costs, " +
                "@Monthly_Payment, @Total_Interest_Paid, @Total_Loan_Cost, @Loan_Payoff_Date)", scheduleReq);
            return Ok(await GetAllRequests());

        }
        [HttpGet]
        public async Task<ActionResult<List<Request>>> GetAllRequests()
        {
            string query = "select * from \"Request\"";
            var requests = _db.Query<Request>(query);
            return Ok(requests);
        }
    }
}
