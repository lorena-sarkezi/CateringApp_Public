using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class FoodCategoryViewModel
    {
        public int Id { get; set; } = 0;
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public static partial class ModelExtensions
    {
        public static DishType GetDbModel(this FoodCategoryViewModel model)
        {
            return new DishType
            {
                DishTypeId = model.Id,
                DishTypeName = model.Name,
                DishTypeDescription = model.Description
            };
        }

        public static FoodCategoryViewModel GetViewModel(this DishType dishType)
        {
            return new FoodCategoryViewModel
            {
                Id = dishType.DishTypeId,
                Name = dishType.DishTypeName,
                Description = dishType.DishTypeDescription
            };
        }
    }
}
