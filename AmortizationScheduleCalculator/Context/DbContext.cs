using Microsoft.Data.SqlClient;
using System.Data;

namespace AmortizationScheduleCalculator.Context
{
    public class DbContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        public DbContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("SqlConnection");
        }
        //make a sql connection using the connection string
        public IDbConnection CreateConnection() => new SqlConnection(_connectionString); 
    }
}
