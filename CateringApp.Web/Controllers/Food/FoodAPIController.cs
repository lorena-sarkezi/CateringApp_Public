using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CateringApp.Web.Models;
using CateringApp.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace CateringApp.Web.Controllers.Food
{
    [Route("api/food")]
    [ApiController]
    [Authorize(Roles = "ADMIN")]
    public class FoodAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;

        public FoodAPIController(CateringDbContext cateringDbContext)
        {
            this.cateringDbContext = cateringDbContext;
        }

        [HttpGet("category/all")]
        public async Task<IEnumerable<FoodCategoryViewModel>> GetAllFoodCategories()
        {
            List<DishType> dishTypes = await cateringDbContext.DishTypes.ToListAsync();

            return dishTypes.Select(x => x.GetViewModel());
        }

        [HttpGet("category/with_foods")]
        public async Task<IEnumerable<FoodCategoryViewModel>> GetAllFoodCategoriesAssignedToFoods()
        {
            List<DishType> dishTypes = await cateringDbContext.DishTypes.ToListAsync();
            List<int> dishTypeIdCollection = await cateringDbContext.Dishes.Select(x => x.DishTypeId).Distinct().ToListAsync();

            List<DishType> dishTypesAssignedToFoods = dishTypes.Where(x => dishTypeIdCollection.Contains(x.DishTypeId)).ToList();

            return dishTypesAssignedToFoods.Select(x => x.GetViewModel());
        }

        [HttpGet("category/{categoryId}")]
        public async Task<FoodCategoryViewModel> Get([FromRoute] int categoryId)
        {
            DishType dishType = await cateringDbContext.DishTypes.FirstOrDefaultAsync(x => x.DishTypeId == categoryId);

            return dishType.GetViewModel();
        }

        [HttpPost("category")]
        public async Task<IActionResult> SubmitCategory([FromBody] FoodCategoryViewModel model)
        {
            DishType dishType = model.GetDbModel();

            cateringDbContext.Add(dishType);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("category/{categoryId}")]
        public async Task<IActionResult> UpdateCategory([FromRoute] int categoryId, [FromBody] FoodCategoryViewModel model)
        {
            DishType dishType = model.GetDbModel();

            cateringDbContext.Update(dishType);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("category/{categoryId}")]
        public async Task<IActionResult> DeleteCategory([FromRoute] int categoryId)
        {
            await cateringDbContext.Database.ExecuteSqlCommandAsync($"EXEC [cat_app].[delete_dish_type] {categoryId}");

            return Ok();
        }


        [HttpGet("item/all")]
        public async Task<List<FoodItemViewModel>> GetAllFoodItems()
        {
            List<Dish> dishes = await cateringDbContext.Dishes
                                                       .Include(x => x.DishType)
                                                       .ToListAsync();

            List<FoodItemViewModel> models = dishes.Select(x => x.GetViewModel()).ToList();

            return models;
        }

        [HttpGet("item/{itemId}")]
        public async Task<FoodItemViewModel> GetFoodItem([FromRoute] int itemId)
        {
            Dish dish = await cateringDbContext.Dishes.FirstOrDefaultAsync(x => x.DishId == itemId);

            return dish.GetViewModel();
        }

        [HttpPost("item")]
        public async Task<IActionResult> SubmitFoodItem([FromBody] FoodItemViewModel model)
        {
            Dish dish = model.GetDbModel();
            
            cateringDbContext.Add(dish);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("item/{itemId}")]
        public async Task<IActionResult> UpdateFoodItem([FromRoute] int itemId, [FromBody] FoodItemViewModel model)
        {
            Dish dish = model.GetDbModel();

            cateringDbContext.Update(dish);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("item/{itemId}")]
        public async Task<IActionResult> DeleteFoodItem([FromRoute] int itemId)
        {
            List<CateringDishes> dishes = await cateringDbContext.CateringDishes.Where(x => x.DishId == itemId).ToListAsync();
            Dish dish = await cateringDbContext.Dishes.FirstOrDefaultAsync(x => x.DishId == itemId);

            cateringDbContext.RemoveRange(dishes);
            cateringDbContext.Remove(dish);

            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }
    }
}