using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using CateringApp.Web.Models;
using Microsoft.AspNetCore.Authorization;

namespace CateringApp.Web.Controllers
{
    [Authorize]
    [Route("/")]
    public class HomeViewController : Controller
    {
        public IActionResult Index()
        {
            return View(@"\Views\Home\Index.cshtml");
        }
       
    }
}
