using Microsoft.AspNetCore.Mvc;

namespace AmortizationScheduleCalculator.Services
{
    public interface IPdfGenerator
    {
        Task<FileStreamResult> GeneratePdf(string reqName);
    }
}
