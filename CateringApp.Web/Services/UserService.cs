using CateringApp.Data.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Web.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using CateringApp.Web.Helpers;

namespace CateringApp.Web.Services
{
    public class UserService: IUserService
    {
        private readonly AuthSettings appSettings;
        private readonly CateringDbContext cateringDbContext;

        public UserService(IOptions<AuthSettings> appSettings, CateringDbContext cateringDbContext)
        {
            this.appSettings = appSettings.Value;
            this.cateringDbContext = cateringDbContext;
        }

        public string TryLoginUser(LoginAPIModel model)
        {
            User user = cateringDbContext.Users
                                .Include(x => x.Role)
                                .Where(x => x.Email == model.Email || x.Username == model.Email)
                                .Where(x => x.PasswordHash == Sha256Helper.GetHash(model.Password))
                                .FirstOrDefault();

            if (user == null) return null;

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim(ClaimTypes.Role, user.Role.RoleTitle)
                }),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };


            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public User GetUserById(int UserId)
        {
            User user = cateringDbContext.Users
                                    .Include(x => x.Role)
                                    .FirstOrDefault(x => x.UserId == UserId);

            return user;
        }
    }
}
