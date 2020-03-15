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
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("Index");
        }
       
    }
}
