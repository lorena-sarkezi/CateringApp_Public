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
        public async Task<List<CateringViewModel>> GetAllCaterings()
        {
            List<Catering> allCateringsList = await cateringDbContext.Caterings
                                                                     .ToListAsync();

            List<CateringViewModel> cateringViewModels = allCateringsList.Select(x => x.GetViewModel()).ToList();
           
            return cateringViewModels;
        }

       [HttpGet("{cateringId}")]
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
        public async Task<IActionResult> SubmitCatering([FromBody] CateringDetailModel model)
        {
            Catering catering = new Catering
            {
                CateringName = model.CateringName,
                ClientName = model.ClientName,
                VehicleId = (int)model.Vehicles[0].VehicleId
            };

            cateringDbContext.Caterings.Add(catering);
            await cateringDbContext.SaveChangesAsync();

            List<CateringEmployees> cateringEmployees = new List<CateringEmployees>();

            foreach (UserViewModel user in model.Users)
            {
                cateringEmployees.Add(new CateringEmployees
                {
                    CateringId = catering.CateringId,
                    UserId = user.UserId ?? -1
                });
            }

            cateringDbContext.AddRange(cateringEmployees);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }
        [HttpPut("{cateringId}")]
        public async Task<IActionResult> UpdateCatering([FromRoute] int cateringId,  [FromBody] CateringDetailModel model)
        {
            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .Include(x => x.CateringDishes)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            catering.CateringName = model.CateringName;
            catering.ClientName = model.ClientName;
            catering.VehicleId = (int)model.Vehicles[0].VehicleId;

            catering.CateringEmployees = model.Users.Select(x => new CateringEmployees
            {
                CateringId = cateringId,
                UserId = (int)x.UserId
            }).ToList();

            cateringDbContext.Update<Catering>(catering);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{cateringId}")]
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