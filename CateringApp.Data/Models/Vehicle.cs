using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApp.Data.Models
{
    [Table("vehicles", Schema = "cat_app")]
    public class Vehicle
    {
        [Required, Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int VehicleId { get; set; }

        [Required, Column("vehicle_name")]
        public string VehicleName { get; set; }

        [Required, Column("date_created"), DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateCreated { get; set; }


    }
}
