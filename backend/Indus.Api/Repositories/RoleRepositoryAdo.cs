using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Models;
using Microsoft.Data.SqlClient;

namespace Indus.Api.Repositories
{
    public class RoleRepositoryAdo : IRoleRepository
    {
        private readonly DatabaseConnection _dbConnection;

        public RoleRepositoryAdo(DatabaseConnection dbConnection)
        {
            _dbConnection = dbConnection;
        }

        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            List<Role> roles = new List<Role>();

            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = "SELECT RoleID, RoleName FROM Roles ORDER BY RoleName";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            roles.Add(new Role
                            {
                                RoleID = reader.GetInt32(0),
                                RoleName = reader.GetString(1)
                            });
                        }
                    }
                }
            }

            return roles;
        }

        public async Task<Role?> GetByIdAsync(int roleId)
        {
            using (SqlConnection conn = _dbConnection.GetConnection())
            {
                await conn.OpenAsync();

                string query = "SELECT RoleID, RoleName FROM Roles WHERE RoleID = @RoleID";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@RoleID", roleId);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new Role
                            {
                                RoleID = reader.GetInt32(0),
                                RoleName = reader.GetString(1)
                            };
                        }
                    }
                }
            }

            return null;
        }
    }
}
