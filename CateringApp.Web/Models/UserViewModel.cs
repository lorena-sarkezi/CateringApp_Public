using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class UserViewModel
    {
        public int UserId { get; set; }
        public string UserFullName { get; set; }
    }

    public static partial class ModelExtensions
    {
        public static UserViewModel GetViewModel(this User user)
        {
            UserViewModel viewModel = new UserViewModel
            {
                UserId = user.UserId,
                UserFullName = $"{user.Name} {user.Surname}"   
            };

            return viewModel;
        }
    }
}
