using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApp.Data.Models
{
    [Table("catering_employees", Schema = "cat_app")]
    public class CateringEmployees
    {
        [Required, Column("user_id"), ForeignKey("User")]
        public int UserId { get; set; }

        [Required, Column("catering_id"), ForeignKey("Catering")]
        public int CateringId { get; set; }

        [Required, Column("date_created")]
        public DateTime DateCreated { get; set; }

        public virtual Catering Catering { get; set; }
        public virtual User User { get; set; }
    }
}
