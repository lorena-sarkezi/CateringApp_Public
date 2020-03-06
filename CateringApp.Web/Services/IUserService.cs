using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;
using CateringApp.Web.Models;

namespace CateringApp.Web.Services
{
    public interface IUserService
    {
        string TryLoginUser(LoginAPIModel model);
        User GetUserById(int UserId);
    }
}
