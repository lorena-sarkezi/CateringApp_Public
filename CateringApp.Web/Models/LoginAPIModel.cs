using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CateringApp.Web.Models
{
    public class LoginAPIModel
    {
        public string Email { get; set; }

        public string Password { get; set; }

        public bool RememberMe { get; set; }
    }
}
