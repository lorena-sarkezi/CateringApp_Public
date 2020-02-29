using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CateringApp.Data.Models
{
    [Table("users", Schema = "cat_app")]
    public class User
    {
        [Required, Key, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }

        [Required, ForeignKey("Role"), Column("role_id")]
        public int RoleId { get; set; }

        [Required, Column("name")]
        public string Name { get; set; }

        [Required, Column("surname")]
        public string Surname { get; set; }

        [Required, Column("email")]
        public string Email { get; set; }

        [Required, Column("username")]
        public string Username { get; set; }

        [Required, Column("password_hash")]
        public string PasswordHash { get; set; }

        [Required, Column("date_created"), DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateCreated { get; set; }



        public virtual Role Role { get; set; }
    }
}
