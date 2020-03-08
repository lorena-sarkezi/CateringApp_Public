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
        public string VehicleName { get; set; }
    }


    public static partial class ModelExtensions
    {
        public static VehicleViewModel GetViewModel(this Vehicle vehicle)
        {
            return new VehicleViewModel
            {
                VehicleId = vehicle.VehicleId,
                VehicleName = vehicle.VehicleName
            };
        }

        public static Vehicle GetDbModel(this VehicleViewModel viewModel)
        {
            return new Vehicle
            {
                VehicleId = viewModel.VehicleId ?? 0,
                VehicleName = viewModel.VehicleName
            };
        }
    }
}
