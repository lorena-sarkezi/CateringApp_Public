using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using CateringApp.Data;
using CateringApp.Data.Models;

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



    }
}