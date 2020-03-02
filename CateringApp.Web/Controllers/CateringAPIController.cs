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

        [HttpPost("")] //  POST: /api/catering
        public async Task<IActionResult> SubmitCatering([FromBody] CateringViewModel cateringViewModel)
        {
            Catering catering = new Catering
            {
                CateringName = cateringViewModel.CateringTitle,
                ClientName = cateringViewModel.ClientName
            };

            cateringDbContext.Add(catering);
            await cateringDbContext.SaveChangesAsync();

            List<CateringEmployees> empsJunctionTemp = new List<CateringEmployees>();

            foreach(UserViewModel User in cateringViewModel.AssignedUsers)
            {
                CateringEmployees temp = new CateringEmployees
                {
                    CateringId = catering.CateringId,
                    UserId = User.UserId
                };

                empsJunctionTemp.Add(temp);
            }

            cateringDbContext.AddRange(empsJunctionTemp);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }



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