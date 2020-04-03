using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CateringApp.Web.Controllers.Error
{
    [Route("error")]
    public class ErrorController : Controller
    {
        [Route("401")]
        public IActionResult UnauthorizedError()
        {
            return View(@"\Views\Error\Unauthorized.cshtml");
        }

        [Route("404")]
        public IActionResult NotFoundError()
        {
            return View(@"\Views\Error\NotFound.cshtml");
        }

        [Route("500")]
        public IActionResult InternalServerError()
        {
            return View(@"\Views\Error\InternalServerError.cshtml");
        }
    }
}