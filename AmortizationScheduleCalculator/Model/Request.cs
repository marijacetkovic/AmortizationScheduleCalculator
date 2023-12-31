﻿using Npgsql.PostgresTypes;

namespace AmortizationScheduleCalculator.Model
{
    public class Request
    {
        public int Request_Id { get; set; }
        //these user enters
        public string Request_Name { get; set; }
        public required decimal Loan_Amount { get; set; }
        public int Loan_Period { get; set; }
        public double Interest_Rate { get; set; }
        public DateTime Loan_Start_Date { get; set; }
        public bool Last_Version { get; set; }
        public DateTime Date_Issued { get; set; }
        public string Issuer { get; set; }

        //these are optional
        public decimal Approval_Cost { get; set; }
        public decimal Insurance_Cost { get; set; }
        public decimal Account_Cost { get; set; }
        public decimal Other_Costs { get; set; }

        //these get calculated
        public decimal Monthly_Payment { get; set; }
        public decimal Total_Interest_Paid { get; set; }
        public decimal Total_Other_Costs { get; set; }
        public decimal Total_Loan_Cost { get; set; }
        public DateTime Loan_Payoff_Date { get; set; }

        //foreign key
        public int R_User_Id { get; set; }

        public bool IsEmpty()
        {
            return Loan_Amount == 0 && Loan_Period == 0 && Interest_Rate == 0;
        }

    }
}
