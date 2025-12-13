using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Repositories
{
    public class DesignationRepositoryAdo : IDesignationRepository
    {
        private readonly DatabaseConnection _dbConnection;

        public DesignationRepositoryAdo(DatabaseConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<IEnumerable<Designation>> GetAllAsync()
        {
            List<Designation> designations = new List<Designation>();

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = "SELECT DesignationID, DesignationName FROM Designations ORDER BY DesignationName";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            designations.Add(new Designation
                            {
                                DesignationID = reader.GetInt32(0),
                                DesignationName = reader.GetString(1)
                            });
                        }
                    }
                }
            }

            return designations;
        }

        public async Task<Designation?> GetByIdAsync(int designationId)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = "SELECT DesignationID, DesignationName FROM Designations WHERE DesignationID = @DesignationID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@DesignationID", designationId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Designation
                            {
                                DesignationID = reader.GetInt32(0),
                                DesignationName = reader.GetString(1)
                            };
                        }
                    }
                }
            }

            return null;
        }
    }
}
