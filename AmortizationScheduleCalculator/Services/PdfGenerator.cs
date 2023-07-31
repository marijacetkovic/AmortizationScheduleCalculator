using AmortizationScheduleCalculator.Model;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;
using Microcharts;
using SkiaSharp;
using System.Collections.Generic;
using System.Web.Helpers;


namespace AmortizationScheduleCalculator.Services
{
    public class PdfGenerator : IPdfGenerator
    {

        private readonly IDbConnection _db;
        private readonly IUserRegistration _register;
        private readonly ICalculateAmortizationPlan _calculate;

        public PdfGenerator(IDbConnection db, IUserRegistration register, ICalculateAmortizationPlan calculate)
        {
            _db = db;
            _register = register;
            _calculate = calculate;
        }

        public async Task<FileStreamResult> GeneratePdf(string reqName)
        {
            var stream = new MemoryStream();
            var response = await _calculate.getSchedule(reqName);
            List<Schedule> schedules = response.Schedules;
            Request summary = response.Summary;
            string htmlContent = "";
            int userId = Int32.Parse(_register.getUserId());
            string user = _register.getCurrentUser(userId);

            foreach (var schedule in schedules)
            {
                htmlContent += schedule.ToString() + "\n";
            }

                   var entries = new[]
                {
                    new ChartEntry((float)summary.Total_Interest_Paid)
                    {
                        Label = "Total Interest Paid",
                        ValueLabel = (float)summary.Total_Interest_Paid+"€",
                        Color = SKColor.Parse("#c1d3e6")
                    },
                    new ChartEntry((float)summary.Loan_Amount)
                    {
                        Label = "Total Principal Paid",
                        ValueLabel = (float)summary.Loan_Amount+"€",
                        Color = SKColor.Parse("#7393B3")
                    },
                    new ChartEntry((float)summary.Total_Loan_Cost)
                    {
                        Label = "Total Amount Paid",
                        ValueLabel = (float)summary.Total_Loan_Cost+"€",
                        Color = SKColor.Parse("#35608c")
                    }
                };

            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(20));



