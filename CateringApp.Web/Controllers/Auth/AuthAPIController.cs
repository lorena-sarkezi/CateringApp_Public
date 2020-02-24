using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;

using CateringApp.Web.Models;
using Microsoft.AspNetCore.Authorization;

namespace CateringApp.Web.Controllers
{
    [Route("api/v1/auth")]
    [ApiController]
    [Authorize]
    public class AuthAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;

        public AuthAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [HttpPost("login")]
        public async Task<bool> Login([FromBody] LoginAPIModel model)
        {
            User user = await cateringDbContext.Users.FirstOrDefaultAsync(x => x.Email == model.Email);

            if (user != null) return true;
            return false;
        }
    }
}