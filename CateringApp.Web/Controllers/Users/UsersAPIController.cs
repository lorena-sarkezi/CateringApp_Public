using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
using Microsoft.AspNetCore.Mvc;

namespace CateringApp.Web.Controllers.Users
{
    public class placeholderUsers
    {
        public int idUser { get; set; }
        public string fullName { get; set; }//naming convetion slightly tilted, just like Borna
        public string uloga { get; set; }
    }

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
        public async Task<List<placeholderUsers>> GetUsers()
        {
            //List<VehicleViewModel> vehicles = (await cateringDbContext.Vehicles.ToListAsync()).Select(x => x.GetViewModel()).ToList();
            //provjeriti kako radi poziv u prvoj liniji komentara
            //vidit da je to mvc smeće
            //poslati "$$" separated string
            //?????
            //profitirati

            List<placeholderUsers> users = new List<placeholderUsers>();

            users.Add(new placeholderUsers { idUser = 0, fullName = "admin", uloga = "Administrator" });
            users.Add(new placeholderUsers { idUser = -1, fullName = "user", uloga = "Zaposlenik" });

            users.Add(new placeholderUsers { idUser = 1, fullName = "Marko Benjak", uloga = "Zaposlenik" });
            users.Add(new placeholderUsers { idUser = 2, fullName = "Borna Šarkezi", uloga = "Zaposlenik" });
            users.Add(new placeholderUsers { idUser = 3, fullName = "Ivan Zeko", uloga = "Zaposlenik" });

            return users;
        }

        //[HttpPost("")]
        //public async Task<IActionResult> SubmitVehicle([FromBody] VehicleViewModel viewModel)
        //{
        //    Vehicle vehicle = viewModel.GetDbModel();

        //    cateringDbContext.Add(vehicle);
        //    await cateringDbContext.SaveChangesAsync();

        //    return Ok();
        //}
    }
}