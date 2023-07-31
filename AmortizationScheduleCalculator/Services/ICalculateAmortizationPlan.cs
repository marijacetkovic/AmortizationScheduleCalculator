using AmortizationScheduleCalculator.Model;

namespace AmortizationScheduleCalculator.Services
{
    public interface ICalculateAmortizationPlan
    {
        Task<AmortizationPlan> CreateNewCalculation(Request request);
        Task<AmortizationPlan> ApplyPartialPayments(string reqName, Dictionary<int, decimal> missedPayments);
        Task<AmortizationPlan> ApplyEarlyPayments(string reqName, Dictionary<int, decimal> earlyPayments);
        Task<AmortizationPlan> getSchedule(string reqName);
        Task<Request> getRequest(string reqName);
        Task<Request> updateRequest(string reqName);
        Task<List<Request>> getAuditHistory(string parentReqId);
    }
}
