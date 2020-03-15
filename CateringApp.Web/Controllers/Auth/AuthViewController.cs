using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CateringApp.Web.Controllers.Auth
{
    [Route("")]
    public class AuthViewController : Controller
    {
        [Route("/login")]
        public IActionResult Login()
        {
            return View(@"\Views\Auth\Login.cshtml");
        }
    }
}