using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
using CateringApp.Data.Models;
using CateringApp.Web.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CateringApp.Web.Controllers.Users
{
    [Route("api/users")]
    [ApiController]
    public class UsersAPIController : Controller
    {
        private readonly CateringDbContext cateringDbContext;

        public UsersAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [HttpGet("")]
        public async Task<List<UserViewModel>> GetUsers()
        {

            List<UserViewModel> users = (await cateringDbContext.Users.ToListAsync()).Select(x => x.GetViewModel()).ToList();

            return users;
        }

        [HttpPost("")]
        public async Task<IActionResult> SubmitUser([FromBody] UserViewModel viewModel)
        {
            User user = viewModel.GetDbModel();

            user.PasswordHash = "CantHashToHCString";

            cateringDbContext.Add(user);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("")]
        public async Task<IActionResult> DeleteUser([FromBody] int userId)
        {
            User deleteUser = new User();
            deleteUser.UserId = userId;

            cateringDbContext.Users.Remove(deleteUser);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}