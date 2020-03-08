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
    [Authorize]
    public class AuthAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;
        private readonly IUserService userService;

        public AuthAPIController(CateringDbContext cateringDbContext, IUserService userService)
        {
            this.cateringDbContext = cateringDbContext;
            this.userService = userService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public IActionResult Login([FromBody] LoginAPIModel model)
        {

            string tst = userService.TryLoginUser(model);  //Returns a valid JWT token if login successfuly, NULL if not

            if (tst != null) return new RedirectToRouteResult("~/Error", new { }, true);

            else return Ok();
        }

        [HttpGet("test")] 
        public void Test()
        {
            throw new NotImplementedException();
        }
    }
}