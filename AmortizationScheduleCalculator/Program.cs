using AmortizationScheduleCalculator.Context;
using AmortizationScheduleCalculator.Model;
using Microsoft.Data.SqlClient;
using System.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddScoped<IDbConnection>(db => DatabaseHelper.CreateConnection());
var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}




//services.AddSpaStaticFiles(configuration =>
//{
//    configuration.RootPath = "ClientApp/build";
//});

//// Configure()
//app.UseStaticFiles();
//app.UseSpaStaticFiles();
//app.UseSpa(spa =>
//{
//    spa.Options.SourcePath = "ClientApp";
//    if (env.IsDevelopment())
//    {
//        spa.UseReactDevelopmentServer(npmScript: "start");
//    }
//});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
