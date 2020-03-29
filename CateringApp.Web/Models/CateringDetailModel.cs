using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;
using CateringApp.Web.Models;

namespace CateringApp.Web.Models
{
    public class CateringDetailModel
    {
        public int CateringId { get; set; }

        public string CateringName { get; set; }
        public string ClientName { get; set; }

        public bool IsClosed { get; set; }

        public string ClosingComment { get; set; }

        public List<UserViewModel> Users { get; set; }
        public List<FoodItemViewModel> Dishes { get; set; }
        public List<VehicleViewModel> Vehicles { get; set; }

        public CateringDetailModel()
        {
            Users = new List<UserViewModel>();
            Dishes = new List<FoodItemViewModel>();
            Vehicles = new List<VehicleViewModel>();
        }
    }

    public static partial class ModelExtensions
    {
        public static CateringDetailModel GetCateringDetailModel(this Catering catering)
        {
            CateringDetailModel model = new CateringDetailModel
            {
                CateringId = catering.CateringId,
                CateringName = catering.CateringName,
                ClientName = catering.ClientName,
                IsClosed = catering.IsClosed,
                ClosingComment = catering.ClosingComment
            };

            if(catering.CateringEmployees != null)
            {
                model.Users = catering.CateringEmployees.Select(x => x.User.GetViewModel()).ToList();
            }

            if(catering.CateringDishes != null)
            {
                model.Dishes = catering.CateringDishes.Select(x => x.Dish.GetViewModel()).ToList();
            }

            if(catering.Vehicle != null)
            {
                model.Vehicles = new List<VehicleViewModel> { catering.Vehicle.GetViewModel() };
            }

            return model;
        }
    }
}
