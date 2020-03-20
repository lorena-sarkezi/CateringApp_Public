using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class VehicleViewModel
    {
        public int? VehicleId { get; set; }
        public string VehicleRegistration { get; set; }
        public double VehicleKilometers { get; set; }
        public string VehicleName { get; set; }
    }


    public static partial class ModelExtensions
    {
        public static VehicleViewModel GetViewModel(this Vehicle vehicle)
        {
            return new VehicleViewModel
            {
                VehicleId = vehicle.VehicleId,
                VehicleName = vehicle.VehicleName,
                VehicleRegistration = vehicle.Registration,
                VehicleKilometers = (double)vehicle.Kilometers
            };
        }

        public static Vehicle GetDbModel(this VehicleViewModel viewModel)
        {
            return new Vehicle
            {
                VehicleId = viewModel.VehicleId ?? 0,
                VehicleName = viewModel.VehicleName,
                Registration = viewModel.VehicleRegistration,
                Kilometers = (decimal)viewModel.VehicleKilometers
            };
        }
    }
}
