using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class CateringViewModel
    {
        public string CateringTitle { get; set; }
        public int[] AssignedUsers { get; set; }
    }

}
