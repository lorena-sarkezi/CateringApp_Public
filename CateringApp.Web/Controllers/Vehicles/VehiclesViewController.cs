using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using CateringApp.Data;
using CateringApp.Data.Models;

namespace CateringApp.Web.Controllers.Vehicles
{
    [Route("Vehicles")]
    public class VehiclesViewController : Controller
    {
        private readonly CateringDbContext cateringDbContext;

        public VehiclesViewController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        public IActionResult Index()
        {
            return View(@"\Views\Vehicles\VehiclesList.cshtml");
        }
    }
}