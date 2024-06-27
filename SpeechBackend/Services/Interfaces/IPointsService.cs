using SpeechBackend.DTO;
using SpeechBackend.DTO.Points;

namespace SpeechBackend.Services.Interfaces
{
    public interface IPointsService
    {
        Task<Result<bool>> CreatePoint(CreatePointsDto dto);
        Task<Result<List<ReadPointsDto>>> ReadPoints();
    }
}
