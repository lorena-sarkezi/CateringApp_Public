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

namespace CateringApp.Web.Controllers
{
    [Route("api/catering")]
    [ApiController]
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