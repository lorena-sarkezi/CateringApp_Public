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
        public string ClientName { get; set; }
        public List<UserViewModel> AssignedUsers { get; set; }
    }

    public static partial class ModelExtensions
    {
        public static CateringViewModel GetViewModel(this Catering catering)
        {
            CateringViewModel viewModel = new CateringViewModel();
            
            viewModel.CateringTitle = catering.CateringName;
            viewModel.ClientName = catering.ClientName;

            viewModel.AssignedUsers = new List<UserViewModel>();

            foreach(CateringEmployees emp in catering.CateringEmployees)
            {
                viewModel.AssignedUsers.Add(emp.User.GetViewModel());
            }

            return viewModel;

        }
    }

}
