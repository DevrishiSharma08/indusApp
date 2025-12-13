using Indus.Api.Data;
using Indus.Api.Interfaces;
using Indus.Api.Repositories;
using Indus.Api.Services;
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000") // Next.js port
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials(); // 👈 Important for cookies
        });
});


// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddControllers();

// Register ADO.NET Database Connection
builder.Services.AddSingleton<DatabaseConnection>();

// Register Repositories (Data Access Layer)
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepositoryAdo>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepositoryAdo>();
builder.Services.AddScoped<IDesignationRepository, DesignationRepositoryAdo>();
builder.Services.AddScoped<IRoleRepository, RoleRepositoryAdo>();

// Register Services (Business Logic Layer)
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IDesignationService, DesignationService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<AuthService>();

// ***** AUTHENTICATION SETUP *****
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "IndusApp.AuthCookie";
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        
        // API events
        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401; // Unauthorized
            return Task.CompletedTask;
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = 403; // Forbidden
            return Task.CompletedTask;
        };
    });

builder.Services.AddAuthorization();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();


app.Run();
