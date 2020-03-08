using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class VehicleModel
    {
        public int VehicleId { get; set; }
        public string VehicleName { get; set; }
    }


    public static partial class ModelExtensions
    {
        public static VehicleModel GetViewModel(this Vehicle vehicle)
        {
            return new VehicleModel
            {
                VehicleId = vehicle.VehicleId,
                VehicleName = vehicle.VehicleName
            };
        }
    }
}
