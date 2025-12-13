using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Repositories
{
    public class DepartmentRepositoryAdo : IDepartmentRepository
    {
        private readonly DatabaseConnection _dbConnection;

        public DepartmentRepositoryAdo(DatabaseConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<IEnumerable<Department>> GetAllAsync()
        {
            List<Department> departments = new List<Department>();

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = "SELECT DepartmentID, DepartmentName FROM Departments ORDER BY DepartmentName";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            departments.Add(new Department
                            {
                                DepartmentID = reader.GetInt32(0),
                                DepartmentName = reader.GetString(1)
                            });
                        }
                    }
                }
            }

            return departments;
        }

        public async Task<Department?> GetByIdAsync(int departmentId)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = "SELECT DepartmentID, DepartmentName FROM Departments WHERE DepartmentID = @DepartmentID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@DepartmentID", departmentId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Department
                            {
                                DepartmentID = reader.GetInt32(0),
                                DepartmentName = reader.GetString(1)
                            };
                        }
                    }
                }
            }

            return null;
        }

        public async Task<int> CountAsync()
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = "SELECT COUNT(*) FROM Departments";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    return (int)await cmd.ExecuteScalarAsync();
                }
            }
        }
    }
}
