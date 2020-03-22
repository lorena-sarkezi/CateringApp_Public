using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApp.Data.Models
{
    [Table("dishes", Schema = "cat_app")]
    public class Dish
    {
        [Required, Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DishId { get; set; }

        [Required, Column("dish_name")]
        public string DishName { get; set; }

        [Column("dish_description")]
        public string DishDescription { get; set; }

        [Required, Column("dish_type_id"), ForeignKey("DishType")]
        public int DishTypeId { get; set; }

        [Required, Column("date_created"), DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateCreated { get; set; }

        public DishType DishType { get; set; }

        public IEnumerable<CateringDishes> CateringDishes { get; set; }
    }
}
