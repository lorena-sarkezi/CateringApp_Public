using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
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

        public async Task<IActionResult> GetOpenCateringCount()
        {
            int cnt = await cateringDbContext.Caterings.CountAsync(x => x.IsClosed == false);

            return Ok(cnt);
        }

        public async Task<IActionResult> GetClosedCteringCount()
        {
            int cnt = await cateringDbContext.Caterings.CountAsync(x => x.IsClosed == true);

            return Ok(cnt);
        }
    }
}