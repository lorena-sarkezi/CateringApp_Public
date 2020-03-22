using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class FoodItemViewModel
    {
        public int Id { get; set; } = 0;
        public int FoodCategoryId { get; set; }
        public string FoodCategoryName { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public static partial class ModelExtensions
    {
        public static Dish GetDbModel(this FoodItemViewModel model)
        {
            return new Dish
            {
                DishId = model.Id,
                DishName = model.Name,
                DishDescription = model.Description,
                DishTypeId = model.FoodCategoryId
            };
        }

        public static FoodItemViewModel GetViewModel(this Dish dish)
        {
            return new FoodItemViewModel
            {
                Id = dish.DishId,
                Name = dish.DishName,
                Description = dish.DishDescription,
                FoodCategoryId = dish.DishTypeId,
                FoodCategoryName = dish.DishType != null ? dish.DishType.DishTypeName : ""
            };
        }
    }
}
