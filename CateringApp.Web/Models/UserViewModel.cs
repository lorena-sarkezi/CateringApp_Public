using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class UserViewModel
    {
        public int? UserId { get; set; }
        public int RoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserFullName { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string RoleTitle { get; set; }
    }

    public static partial class ModelExtensions
    {
        public static UserViewModel GetViewModel(this User user)
        {
            UserViewModel viewModel = new UserViewModel
            {
                UserId = user.UserId,
                RoleId = user.RoleId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserFullName = $"{user.FirstName} {user.LastName}",
                Email = user.Email,
                Username = user.Username//,
                //RoleTitle = user.Role.RoleTitle
            };

            return viewModel;
        }

        public static User GetDbModel(this UserViewModel viewModel)
        {
            return new User
            {
                UserId = viewModel.UserId ?? 0,
                RoleId = viewModel.RoleId,
                FirstName = viewModel.FirstName,
                LastName = viewModel.LastName,
                Email = viewModel.Email,
                Username = viewModel.Username
            };
        }
    }
}