                    page.Header()
                        .Text("Amortization Schedule calculated for request " + summary.Request_Name)
                        .SemiBold().FontSize(16).FontColor(Colors.Blue.Medium);



                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                         .Column(col =>
                         {
                             col.Item().Table(table => {



                                 IContainer DefaultCellStyle(IContainer container, string backgroundColor)
                                 {
                                     return container
                                         .Border(1)
                                         .BorderColor(Colors.Blue.Lighten3)
                                         .Background(backgroundColor)
                                         .PaddingVertical(5)
                                         .PaddingHorizontal(10)
                                         .AlignCenter()
                                         .AlignMiddle()
                                         .DefaultTextStyle(x => x.FontSize(12));
                                 }

                                 table.ColumnsDefinition(columns =>
                                 {
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                 });

                                 table.Header(header =>
                                 {
                                     // please be sure to call the 'header' handler!

                                     header.Cell().Element(CellStyle).Text("Loan Amount");
                                     header.Cell().Element(CellStyle).Text("Loan Period");

                                     header.Cell().Element(CellStyle).Text("Interest Rate");
                                     header.Cell().Element(CellStyle).Text("Loan Start Date");

                                     // you can extend existing styles by creating additional methods
                                     IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.Blue.Lighten4);
                                 });
                                 var payoffDate = summary.Loan_Start_Date;
                                 string pMonth = payoffDate.ToString("MMM").ToUpper().Substring(0, 3);
                                 int pYear = payoffDate.Year;
                                 table.Cell().Element(CellStyle).Text(summary.Loan_Amount + "€");
                                 table.Cell().Element(CellStyle).Text(summary.Loan_Period + " year/s");

                                 table.Cell().Element(CellStyle).Text(summary.Interest_Rate + "%");
                                 table.Cell().Element(CellStyle).Text(pMonth + " " + pYear);

                                 IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.White).ShowOnce();

                             });
                             col.Item().PaddingVertical((float)0.5, Unit.Centimetre);
                             col.Item().Table(table => {

                                 IContainer DefaultCellStyle(IContainer container, string backgroundColor)
                                 {
                                     return container
                                         .Border(1)
                                         .BorderColor(Colors.Blue.Lighten3)
                                         .Background(backgroundColor)
                                         .PaddingVertical(5)
                                         .PaddingHorizontal(10)
                                         .AlignCenter()
                                         .AlignMiddle()
                                         .DefaultTextStyle(x => x.FontSize(12));
                                 }



                                 table.ColumnsDefinition(columns =>
                                 {
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                 });



                                 table.Header(header =>
                                 {
                                     // please be sure to call the 'header' handler!

                                     header.Cell().Element(CellStyle).Text("Fixed Monthly Payment");
                                     header.Cell().Element(CellStyle).Text("Total Interest Amount");



                                     header.Cell().Element(CellStyle).Text("Total Loan Amount");
                                     header.Cell().Element(CellStyle).Text("Payoff Date");



                                     // you can extend existing styles by creating additional methods
                                     IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.Blue.Lighten4);
                                 });
                                 var payoffDate = summary.Loan_Payoff_Date;
                                 string pMonth = payoffDate.ToString("MMM").ToUpper().Substring(0, 3);
                                 int pYear = payoffDate.Year;
                                 table.Cell().Element(CellStyle).Text(summary.Monthly_Payment + "€");
                                 table.Cell().Element(CellStyle).Text(summary.Total_Interest_Paid + "€");


                                 table.Cell().Element(CellStyle).Text(summary.Total_Loan_Cost + "€");
                                 table.Cell().Element(CellStyle).Text(pMonth + " " + pYear);

                                 IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.White).ShowOnce();



                             });
                             col.Item().PaddingVertical(1, Unit.Centimetre);
                             col.Item()
                                .Border((float)0).BorderColor(Colors.Blue.Lighten3)
                                .DefaultTextStyle(t=>t.FontSize(10))
                                .Height(300)
                                .Canvas((canvas, size) =>
                                {
                         
                                    var chart = new BarChart
                                    {
                                        Entries = entries,

                                        LabelOrientation = Orientation.Horizontal,
                                        ValueLabelOrientation = Orientation.Horizontal,

                                        IsAnimated = false,
                                    };
                                    chart.LabelTextSize = 12;

                                    chart.DrawContent(canvas, (int)size.Width, (int)size.Height);
                                });
                             col.Item().PaddingVertical(1, Unit.Centimetre);
                             col.Item().Table(table =>
                             {
                                 IContainer DefaultCellStyle(IContainer container, string backgroundColor)
                                 {
                                     return container
                                         .Border(1)
                                         .BorderColor(Colors.Blue.Lighten4)
                                         .Background(backgroundColor)
                                         .PaddingVertical(5)
                                         .PaddingHorizontal(10)
                                         .AlignCenter()
                                         .AlignMiddle()
                                         .DefaultTextStyle(x => x.FontSize(12));
                                 }



                                 table.ColumnsDefinition(columns =>
                                 {
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();
                                     columns.RelativeColumn();



                                     //columns.ConstantColumn(75);
                                     //columns.ConstantColumn(75);



                                     //columns.ConstantColumn(75);
                                     //columns.ConstantColumn(75);
                                 });



                                 table.Header(header =>
                                 {
                                     // please be sure to call the 'header' handler!



                                     header.Cell().Element(CellStyle).Text("Date");
                                     header.Cell().Element(CellStyle).Text("Principal");



                                     header.Cell().Element(CellStyle).Text("Interest");
                                     header.Cell().Element(CellStyle).Text("Remaining balance");



                                     // you can extend existing styles by creating additional methods
                                     IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.Blue.Lighten5);
                                 });



                                 foreach (var schedule in schedules)
                                 {
                                     //table.Cell().Element(CellStyle).ExtendHorizontal().AlignLeft().Text(page.name);



                                     var date = schedule.Current_Date;
                                     string month = date.ToString("MMM").ToUpper().Substring(0, 3);
                                     int year = date.Year;
                                     table.Cell().Element(CellStyle).Text(month + " " + year);
                                     table.Cell().Element(CellStyle).Text(schedule.Principal_Paid + "€");
                       table.Cell().Element(CellStyle).Text(schedule.Interest_Paid + "€");
                                     table.Cell().Element(CellStyle).Text(schedule.Remaining_Loan + "€");



                                     IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.White).ShowOnce();
                                 }
                             });
                         });
                    page.Footer()
                        .AlignCenter()
                        .Row(row =>
                        {
                            row.RelativeColumn().Text(x =>
                            {
                                x.Span("Page ");
                                x.CurrentPageNumber();
                                x.DefaultTextStyle(x => x.FontSize(10));
                            });
                            row.RelativeColumn().Text(x =>
                            {
                                x.Line("Issuer:" + summary.Issuer);
                                x.Line("Date Issued: " + summary.Date_Issued);
                                x.DefaultTextStyle(x => x.FontSize(10));
                            });
                        });
                });
            })
            .GeneratePdf(stream);
            stream.Position = 0;
            return new FileStreamResult(stream, "application/pdf") { FileDownloadName = "Amort Plan " + reqName };
        }
    }
}
