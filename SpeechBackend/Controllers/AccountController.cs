using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpeechBackend.DTO.Users;
using SpeechBackend.Services.Interfaces;

namespace SpeechBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        readonly IUserService _service;
        public AccountController(IUserService service)
        {
            _service = service;
        }
        

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp([FromBody] SignUp model)
        {
            var result = await _service.SignUpUser(model);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value); 
        }

        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn([FromBody] SignIn model)
        {
            var result = await _service.SignInUser(model);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [Authorize]
        [HttpGet("get-user-info")]
        public async Task<IActionResult> GetUserInfo()
        {
            var result = await _service.GetUserInfo();

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }
    }
}
