using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class DishViewModel
    {
        public int DishId { get; set; }
        public string DishName { get; set; }
        public string DishType { get; set; }
    }

    public static partial class ModelExtensions
    {
        public static DishViewModel GetViewModel(this Dish dish)
        {
            return new DishViewModel
            {
                DishId = dish.DishId,
                DishName = dish.DishName,
                DishType = dish.DishType.DishTypeName
            };
        }
    }
}
