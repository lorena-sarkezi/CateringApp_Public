using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
using CateringApp.Data.Models;
using CateringApp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CateringApp.Web.Controllers.Home
{
    [Route("api/home")]
    [ApiController]
    [Authorize]
    public class HomeAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;

        public HomeAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [HttpGet("count/open")]
        public async Task<IActionResult> GetOpenCateringCount()
        {
            int cnt = await cateringDbContext.Caterings.CountAsync(x => x.IsClosed == false);

            return Ok(cnt);
        }

        [HttpGet("count/closed")]
        public async Task<IActionResult> GetClosedCteringCount()
        {
            int cnt = await cateringDbContext.Caterings.CountAsync(x => x.IsClosed == true);

            return Ok(cnt);
        }

        [HttpGet("count/months")]
        public async Task<IActionResult> GetCateringsCountOverMonthsCurrYear()
        {
            var items = cateringDbContext.CateringCounts
                                         .FromSqlRaw("select Month, CateringCount from [cat_app].[get_caterings_in_current_year]()")
                                         .OrderBy(x => x.Month)
                                         .Select(x => x.CateringCount)
                                         .ToList();

            return Ok(items);
        }

        [HttpGet("count/current_month")]
        public async Task<IActionResult> GetCateringsForCurrentMonth()
        {
            DateTime monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            DateTime monthEnd = monthStart.AddMonths(1).AddDays(-1);

            IEnumerable<Catering> caterings = await cateringDbContext.Caterings
                                                                     .Where(x => x.CateringDate > monthStart && x.CateringDate < monthEnd)
                                                                     .Where(x => x.IsClosed == false)
                                                                     .ToListAsync();
            var res = caterings.Select(x => x.GetViewModel()).ToList();
            
            return Ok(res);
        }       
    
    }

    

}