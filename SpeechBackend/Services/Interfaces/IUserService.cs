using SpeechBackend.DTO;
using SpeechBackend.DTO.Users;

namespace SpeechBackend.Services.Interfaces
{
    public interface IUserService
    {
        Task<Result<string>> SignInUser(SignIn model);
        Task<Result<string>> SignUpUser(SignUp model);
        Task<Result<UserInfoDto>> GetUserInfo();
    }
}