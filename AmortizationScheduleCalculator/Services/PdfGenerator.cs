using AmortizationScheduleCalculator.Model;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using System;

namespace AmortizationScheduleCalculator.Services
{
    public class PdfGenerator:IPdfGenerator
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

        public async Task GeneratePdf(string reqName)
        {
            List<Schedule> schedules = await _calculate.getSchedule(reqName);
            string htmlContent = "";
            int userId = Int32.Parse(_register.getUserId());
            string user = _register.getCurrentUser(userId);
           
            foreach (var schedule in schedules)
            {
                htmlContent += schedule.ToString() + "\n";
            }

            Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(2, Unit.Centimetre);
                    page.PageColor(Colors.White);
                    page.DefaultTextStyle(x => x.FontSize(20));

                    page.Header()
                        .Text("Amortization Schedule Calculated")
                        .SemiBold().FontSize(14).FontColor(Colors.Blue.Medium);

                    page.Content()
                        .PaddingVertical(1, Unit.Centimetre)
                        .Table(table =>
                        {
                            IContainer DefaultCellStyle(IContainer container, string backgroundColor)
                            {
                                return container
                                    .Border(1)
                                    .BorderColor(Colors.Grey.Lighten1)
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
                                IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.Grey.Lighten3);
                            });

                            foreach (var schedule in schedules)
                            {
                                //table.Cell().Element(CellStyle).ExtendHorizontal().AlignLeft().Text(page.name);

                                // inches
                                var date = schedule.Current_Date;
                                string month = date.ToString("MMM");
                                int year = date.Year;
                                table.Cell().Element(CellStyle).Text(month+" "+year);
                                table.Cell().Element(CellStyle).Text(schedule.Principal_Paid);

                                // points
                                table.Cell().Element(CellStyle).Text(schedule.Interest_Paid);
                                table.Cell().Element(CellStyle).Text(schedule.Remaining_Loan);

                                IContainer CellStyle(IContainer container) => DefaultCellStyle(container, Colors.White).ShowOnce();
                            }
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
                            row.RelativeColumn().Text(user);
                        });
                });
            })
            .GeneratePdf(reqName + ".pdf");
        }
    }
}
