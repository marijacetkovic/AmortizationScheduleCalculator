using AmortizationScheduleCalculator.Model;

namespace AmortizationScheduleCalculator.Services
{
    public interface ICalculateAmortizationPlan
    {
        Task<List<Schedule>> CreateNewCalculation(Request request);
    }
}
