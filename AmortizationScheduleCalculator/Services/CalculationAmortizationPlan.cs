using AmortizationScheduleCalculator.Exceptions;
using AmortizationScheduleCalculator.Model;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using static QuestPDF.Helpers.Colors;

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
        public async Task<AmortizationPlan>  CreateNewCalculation( Request scheduleReq)
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
            decimal additionalMonthlyCosts;
            DateTime loanPayoffDate;

            //calculate

            int numOfPayments = loanPeriod * 12;
            double monthlyInterestRate = interestRate / 12;
            additionalMonthlyCosts = scheduleReq.Account_Cost + scheduleReq.Approval_Cost + scheduleReq.Insurance_Cost + scheduleReq.Other_Costs;
            //M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
            monthlyPaymentFixed = CalculateMonthly(loanAmount, monthlyInterestRate, numOfPayments) + additionalMonthlyCosts;
            

            totalLoanCost = monthlyPaymentFixed * numOfPayments;
            totalInterestPaid = totalLoanCost - loanAmount;
            loanPayoffDate = loanStartDate.AddMonths(numOfPayments);

            //update calculations

            scheduleReq.Monthly_Payment = Math.Round(monthlyPaymentFixed,2);
            scheduleReq.Total_Interest_Paid = Math.Round(totalInterestPaid,2);
            scheduleReq.Total_Loan_Cost = Math.Round(totalLoanCost,2);
            scheduleReq.Loan_Payoff_Date = loanPayoffDate;
            scheduleReq.Last_Version = true;

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
            return new AmortizationPlan { Schedules=scheduleList, Summary = scheduleReq };
        
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
                "monthly_payment,total_interest_paid,total_loan_cost,loan_payoff_date,last_version,r_user_id) " +
                "values (@Request_Name,@Loan_Amount, @Loan_Period, @Interest_Rate, @Loan_Start_Date, @Approval_Cost, @Insurance_Cost, @Account_Cost, @Other_Costs, " +
                "@Monthly_Payment, @Total_Interest_Paid, @Total_Loan_Cost, @Loan_Payoff_Date,@Last_Version,@R_User_Id )" +
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

            //get the plan 
            List<Schedule> calculatedPlan = (await getSchedule(reqName)).Schedules;

            //start building the edited plan
            List<Schedule> editedPlan = new List<Schedule>();

            var monthlyPayment = req.Monthly_Payment;
            var numOfPayments = req.Loan_Period * 12;
            var totalLoanCost = req.Total_Loan_Cost;
            var currentDate = req.Loan_Start_Date.Date;
            var newName = req.Request_Name;

            Request editedRequest = req;
            await updateRequest(req.Request_Id.ToString()); //changes display flag to false 

            //get the new id to link the new entries
            int id = await InsertRequestDb(editedRequest);
            count++;
            Console.WriteLine(newName);

            bool owed = false, increased=false;
            int i = 0;
            decimal interestOwed=0, principalOwed=0, owedPayment=0, currentRemainingLoan = req.Loan_Amount;
            while (i<numOfPayments)
            {
                Schedule newEntry = new Schedule();

                //to retreive assumed principal and interest values before overriding them 
                if (!increased) newEntry = calculatedPlan.ElementAt(i);
                
                //update date and add the db retreived id to link entries to request 
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
                        //if list of payments not yet increased assumed monthly payment = fixed monthly calculated
                        //subtract partial payment from assumed monthly
                        owedPayment += monthlyPayment - missedPayment; // + late payment fee
                    }
                    else
                    {
                        //else assumed monthly is 0 bcs we increased the list of assumed payments
                        //subtract just the missed (partial) payment
                        owedPayment -= missedPayment; // + late payment fee
                        if (owedPayment == 0) owed = false;
                        if (owedPayment < 0) throw new InvalidInputException("Partial payment is greater than what is owed.");
                    }
                    //add assumed interest to owed
                    interestOwed += newEntry.Interest_Paid;
                    
                    //new interest calculated (default case for when ifs below dont happen)
                    newEntry.Interest_Paid = missedPayment - newEntry.Principal_Paid;

                    //if theres not enough money in missed payment to cover interest and principal even partly, missed payment goes to principal first

                    // if missed can cover principal and we increased the list (assumed monthly is 0 for the added payments)
                    if (missedPayment >= principalOwed && increased)
                    {
                        //principal will be exactly what is owed bcs missed can cover it
                        newEntry.Principal_Paid = principalOwed;
                        //interest is whole missed minus principal
                        newEntry.Interest_Paid = missedPayment - newEntry.Principal_Paid;
                    }
                    //if missed covers only principal nothing goes for interest
                    else if (missedPayment <= newEntry.Principal_Paid) {
                        newEntry.Principal_Paid = missedPayment;
                        newEntry.Interest_Paid = 0;
                    }
                    //could collapse these two else ifs into one
                    //same logic for increased list payments, but comparing with principalOwed since assumed principal is 0 for those
                    else if (missedPayment <= principalOwed && increased) {
                        newEntry.Principal_Paid = missedPayment;
                        newEntry.Interest_Paid = 0;
                    }

                    //in case some interest was paid subtract that from owed
                    interestOwed -= newEntry.Interest_Paid;

                    //update current remaining loan and store to new entry
                    currentRemainingLoan -= newEntry.Principal_Paid;
                    newEntry.Remaining_Loan = currentRemainingLoan;
                    
                    //principal is owed altogether minus interest owed
                    principalOwed = owedPayment - interestOwed;
                    
                    
                    //add the new entry to the db
                    editedPlan.Add(newEntry);
                    await InsertScheduleDb(newEntry);

                    //if were at the last month and there is still money owed incerase the list of payments by one at a time
                    if (i == numOfPayments - 1 && owed)
                    {
                        numOfPayments++;
                        increased = true;
                    }
                }
                else{
                    
                    if (!owed) {
                        //nothings owed, we can continue normally
                        currentRemainingLoan -= newEntry.Principal_Paid;
                    }

                    //if the list was increased this will be the last payment to be made
                    else if (increased) {
                        
                        //increased payments assumed values are all 0 so just set them to whats owed
                        newEntry.Monthly_Paid = owedPayment;
                        newEntry.Principal_Paid = principalOwed;
                        newEntry.Interest_Paid = interestOwed;
                       
                        //subtract principal
                        currentRemainingLoan -= newEntry.Principal_Paid;
                        newEntry.Remaining_Loan = currentRemainingLoan;
                    }

                    //this block executes after previous iteration was a missed payment 
                    else {
                        
                        //add whats owed to assumed for that month
                        newEntry.Monthly_Paid += owedPayment;
                        newEntry.Principal_Paid += principalOwed;
                        newEntry.Interest_Paid += interestOwed;
                        
                        //update remaining loan
                        currentRemainingLoan -= newEntry.Principal_Paid;
                        newEntry.Remaining_Loan = currentRemainingLoan;
                        
                        owed = false; //loan is paid off
                        owedPayment = 0;
                        interestOwed = 0;
                        principalOwed = 0;
                    }
                    //add the entry
                    await InsertScheduleDb(newEntry);
                    editedPlan.Add(newEntry);
                }
                i++;
            }
            return editedPlan;
        }


        public async Task<List<Schedule>> ApplyEarlyPayments(string reqName, Dictionary<int, decimal> earlyPayments)
        {
            Request req = null;
            try
            {
                //get the request from db by req name
                req = await getRequest(reqName);
            }
            catch
            {
                throw new QueryException("There is no request with that name.");
            }
            
            //get the plan 
            List<Schedule> calculatedPlan = (await getSchedule(reqName)).Schedules;
            
            //start building the edited plan
            List<Schedule> editedPlan = new List<Schedule>();

            var monthlyPayment = req.Monthly_Payment;
            var numOfPayments = req.Loan_Period * 12;
            var totalLoanCost = req.Total_Loan_Cost;
            var currentDate = req.Loan_Start_Date.Date;
            var monthlyInterestRate = (req.Interest_Rate/100) / 12;
            var newName = req.Request_Name;
            
            Request editedRequest = req;
            await updateRequest(req.Request_Id.ToString()); //changes display flag to false 

            //get the new id to link the new entries
            int id = await InsertRequestDb(editedRequest);
            count++;
            Console.WriteLine(newName);

            decimal advancePayment=0, currentRemainingLoan= req.Loan_Amount; //at beginning equal to total loan amount
            double interestRatio;
            bool paidInAdvance=false;
            int i = 0;
            while (i < numOfPayments)
            {
                Schedule newEntry = new Schedule();

                newEntry = calculatedPlan.ElementAt(i);//retreive old values of assumed principal, interest
                currentDate = currentDate.AddMonths(1);
                newEntry.Current_Date = currentDate;

                newEntry.S_Request_Id = id;
                //if a payment nr i is missed then the schedule at that index should be newly made
                if (earlyPayments.ContainsKey(i + 1))
                {
                    //get the value of the early payment
                    decimal earlyPayment = earlyPayments[i + 1];
                    if (earlyPayment < monthlyPayment) throw new InvalidInputException("Early payment must be equal to at least one monthly payment.");
                    if (earlyPayment > currentRemainingLoan) throw new InvalidInputException("Early payment cannot be greater than the remaining loan balance. Remaining balance is "+ Math.Round(currentRemainingLoan,2));

                    //see how many months the early payment covers

                    int monthsCovered = (int)(earlyPayment / monthlyPayment);
                    if (monthsCovered > numOfPayments - i - 1) throw new InvalidInputException("Early payment covers more payments than what is left.");
                    newEntry.Monthly_Paid = earlyPayment;
                    
                    
                    
                    interestRatio = (double)(newEntry.Interest_Paid / monthlyPayment);
                    newEntry.Interest_Paid = Math.Round((decimal)((double)earlyPayment * interestRatio), 2);
                    newEntry.Principal_Paid = Math.Round(earlyPayment - newEntry.Interest_Paid,2);
                    currentRemainingLoan -= newEntry.Principal_Paid;
                    newEntry.Remaining_Loan = Math.Round(currentRemainingLoan,2);
                    paidInAdvance = true;

                }
                else {
                    if (paidInAdvance)
                    {
                        paidInAdvance = false;
                        //if user chose to pay less for the nexts months, recalculate monthly
                        monthlyPayment = CalculateMonthly(currentRemainingLoan, monthlyInterestRate, numOfPayments - i);
                    }
                    newEntry.Monthly_Paid = (monthlyPayment);
                    newEntry.Interest_Paid = Math.Round((decimal)((double)currentRemainingLoan * monthlyInterestRate),2);
                    newEntry.Principal_Paid = Math.Round(newEntry.Monthly_Paid - newEntry.Interest_Paid,2);
                    currentRemainingLoan -= newEntry.Principal_Paid;
                    newEntry.Remaining_Loan = Math.Round(currentRemainingLoan, 2);
                }
                //add the entry
                await InsertScheduleDb(newEntry);
                editedPlan.Add(newEntry);
                i++;
            }
            return editedPlan;
        }

        public async Task<AmortizationPlan> getSchedule(string reqId)
        {
            var summary = await getRequest(reqId);
            var scheduleList = (await _db.QueryAsync<Schedule>("select * from \"AmortizationSchedule\" where s_request_id = ( " +
                "select request_id from \"Request\" where request_id=@reqid and r_user_id=@id)",
                new { reqid = Int32.Parse(reqId), id = Int32.Parse(_register.getUserId()) })).ToList();
            return new AmortizationPlan{
                Summary = summary,
                Schedules = scheduleList
            };
        }
        public async Task<Request> getRequest(string reqId)
        {
            return ((await _db.QueryAsync<Request>("select * from \"Request\" where request_id = @id",
                new { id = Int32.Parse(reqId) })).First());
        }

        public async Task<Request> updateRequest(string reqId)
        {
            return ((await _db.QueryAsync<Request>("UPDATE \"Request\" SET last_version = 'false' WHERE last_version = 'true' and request_name = @id",
                new { id = Int32.Parse(reqId) })).First());
        }

    }
}
