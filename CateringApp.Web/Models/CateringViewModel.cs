using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class CateringViewModel
    {
        public int CateringId { get; set; }
        public string CateringName { get; set; }
        public string ClientName { get; set; }
        
    }

    public static partial class ModelExtensions
    {
        public static CateringViewModel GetViewModel(this Catering catering)
        {
            CateringViewModel viewModel = new CateringViewModel();

            viewModel.CateringId = catering.CateringId;
            viewModel.CateringName = catering.CateringName;
            viewModel.ClientName = catering.ClientName;

            //if(catering.CateringEmployees != null)
            //{
            //    viewModel.Users = new List<UserViewModel>();

            //    foreach (CateringEmployees emp in catering.CateringEmployees)
            //    {
            //        viewModel.Users.Add(emp.User.GetViewModel());
            //    }
            //}

            return viewModel;
        }
    }

}
