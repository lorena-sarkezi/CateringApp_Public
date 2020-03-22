using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CateringApp.Web.Controllers.Food
{
    [Route("food")]
    [Authorize(Roles = "ADMIN")]
    public class FoodViewController : Controller
    {
        [Route("categories")]
        public IActionResult FoodCategoriesView()
        {
            return View("/Views/Food/FoodCategoriesList.cshtml");
        }

        [Route("items")]
        public IActionResult FootItemsView()
        {
            return View("/Views/Food/FoodItemsList.cshtml");
        }
    }
}