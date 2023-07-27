using AmortizationScheduleCalculator.Exceptions;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace AmortizationScheduleCalculator.Middleware
{
    public class ExceptionHandlingMiddleware : IMiddleware
    {
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        public ExceptionHandlingMiddleware (ILogger<ExceptionHandlingMiddleware> logger)
        {
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (InvalidInputException e)
            {                _logger.LogError(e, e.Message);
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                ProblemDetails problem = new()
                {
                    Status = (int)HttpStatusCode.BadRequest,
                    Type = "Invalid input",
                    Title = "Invalid input",
                    Detail = e.Message
                };

                var errorResponse = JsonSerializer.Serialize(problem);
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsync(errorResponse);
            }
            catch (QueryException e) {
                _logger.LogError(e, e.Message);
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                ProblemDetails problem = new()
                {
                    Status = (int)HttpStatusCode.InternalServerError,
                    Type = "Invalid query",
                    Title = "Invalid query",
                    Detail = e.Message
                };

                var errorResponse = JsonSerializer.Serialize(problem);
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsync(errorResponse);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                ProblemDetails problem = new()
                {
                    Status = (int)HttpStatusCode.InternalServerError,
                    Type = "Server error",
                    Title = "Server error",
                    Detail = e.Message
                };

                var errorResponse = JsonSerializer.Serialize(problem);
                context.Response.ContentType = "application/json";

                await context.Response.WriteAsync(errorResponse);
            }
        }


    }
}
