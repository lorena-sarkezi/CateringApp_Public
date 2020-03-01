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
        public int CateringId { get; set; }
        public int DishId { get; set; }


        public virtual Catering Catering { get; set; }
        public virtual Dish Dish { get; set; }
    }
}
