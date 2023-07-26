using Microsoft.AspNetCore.Mvc;

namespace AmortizationScheduleCalculator.Services
{
    public interface IPdfGenerator
    {
        Task GeneratePdf(string reqName);
    }
}
