using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;
using Microsoft.AspNetCore.Authorization;
using CateringApp.Web.Models;

namespace CateringApp.Web.Controllers.Caterings
{
    [Route("caterings")]
    
    public class CateringsViewController : Controller
    {
        private readonly CateringDbContext cateringDbContext;

        public CateringsViewController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [Route("all")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult AllCaterings()
        {
            return View(@"\Views\Caterings\CateringsListAll.cshtml");
        }

        [Route("my")]
        [Authorize(Roles = "ADMIN,USER")]
        public IActionResult MyCaterings()
        {
            return View(@"\Views\Caterings\CateringsListMy.cshtml");
        }

        [Route("detail/{cateringId}")]
        public async Task<IActionResult> GetCateringDetailPartialView([FromRoute] int cateringId)
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

            string viewPath = @"\Views\Caterings\_CateringDetailModalContentPartial.cshtml";

            return PartialView(viewPath, model);
        }
    }
}