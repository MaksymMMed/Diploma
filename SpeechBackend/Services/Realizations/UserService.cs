using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SpeechBackend.DTO;
using SpeechBackend.DTO.Users;
using SpeechBackend.Entities;
using SpeechBackend.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SpeechBackend.Services.Realizations
{
    public class UserService :  BaseService, IUserService
    {
        readonly IConfiguration _configuration;
        readonly IMapper _mapper;
        UserManager<User> _userManager { get; set; }

        public UserService(UserManager<User> manager, IConfiguration configuration,
            IMapper mapper, IHttpContextAccessor httpContext) : base(httpContext)
        {
            _mapper = mapper;
            _userManager = manager;
            _configuration = configuration;
        }

        public async Task<Result<string>> SignInUser(SignIn model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return Result<string>.Fail("Неправильний логін або пароль")!;

            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddHours(24),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            return Result<string>.Success(new JwtSecurityTokenHandler().WriteToken(token));
        }

        private async Task<Result<User>> CreateUser(SignUp model)
        {
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
                return Result<User>.Fail("Користувач вже існує")!;

            var user = new User()
            {
                Email = model.Email,
                SecurityStamp = Guid.NewGuid().ToString(),
                UserName = model.Username
            };
            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                return Result<User>.Success(null!);

            var errors = string.Join(" ", result.Errors.Select(x => x.Description));
            return Result<User>.Fail(errors)!;
        }

        private async Task<Result<string>> SignInUser(SignUp model) => await SignInUser(new SignIn
        {
            Email = model.Email,
            Password = model.Password
        });
        public async Task<Result<string>> SignUpUser(SignUp model)
        {
            var result = await CreateUser(model);
            if (!result.IsSuccess)
                return Result<string>.Fail(result.Error!)!;

            return await SignInUser(model);
        }

        public async Task<Result<UserInfoDto>> GetUserInfo()
        {
            var user = await _userManager.FindByIdAsync(CurrentUserId!);
            if (user!= null)
            {
                var mapped = _mapper.Map<UserInfoDto>(user);
                return Result<UserInfoDto>.Success(mapped);
            }
            return Result<UserInfoDto>.Fail("Користувача не знайдено")!;
        }
    }
}
