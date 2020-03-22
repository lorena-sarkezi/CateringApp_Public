using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApp.Data.Models
{
    [Table("dish_types", Schema ="cat_app")]
    public class DishType
    {
        [Required, Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int DishTypeId { get; set; }

        [Required, Column("dish_type_name")]
        public string DishTypeName { get; set; }

        [Column("dish_type_description")]
        public string DishTypeDescription { get; set; }

        [Required, Column("date_created"), DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateCreated { get; set; }
    }
}
