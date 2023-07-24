using AmortizationScheduleCalculator.Exceptions;
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
            if (scheduleReq.Loan_Amount < 1000)
            {
                throw new InvalidInputException("Minimal loan amount is 1,000€.");
            }
            if (scheduleReq.Loan_Period < 1)
            {
                throw new InvalidInputException("Minimal loan period is one year.");
            }
            if (scheduleReq.Interest_Rate <0|| scheduleReq.Interest_Rate > 99)
            {
                throw new InvalidInputException("Interest rate value must be between 0 and 100.");
            }

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

       static int count = 0;

       public async Task<List<Schedule>> ApplyPartialPayments(string reqName, Dictionary<int, decimal> missedPayments) {

            Request req = null;
            try
            {
                req = await getRequest(reqName);
            }
            catch
            {
                throw new QueryException("There is no request with that name.");
            }
            List<Schedule> calculatedPlan = await getSchedule(reqName);
            List<Schedule> editedPlan = new List<Schedule>();

            var monthlyPayment = req.Monthly_Payment;
            var numOfPayments = req.Loan_Period * 12;
            var totalLoanCost = req.Total_Loan_Cost;
            var currentDate = req.Loan_Start_Date.Date;

            var newName = req.Request_Name + " edit " + count;
            Request editedRequest = req;
            editedRequest.Request_Name = newName;
            int id = await InsertRequestDb(editedRequest);
            count++;
            Console.WriteLine(newName);
            bool owed = false, increased=false;
            int i = 0;
            decimal interestOwed=0, principalOwed=0, owedPayment=0, currentRemainingLoan = req.Loan_Amount;
            while (i<numOfPayments)
            {
                Schedule newEntry = new Schedule();
                
                if (!increased) { newEntry = calculatedPlan.ElementAt(i); }
                currentDate = currentDate.AddMonths(1);
                newEntry.Current_Date = currentDate;

                newEntry.S_Request_Id = id;
                //if a payment nr i is missed then the schedule at that index should be newly made
                if (missedPayments.ContainsKey(i+1)) {
                    decimal missedPayment = missedPayments[i + 1];
                    newEntry.Monthly_Paid = missedPayment;
                    owed = true;
                    //retreive old entry and apply changes to it
                    if (!increased)
                    {
                        //if not yet increased assumed monthly payment = fixed monthly calculated
                        //if partial is not 0 then remove that from owed 
                        owedPayment += monthlyPayment - missedPayment; // + fee
                    }
                    else
                    {
                        //else assumed monthly is 0 because we increased the list of assumed payments
                        owedPayment -= missedPayment; // + fee
                        if (owedPayment == 0) owed = false;
                        if (owedPayment < 0) throw new InvalidInputException("Partial payment is greater than what is owed.");
                    }
                    interestOwed += newEntry.Interest_Paid;
                    newEntry.Interest_Paid = missedPayment - newEntry.Principal_Paid;

                    if (missedPayment >= principalOwed && increased)
                    {
                        newEntry.Principal_Paid = principalOwed;
                        newEntry.Interest_Paid = missedPayment - newEntry.Principal_Paid;
                    }
                    else if (missedPayment <= newEntry.Principal_Paid) {
                        //covers only principal
                        newEntry.Principal_Paid = missedPayment;
                        newEntry.Interest_Paid = 0;
                    }
                    else if (missedPayment <= principalOwed && increased) {
                        newEntry.Principal_Paid = missedPayment;
                        newEntry.Interest_Paid = 0;
                    }
                    interestOwed -= newEntry.Interest_Paid;
                    currentRemainingLoan -= newEntry.Principal_Paid;
                    newEntry.Remaining_Loan = currentRemainingLoan;
                   // if (increased) owedPayment = monthlyPayment-missedPayment;
                    principalOwed = owedPayment - interestOwed;
                    editedPlan.Add(newEntry);
                    await InsertScheduleDb(newEntry);
                    if (i == numOfPayments - 1 && owed)
                    {
                        numOfPayments++;
                        increased = true;
                    }

                }
                else
                {
                    //missed = false;
                    if (!owed) {
                        editedPlan.Add(newEntry);
                        currentRemainingLoan -= newEntry.Principal_Paid;
                        await InsertScheduleDb(newEntry);
                    } //nothings owed, we can continue normally

                    //if the list was increased this will be the last payment to be made
                    
                    else if (increased) {
                        newEntry.Monthly_Paid = owedPayment;
                        newEntry.Principal_Paid = principalOwed;
                        newEntry.Interest_Paid = interestOwed;
                        currentRemainingLoan -= newEntry.Principal_Paid;
                        newEntry.Remaining_Loan = currentRemainingLoan;
                        await InsertScheduleDb(newEntry);
                        editedPlan.Add(newEntry);
                    }
                    else {
                        
                        newEntry.Monthly_Paid += owedPayment;
                        newEntry.Principal_Paid += principalOwed;
                        newEntry.Interest_Paid += interestOwed;
                        currentRemainingLoan -= newEntry.Principal_Paid;
                        newEntry.Remaining_Loan = currentRemainingLoan;
                        await InsertScheduleDb(newEntry);
                        editedPlan.Add(newEntry);
                        owed = false; //dug otplacen
                        owedPayment = 0;
                        interestOwed = 0;
                        principalOwed = 0;
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
