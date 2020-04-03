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
using Microsoft.AspNetCore.Authorization;

namespace CateringApp.Web.Controllers.Vehicles
{
    [Route("api/vehicles")]
    [ApiController]
    [Authorize(Roles = "ADMIN")]
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

        [HttpGet("{vehicleId}")]
        public async Task<VehicleViewModel> GetVehicle([FromRoute] int vehicleId)
        {
            Vehicle vehicle = await cateringDbContext.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);

            return vehicle.GetViewModel();
        }

        [HttpPost("")]
        public async Task<IActionResult> SubmitVehicle([FromBody] VehicleViewModel viewModel)
        {
            Vehicle vehicle = viewModel.GetDbModel();

            cateringDbContext.Add(vehicle);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("{vehicleId}")]
        public async Task<IActionResult> PutVehicle([FromRoute] int vehicleId, [FromBody] VehicleViewModel model)
        {
            Vehicle vehicle = await cateringDbContext.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);
            vehicle.VehicleName = model.VehicleName;
            vehicle.Registration = model.VehicleRegistration;
            decimal km = (decimal)model.VehicleKilometers;
            vehicle.Kilometers =  Math.Truncate(100 * km) / 100; //Truncate to 2 decimal places

            cateringDbContext.Update<Vehicle>(vehicle);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{vehicleId}")]
        public async Task<IActionResult> DeleteVehicle([FromRoute] int vehicleId)
        {
            Vehicle vehicle = await cateringDbContext.Vehicles.FirstOrDefaultAsync(x => x.VehicleId == vehicleId);

            cateringDbContext.Remove<Vehicle>(vehicle);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}