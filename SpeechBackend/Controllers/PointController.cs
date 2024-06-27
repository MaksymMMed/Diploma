using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpeechBackend.DTO.Points;
using SpeechBackend.DTO.Users;
using SpeechBackend.Services.Interfaces;

namespace SpeechBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PointController : ControllerBase
    {
        readonly IPointsService _service;
        public PointController(IPointsService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("add-point")]
        public async Task<IActionResult> AddPoint([FromBody] CreatePointsDto dto)
        {
            var result = await _service.CreatePoint(dto);

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }

        [Authorize]
        [HttpGet("read-user-points")]
        public async Task<IActionResult> ReadPoints()
        {
            var result = await _service.ReadPoints();

            if (!result.IsSuccess)
                return BadRequest(result.Error);

            return Ok(result.Value);
        }
    }
}
