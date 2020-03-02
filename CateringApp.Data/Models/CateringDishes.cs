using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace CateringApp.Data.Models
{
    [Table("catering_dishes", Schema = "cat_app")]
    public class CateringDishes
    {
        [Required, Column("catering_id")]
        public int CateringId { get; set; }

        [Required, Column("dish_id")]
        public int DishId { get; set; }

        [Required, Column("date_created")]
        public DateTime DateCreated { get; set; }


        public virtual Catering Catering { get; set; }
        public virtual Dish Dish { get; set; }
    }
}
