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
using CateringApp.Web.Services;

namespace CateringApp.Web.Controllers.Auth
{
    [Route("api/auth")]
    [ApiController]
    public class AuthAPIController : ControllerBase
    {
        private readonly IUserService userService;

        public AuthAPIController(CateringDbContext cateringDbContext, IUserService userService)
        {
            this.userService = userService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginAPIModel model)
        {
            string token = userService.TryLoginUser(model);  //Returns a valid JWT token if logged in successfuly, NULL if not

            if (token == null) return Unauthorized();

            CookieOptions cookieOptions = new CookieOptions
            {
                IsEssential = true
            };

            if (model.RememberMe == true) cookieOptions.Expires = DateTime.Now.AddYears(10);

            Response.Cookies.Append("token", token, cookieOptions);

            return Ok();
        }
    }
}