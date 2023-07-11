using Npgsql;
using System.Data;

namespace AmortizationScheduleCalculator.Context
{
    public class DatabaseHelper
    {
        public static IDbConnection CreateConnection()
        {
            return new NpgsqlConnection("Server=localhost;Database=postgres;User Id=postgres;Password=manjaadmin;Port=5432;");
        }
    }
}
