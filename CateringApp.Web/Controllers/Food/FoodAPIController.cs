using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;


namespace CateringApp.Web.Controllers.Food
{
    [Route("api/food")]
    [ApiController]
    [Authorize]
    public class FoodAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;

        public FoodAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        //[HttpGet("categories")]
        //public async Task<IActionResult>
    }
}