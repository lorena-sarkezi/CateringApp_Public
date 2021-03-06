﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CateringApp.Web.Controllers.Users
{
    [Route("users")]
    [Authorize(Roles = "ADMIN")]
    public class UsersViewController : Controller
    {
        private readonly CateringDbContext cateringDbContext;

        public UsersViewController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        public IActionResult Index()
        {
            return View(@"\Views\Users\UsersList.cshtml");
        }
    }
}