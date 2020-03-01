using System;
using System.Collections.Generic;
using System.Text;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CateringApp.Data.Models
{
    [Table("caterings", Schema ="cat_app")]
    public class Catering
    {
        [Key, Required, Column("id"), DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CateringId { get; set; }

        [Required, Column("catering_name")]
        public string CateringName { get; set; }

        [Required, DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        public DateTime DateCreated { get; set; }

        public IEnumerable<CateringEmployees> CateringEmployees { get; set; }
    }
}
