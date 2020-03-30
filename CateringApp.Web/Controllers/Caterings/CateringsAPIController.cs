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
using System.Security.Claims;

namespace CateringApp.Web.Controllers
{
    [Route("api/catering")]
    [ApiController]
    [Authorize]
    public class CateringsAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;

        public CateringsAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }


        [HttpGet("all_names_only")]
        [Authorize(Roles = "ADMIN")]
        public async Task<List<CateringViewModel>> GetAllCaterings()
        {
            List<Catering> allCateringsList = await cateringDbContext.Caterings
                                                                     .ToListAsync();

            List<CateringViewModel> cateringViewModels = allCateringsList.Select(x => x.GetViewModel()).ToList();
           
            return cateringViewModels;
        }

        [HttpGet("user")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IEnumerable<CateringViewModel>> GetAllCateringsForCurrentUser()
        {
            string userIdStr = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            int userId = int.Parse(userIdStr);

            IQueryable<int> cateringEmployeesQry = cateringDbContext.CateringEmployees
                                                                        .Where(x => x.UserId == userId)
                                                                        .Select(x => x.CateringId)
                                                                        .Distinct();

            IEnumerable<Catering> caterings = await cateringDbContext.Caterings
                                                                     .Where(x => cateringEmployeesQry.Contains(x.CateringId))
                                                                     .ToListAsync();

            return caterings.Select(x => x.GetViewModel());
        }

        [HttpGet("{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<CateringDetailModel> GetSingleCateringDetails([FromRoute] int cateringId)
        {
            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .ThenInclude(x => x.User)
                                                       .Include(x => x.CateringDishes)
                                                       .ThenInclude(x => x.Dish)
                                                       .ThenInclude(x => x.DishType)
                                                       .Include(x => x.Vehicle)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            CateringDetailModel model = catering.GetCateringDetailModel();

            return model;
        }

        [HttpPost("")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> SubmitCatering([FromBody] CateringDetailModel model)
        {
            Catering catering = new Catering
            {
                CateringName = model.CateringName,
                ClientName = model.ClientName,
                VehicleId = (int)model.Vehicles[0].VehicleId
            };

            if (catering.VehicleId == 0) catering.VehicleId = null;

            cateringDbContext.Caterings.Add(catering);
            await cateringDbContext.SaveChangesAsync();

            List<CateringEmployees> cateringEmployees = new List<CateringEmployees>();
            List<CateringDishes> cateringDishes = new List<CateringDishes>();

            foreach (UserViewModel user in model.Users)
            {
                cateringEmployees.Add(new CateringEmployees
                {
                    CateringId = catering.CateringId,
                    UserId = user.UserId ?? -1
                });
            }

            foreach(FoodItemViewModel item in model.Dishes)
            {
                cateringDishes.Add(new CateringDishes
                {
                    CateringId = catering.CateringId,
                    DishId = item.Id
                });
            }

            cateringDbContext.AddRange(cateringEmployees);
            cateringDbContext.AddRange(cateringDishes);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("close/{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CloseCatering([FromRoute] int cateringId, [FromBody] CateringClosingModel model)
        {
            Catering catering = await cateringDbContext.Caterings.FirstOrDefaultAsync(x => x.CateringId == cateringId);
            catering.ClosingComment = model.ClosingComment;
            catering.IsClosed = true;

            cateringDbContext.Caterings.Update(catering);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
            
        }

        [HttpPut("{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateCatering([FromRoute] int cateringId,  [FromBody] CateringDetailModel model)
        {
            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .Include(x => x.CateringDishes)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            catering.CateringName = model.CateringName;
            catering.ClientName = model.ClientName;
            catering.VehicleId = (int)model.Vehicles[0].VehicleId;

            if (catering.VehicleId == 0) catering.VehicleId = null;

            catering.CateringEmployees = model.Users.Select(x => new CateringEmployees
            {
                CateringId = cateringId,
                UserId = (int)x.UserId
            }).ToList();

            catering.CateringDishes = model.Dishes.Select(x => new CateringDishes
            {
                CateringId = cateringId,
                DishId = x.Id
            }).ToList();

            cateringDbContext.Update<Catering>(catering);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteCatering([FromRoute] int cateringId)
        {
            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .Include(x => x.CateringDishes)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            cateringDbContext.Remove<Catering>(catering);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
            
        }


        [HttpGet("details")]
        [Authorize(Roles = "ADMIN")]
        public async Task<CateringDetailModel> GetCateringCreationData()
        {
            CateringDetailModel retModel = new CateringDetailModel();
            
            List<User> users = await cateringDbContext.Users.ToListAsync();
            List<Vehicle> vehicles = await cateringDbContext.Vehicles.ToListAsync();


            foreach(User user in users)
            {
                retModel.Users.Add(user.GetViewModel());
            }

            foreach (Vehicle vehicle in vehicles)
            {
                retModel.Vehicles.Add(vehicle.GetViewModel());
            }


            return retModel;
        }

        


        [HttpGet("users")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {
            IEnumerable<User> users = await cateringDbContext.Users
                                                             .ToListAsync();

            IEnumerable<UserViewModel> userViewModels = users.Select(x => x.GetViewModel())
                                                             .ToList();

            return userViewModels;
        }

    }
}