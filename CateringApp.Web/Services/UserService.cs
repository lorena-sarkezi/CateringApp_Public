using CateringApp.Data.Models;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;
using CateringApp.Web.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace CateringApp.Web.Services
{
    public class UserService: IUserService
    {
        private readonly AppSettings appSettings;
        private readonly CateringDbContext cateringDbContext;

        public UserService(IOptions<AppSettings> appSettings, CateringDbContext cateringDbContext)
        {
            this.appSettings = appSettings.Value;
            this.cateringDbContext = cateringDbContext;
        }

        public string Authenticate(string email, string password)
        {
            User user = cateringDbContext.Users
                                .Include(x => x.Role)
                                .FirstOrDefault(x => x.Email == email);

            if (user == null) return null;

            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(appSettings.Secret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Name, (user.Name + user.Surname)),
                    new Claim(ClaimTypes.Role, user.Role.RoleTitle)
                }),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };


            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
