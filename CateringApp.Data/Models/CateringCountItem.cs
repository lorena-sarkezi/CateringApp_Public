using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace CateringApp.Data.Models
{
    public class CateringCountItem
    {
        [Column("Month")]
        public int Month { get; set; }

        [Column("CateringCount")]
        public int CateringCount { get; set; }
    }
}
