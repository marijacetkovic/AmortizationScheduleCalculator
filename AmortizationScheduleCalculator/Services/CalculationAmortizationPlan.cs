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
        public async Task<List<Schedule>>  CreateNewCalculation( Request scheduleReq, Dictionary<int,decimal> missedPayments)
        {
            Console.WriteLine("ovo debugujem "+_register.getUserId());
            //scheduleReq.R_User_Id = Int32.Parse(_register.getUserId());
            scheduleReq.R_User_Id = 1;
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
            monthlyPaymentFixed = calculateMonthly(loanAmount, monthlyInterestRate, numOfPayments);
            

            totalLoanCost = monthlyPaymentFixed * numOfPayments;
            totalInterestPaid = totalLoanCost - loanAmount;
            loanPayoffDate = loanStartDate.AddMonths(numOfPayments);

            //update calculations

            scheduleReq.Monthly_Payment = monthlyPaymentFixed;
            scheduleReq.Total_Interest_Paid = totalInterestPaid;
            scheduleReq.Total_Loan_Cost = totalLoanCost;
            scheduleReq.Loan_Payoff_Date = loanPayoffDate;

            //store to database
            int id = await insertRequestDb(scheduleReq);
            Console.WriteLine("\n SADdsa asddsa as dads das asd sda \n");
            Console.WriteLine(id);
            
            var currentDate = loanStartDate.Date;
            decimal interestPayment, remainingBalance = loanAmount, principalPayment;
            int numOfPaymentsLeft = numOfPayments;
            var scheduleList = new List<Schedule>();

            decimal leftoverPayment;
            int i = 1;
            decimal monthlyPayment = monthlyPaymentFixed;
            while (i<=numOfPayments)
            {
                currentDate = currentDate.AddMonths(1);
                interestPayment = ((decimal)((double)remainingBalance * monthlyInterestRate));
                decimal assumedMonthly = monthlyPaymentFixed;
                decimal assumedPrincipal = monthlyPayment - interestPayment;
                leftoverPayment = 0;
                if (missedPayments.ContainsKey(i))
                {
                    decimal partialPayment = missedPayments[i];
                    //monthly is principal and interest
                    //when we pay less interest stays the same - calc based on remaining balance
                    //but principal is less 
                    //leftoverPayment is what is owed (interest and leftover principal)
                    leftoverPayment =monthlyPayment - partialPayment;
                    
                    //and monthly becomes what is paid for that month 
                    monthlyPayment = partialPayment;

                    //theres enough money only for th eprincipal
                    if (assumedPrincipal >= monthlyPayment) {
                        //we dnt want negative principal
                        principalPayment = monthlyPayment;
                        interestPayment = 0;
                    }
                    else{
                        //else everything goes for principal
                        principalPayment = assumedPrincipal;
                        interestPayment = monthlyPayment - assumedPrincipal;
                    }
                }
                else {
                    principalPayment = monthlyPayment - interestPayment;
                }
                
                remainingBalance -= principalPayment;
                if (Math.Round(remainingBalance,4)<= 0) remainingBalance = 0;

                decimal monthlyRounded = Math.Round(monthlyPayment, 2);
                principalPayment = Math.Round(principalPayment, 2);
                interestPayment = Math.Round(interestPayment,2);
                var remainingRounded = Math.Round(remainingBalance,2);
                Schedule newSchedule = new Schedule(currentDate.Date, monthlyRounded, principalPayment, interestPayment, remainingRounded, id);
                scheduleList.Add(newSchedule);
                await insertScheduleDb(newSchedule);
                numOfPaymentsLeft--;

                //if remaining balance is not yet 0 on last iteration
                if (remainingBalance != 0 && i == numOfPayments)
                {
                    numOfPaymentsLeft++;
                    numOfPayments++;
                    Console.WriteLine(remainingBalance + " remaining balance on iteration " + i);
                }
                if (leftoverPayment == 0 && numOfPaymentsLeft != 0)
                {
                    monthlyPayment = monthlyPaymentFixed;      
                }
                else {
                    if (numOfPaymentsLeft == 1)
                    {
                        monthlyPayment = leftoverPayment;
                    }
                    else
                    {
                        monthlyPayment = leftoverPayment + assumedMonthly;
                    }
                    //for next month
                    
                    
                }
               
                i++;
            }
            return scheduleList;
        
        }

        private decimal calculateMonthly(decimal loanAmount, double monthlyInterestRate, int numOfPayments) {
            var monthlyPayment = (decimal)(((double)loanAmount * (monthlyInterestRate * Math.Pow(1 + monthlyInterestRate, numOfPayments))) 
                / (Math.Pow(1 + monthlyInterestRate, numOfPayments) - 1));
            return monthlyPayment;
        }

        private async Task<int> insertRequestDb(Request newRequest)
        {
           return await _db.QuerySingleAsync<int>("insert into \"Request\" " +
                "(request_name,loan_amount,loan_period,interest_rate,loan_start_date,approval_cost,insurance_cost, account_cost,other_costs," +
                "monthly_payment,total_interest_paid,total_loan_cost,loan_payoff_date,r_user_id) " +
                "values (@Request_Name,@Loan_Amount, @Loan_Period, @Interest_Rate, @Loan_Start_Date, @Approval_Cost, @Insurance_Cost, @Account_Cost, @Other_Costs, " +
                "@Monthly_Payment, @Total_Interest_Paid, @Total_Loan_Cost, @Loan_Payoff_Date,@R_User_Id )" +
                "RETURNING request_id", newRequest);
        }
        private async Task insertScheduleDb(Schedule newSchedule)
        {
            await _db.ExecuteAsync("insert into \"AmortizationSchedule\" (\"current_date\",monthly_paid,principal_paid,interest_paid,remaining_loan," +
                    "s_request_id)\r\nvalues (@Current_Date,@Monthly_Paid,@Principal_Paid,@Interest_Paid,@Remaining_Loan,@S_Request_Id)", newSchedule);
        }
    }
}
