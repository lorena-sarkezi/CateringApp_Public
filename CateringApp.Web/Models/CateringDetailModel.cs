using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CateringApp.Web.Models
{
    public class CateringDetailModel
    {
        public int CateringId { get; set; }

        public List<UserViewModel> Users { get; set; }
        public List<DishModel> Dishes { get; set; }
        public List<VehicleModel> Vehicles { get; set; }

        public CateringDetailModel()
        {
            Users = new List<UserViewModel>();
            Dishes = new List<DishModel>();
            Vehicles = new List<VehicleModel>();
        }
    }
}
