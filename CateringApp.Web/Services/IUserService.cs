using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;
using CateringApp.Web.Models;

namespace CateringApp.Web.Services
{
    interface IUserService
    {
        User Authenticate(string email, string password);
    }
}
