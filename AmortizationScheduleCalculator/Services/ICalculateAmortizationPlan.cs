using AmortizationScheduleCalculator.Model;

namespace AmortizationScheduleCalculator.Services
{
    public interface ICalculateAmortizationPlan
    {
        Task<List<Schedule>> CreateNewCalculation(Request request);
        Task<List<Schedule>> ApplyPartialPayments(string reqName, Dictionary<int, decimal> missedPayments);
        Task<List<Schedule>> ApplyEarlyPayments(string reqName, Dictionary<int, decimal> earlyPayments);
        Task<List<Schedule>> getSchedule(string reqName);
        Task<Request> getRequest(string reqName);
    }
}
