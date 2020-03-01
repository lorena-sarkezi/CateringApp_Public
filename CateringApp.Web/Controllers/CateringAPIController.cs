using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;

using CateringApp.Web.Models;

namespace CateringApp.Web.Controllers
{
    [Route("api/catering")]
    [ApiController]
    public class CateringAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;

        public CateringAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [HttpGet]


        [HttpGet("users")]
        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {
            IEnumerable<User> users = await cateringDbContext.Users
                                                             .ToListAsync();

            IEnumerable<UserViewModel> userViewModels = users.Select(x => x.GetViewModel())
                                                             .ToList();

            return userViewModels;
        }

    }
}