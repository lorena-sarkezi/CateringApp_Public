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
            if(cateringViewModel.AssignedUsersIds != null && cateringViewModel.AssignedUsersIds.Count > 0)
            {
                Catering catering = new Catering
                {
                    CateringName = cateringViewModel.CateringTitle,
                    ClientName = cateringViewModel.ClientName
                };

                cateringDbContext.Add(catering);
                await cateringDbContext.SaveChangesAsync();

                List<CateringEmployees> empsJunctionTemp = new List<CateringEmployees>();

                foreach (int userId in cateringViewModel.AssignedUsersIds)
                {
                    CateringEmployees temp = new CateringEmployees
                    {
                        CateringId = catering.CateringId,
                        UserId = userId
                    };

                    empsJunctionTemp.Add(temp);
                }

                cateringDbContext.AddRange(empsJunctionTemp);
                await cateringDbContext.SaveChangesAsync();

                return Ok();
            }
            else
            {
                return new StatusCodeResult(500);
            }
            
        }

        [HttpGet("all")]
        public async Task<List<CateringViewModel>> GetAllCaterings()
        {
            List<Catering> allCateringsList = await cateringDbContext.Caterings
                                                                    .ToListAsync();

            List<CateringViewModel> cateringViewModels = allCateringsList.Select(x => x.GetViewModel()).ToList();

            return cateringViewModels;
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