using AutoMapper;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace SpeechBackend.Services
{
    public abstract class BaseService(IHttpContextAccessor httpContextAccessor)
    {
        protected readonly IHttpContextAccessor HttpContextAccessor = httpContextAccessor;

        public string? CurrentUserEmail => HttpContextAccessor.HttpContext!.User.GetValueByClaimType(ClaimTypes.Email);

        public string? CurrentUserId => HttpContextAccessor.HttpContext!.User.GetValueByClaimType(ClaimTypes.NameIdentifier);

        
    }
    public static class ClaimsPrincipalExtensions
    {
        public static string? GetValueByClaimType(this ClaimsPrincipal claim, string claimType)
        {
            return claim.HasClaim(x => x.Type == claimType)
                ? claim.FindFirstValue(claimType)
                : null;
        }
    }
}
