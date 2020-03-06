using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;

namespace CateringApp.Web.Controllers.Caterings
{
    [Route("caterings")]
    public class CateringsController : Controller
    {
        private readonly CateringDbContext cateringDbContext;

        public CateringsController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [Route("list")]
        public IActionResult Index()
        {
            Data.Models.User user = cateringDbContext.Users.FirstOrDefault();
            return View("CateringsList");
        }
    }
}