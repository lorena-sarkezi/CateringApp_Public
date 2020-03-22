using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
using CateringApp.Data.Models;
using CateringApp.Web.Helpers;
using CateringApp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CateringApp.Web.Controllers.Users
{
    [Route("api/users")]
    [ApiController]
    [Authorize(Roles = "ADMIN")]
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

            List<UserViewModel> users = (await cateringDbContext.Users.Include(x => x.Role).ToListAsync()).Select(x => x.GetViewModel()).ToList();

            return users;
        }

        [HttpGet("{userId}")]
        public async Task<UserViewModel> GetUser([FromRoute] int userId)
        {
            User user = await cateringDbContext.Users.Include(x => x.Role).FirstOrDefaultAsync(x => x.UserId == userId);

            return user.GetViewModel();
        }

        [HttpGet("roles")]
        public async Task<List<UserRoleViewModel>> GetUserRoles()
        {
            List<Role> roles = await cateringDbContext.Roles.ToListAsync();

            List<UserRoleViewModel> viewModels = roles.Select(x => x.GetViewModel()).ToList();

            return viewModels;
        }

        [HttpPost("")]
        public async Task<IActionResult> SubmitUser([FromBody] UserViewModel viewModel)
        {
            User user = viewModel.GetDbModel();

            user.PasswordHash = Sha256Helper.GetHash(viewModel.Password);

            cateringDbContext.Add(user);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("password/{userId}")]
        public async Task<IActionResult> ChangeUserPassword([FromRoute] int userId, [FromBody] UserPasswordModel model)
        {
            User user = await cateringDbContext.Users.FirstOrDefaultAsync(x => x.UserId == userId);

            string utfPassword = Base64.Base64Decode(model.Password);

            user.PasswordHash = Sha256Helper.GetHash(utfPassword);

            cateringDbContext.Update(user);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> UpdateUser([FromRoute] int userId, [FromBody] UserViewModel model)
        {
            User user = model.GetDbModel();
            user.PasswordHash = (await cateringDbContext.Users.AsNoTracking().FirstOrDefaultAsync(x => x.UserId == userId)).PasswordHash; //Sprjecavanje overwritanja lozinke jer se lozinka nikada ne bi trebala prenositi na ovaj endpoint

            cateringDbContext.Update(user);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser([FromRoute] int userId)
        {
            User deleteUser = new User();
            deleteUser.UserId = userId;

            List<CateringEmployees> employees = await cateringDbContext.CateringEmployees.Where(x => x.UserId == userId).ToListAsync();

            cateringDbContext.CateringEmployees.RemoveRange(employees);
            cateringDbContext.Users.Remove(deleteUser);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}