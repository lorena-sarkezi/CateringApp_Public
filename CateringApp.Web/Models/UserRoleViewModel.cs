using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class UserRoleViewModel
    {
        public int RoleId { get; set; }
        public string RoleTitle { get; set; }
    }

    public static partial class ModelExtensions
    {
        public static UserRoleViewModel GetViewModel(this Role role)
        {
            return new UserRoleViewModel
            {
                RoleId = role.RoleId,
                RoleTitle = role.RoleTitle
            };
        } 
    }
}
