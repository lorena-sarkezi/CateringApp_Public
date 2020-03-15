using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;
using Microsoft.AspNetCore.Authorization;

namespace CateringApp.Web.Controllers.Caterings
{
    [Route("caterings")]
    [Authorize]
    public class CateringsViewController : Controller
    {
        private readonly CateringDbContext cateringDbContext;

        public CateringsViewController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        public IActionResult Index()
        {
            return View(@"\Views\Caterings\CateringsList.cshtml");
        }
    }
}