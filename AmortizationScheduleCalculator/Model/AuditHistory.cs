namespace AmortizationScheduleCalculator.Model
{
    public class AuditHistoryEntry
    {
        public int AH_Id { get; set; }
        public string Issuer { get; set; }
        public DateTime Date_Issued { get; set; }
        public int Parent_Request_Id { get; set; }
        public int Child_Request_Id { get; internal set; }
    }
}
