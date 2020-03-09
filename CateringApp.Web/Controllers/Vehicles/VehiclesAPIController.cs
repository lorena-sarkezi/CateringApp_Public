﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;
using CateringApp.Web.Models;

namespace CateringApp.Web.Controllers.Vehicles
{
    [Route("api/vehicles")]
    [ApiController]
    public class VehiclesAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;

        public VehiclesAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [HttpGet("")]
        public async Task<List<VehicleViewModel>> GetVehicles()
        {
            List<VehicleViewModel> vehicles = (await cateringDbContext.Vehicles.ToListAsync()).Select(x => x.GetViewModel()).ToList();

            return vehicles;
        }

        [HttpPost("")]
        public async Task<IActionResult> SubmitVehicle([FromBody] VehicleViewModel viewModel)
        {
            Vehicle vehicle = viewModel.GetDbModel();

            cateringDbContext.Add(vehicle);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}