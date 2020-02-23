using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApp.Data.Models
{
    [Table("roles", Schema ="cat_app")]
    public class Role
    {
        [Required, Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RoleId { get; set; }

        [Required, Column("role_title")]
        public string RoleTitle { get; set; }

        [Required, Column("date_created")]
        public DateTime DateCreated { get; set; }
    }
}
