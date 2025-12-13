using Microsoft.Data.SqlClient;

namespace Indus.Api.Data
{
    /// <summary>
    /// Manages database connections for ADO.NET
    /// </summary>
    public class DatabaseConnection
    {
        private readonly string _connectionString;

        public DatabaseConnection(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
        }

        /// <summary>
        /// Creates and returns a new SQL connection
        /// </summary>
        public SqlConnection GetConnection()
        {
            return new SqlConnection(_connectionString);
        }

        /// <summary>
        /// Gets the connection string
        /// </summary>
        public string ConnectionString => _connectionString;
    }
}
