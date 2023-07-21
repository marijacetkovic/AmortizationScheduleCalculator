using AmortizationScheduleCalculator.Model;
using Dapper;
using Microsoft.AspNetCore.Mvc;
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
        public async Task<List<Schedule>>  CreateNewCalculation( Request scheduleReq)
        {
            Console.WriteLine("ovo debugujem "+_register.getUserId());

            scheduleReq.R_User_Id = Int32.Parse(_register.getUserId());
            //scheduleReq.R_User_Id = 60;

            var loanAmount = scheduleReq.Loan_Amount;
            var loanPeriod = scheduleReq.Loan_Period;
            var interestRate = scheduleReq.Interest_Rate / 100;
            var loanStartDate = scheduleReq.Loan_Start_Date.Date;

            decimal monthlyPaymentFixed;
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
            monthlyPaymentFixed = CalculateMonthly(loanAmount, monthlyInterestRate, numOfPayments);
            

            totalLoanCost = monthlyPaymentFixed * numOfPayments;
            totalInterestPaid = totalLoanCost - loanAmount;
            loanPayoffDate = loanStartDate.AddMonths(numOfPayments);

            //update calculations

            scheduleReq.Monthly_Payment = monthlyPaymentFixed;
            scheduleReq.Total_Interest_Paid = totalInterestPaid;
            scheduleReq.Total_Loan_Cost = totalLoanCost;
            scheduleReq.Loan_Payoff_Date = loanPayoffDate;

            //store to database
            int id = await InsertRequestDb(scheduleReq);
            Console.WriteLine("\n SADdsa asddsa as dads das asd sda \n");
            Console.WriteLine(id);
            
            var currentDate = loanStartDate.Date;
            decimal interestPayment, remainingBalance = loanAmount, principalPayment;
            var scheduleList = new List<Schedule>();

            int i = 1;
            decimal monthlyPayment = monthlyPaymentFixed;
            while (i<=numOfPayments)
            {
                currentDate = currentDate.AddMonths(1);
                interestPayment = ((decimal)((double)remainingBalance * monthlyInterestRate));
                principalPayment = monthlyPaymentFixed - interestPayment;
                remainingBalance -= principalPayment;
                if (Math.Round(remainingBalance,4)<= 0) remainingBalance = 0;

                decimal monthlyRounded = Math.Round(monthlyPayment, 2);
                principalPayment = Math.Round(principalPayment, 2);
                interestPayment = Math.Round(interestPayment,2);
                var remainingRounded = Math.Round(remainingBalance,2);
                Schedule newSchedule = new(currentDate.Date, monthlyRounded, principalPayment, interestPayment, remainingRounded, id);
                scheduleList.Add(newSchedule);
                await InsertScheduleDb(newSchedule);
                i++;
            }
            return scheduleList;
        
        }

        private decimal CalculateMonthly(decimal loanAmount, double monthlyInterestRate, int numOfPayments) {
            var monthlyPayment = (decimal)(((double)loanAmount * (monthlyInterestRate * Math.Pow(1 + monthlyInterestRate, numOfPayments))) 
                / (Math.Pow(1 + monthlyInterestRate, numOfPayments) - 1));
            return monthlyPayment;
        }

        private async Task<int> InsertRequestDb(Request newRequest)
        {
           return await _db.QuerySingleAsync<int>("insert into \"Request\" " +
                "(request_name,loan_amount,loan_period,interest_rate,loan_start_date,approval_cost,insurance_cost, account_cost,other_costs," +
                "monthly_payment,total_interest_paid,total_loan_cost,loan_payoff_date,r_user_id) " +
                "values (@Request_Name,@Loan_Amount, @Loan_Period, @Interest_Rate, @Loan_Start_Date, @Approval_Cost, @Insurance_Cost, @Account_Cost, @Other_Costs, " +
                "@Monthly_Payment, @Total_Interest_Paid, @Total_Loan_Cost, @Loan_Payoff_Date,@R_User_Id )" +
                "RETURNING request_id", newRequest);
        }
        private async Task InsertScheduleDb(Schedule newSchedule)
        {
            await _db.ExecuteAsync("insert into \"AmortizationSchedule\" (\"current_date\",monthly_paid,principal_paid,interest_paid,remaining_loan," +
                    "s_request_id)\r\nvalues (@Current_Date,@Monthly_Paid,@Principal_Paid,@Interest_Paid,@Remaining_Loan,@S_Request_Id)", newSchedule);
        }

        int count = 0;

       public async Task<List<Schedule>> ApplyPartialPayments(string reqName, Dictionary<int, decimal> missedPayments) { 
            

            Request req = await getRequest(reqName);
            List<Schedule> calculatedPlan = await getSchedule(reqName);
            List<Schedule> editedPlan = new List<Schedule>();

            var monthlyPayment = req.Monthly_Payment;
            var numOfPayments = req.Loan_Period * 12;
            var totalLoanCost = req.Total_Loan_Cost;
            var loanStartDate = req.Loan_Start_Date;

            var newName = req.Request_Name + " edit " + count;
            Request editedRequest = req;
            editedRequest.Request_Name = newName;
            int id = await InsertRequestDb(editedRequest);
            count++;
            Console.WriteLine(newName);
            bool owed = false;
            int i = 0;
            decimal interestOwed=0, principalOwed=0, owedPayment=0, currentRemainingLoan = 0;
            while (i< numOfPayments)
            {
                Schedule newEntry = calculatedPlan.ElementAt(i);
                newEntry.S_Request_Id = id;
                //if a payment nr i is missed then the schedule at that index should be newly made
                if (missedPayments.ContainsKey(i+1)) {
                    owed = true;
                    //retreive old entry and apply changes to it
                    decimal missedPayment = missedPayments[i];
                    newEntry.Monthly_Paid = missedPayment;
                    owedPayment = monthlyPayment - missedPayment; // + fee
                    currentRemainingLoan = newEntry.Remaining_Loan + monthlyPayment - missedPayment;
                    newEntry.Remaining_Loan = currentRemainingLoan;
                    if (newEntry.Principal_Paid >= missedPayment)
                    {
                        //we dnt want negative principal
                        newEntry.Principal_Paid = missedPayment;
                        interestOwed = newEntry.Interest_Paid;
                        newEntry.Interest_Paid = 0;
                    }
                    else
                    {
                        //else everything goes for principal
                        interestOwed = newEntry.Interest_Paid;
                        newEntry.Interest_Paid = monthlyPayment - newEntry.Principal_Paid;
                        interestOwed-= newEntry.Interest_Paid;
                    }
                    principalOwed = owedPayment - interestOwed;
                    editedPlan.Add(newEntry);
                    InsertScheduleDb(newEntry);

                }
                else
                { if (!owed) {
                        editedPlan.Add(newEntry);
                        InsertScheduleDb(calculatedPlan.ElementAt(i));
                    } //nothings owed, we can continue normally
                    else {
                        owed = false; //dug otplacen
                        newEntry.Monthly_Paid += owedPayment;
                        newEntry.Principal_Paid += principalOwed;
                        newEntry.Interest_Paid += interestOwed;
                        newEntry.Remaining_Loan = currentRemainingLoan - newEntry.Principal_Paid;
                        InsertScheduleDb(newEntry);
                        editedPlan.Add(newEntry);
                    }

                }
                i++;
            }
            return editedPlan;
           
        }

        public async Task<List<Schedule>> getSchedule(string reqName)
        {
            return ((await _db.QueryAsync<Schedule>("select * from \"AmortizationSchedule\" where s_request_id = ( " +
                "select request_id from \"Request\" where request_name=@reqname and r_user_id=@id)",
                new { reqname = reqName, id = Int32.Parse(_register.getUserId()) })).ToList());
        }
        public async Task<Request> getRequest(string reqName)
        {
            return ((await _db.QueryAsync<Request>("select * from \"Request\" where request_name = @reqname",
                new { reqname = reqName})).First());
        }
    }
}
