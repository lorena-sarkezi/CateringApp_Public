using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CateringApp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using CateringApp.Data.Models;
using CateringApp.Data;
using Microsoft.EntityFrameworkCore;

namespace CateringApp.Web.Controllers
{
    [Authorize]
    [Route("/")]
    public class HomeViewController : Controller
    {
        private readonly CateringDbContext cateringDbContext;

        public HomeViewController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        public async Task<IActionResult> Index()
        {
            DateTime monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            DateTime monthEnd = monthStart.AddMonths(1).AddDays(-1);

            List<Catering> caterings = await cateringDbContext.Caterings
                                                              .Where(x => x.CateringDate > DateTime.Now && x.CateringDate < monthEnd)
                                                              .Where(x => x.IsClosed == false)
                                                              .ToListAsync();
            
            List<CateringViewModel> viewModels = caterings.Select(x => x.GetViewModel()).ToList();

            return View(@"\Views\Home\Index.cshtml", viewModels);
        }
       
    }
}
