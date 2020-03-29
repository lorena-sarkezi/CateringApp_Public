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
        public bool IsClosed { get; set; }
        
    }

    public static partial class ModelExtensions
    {
        public static CateringViewModel GetViewModel(this Catering catering)
        {
            CateringViewModel viewModel = new CateringViewModel();

            viewModel.CateringId = catering.CateringId;
            viewModel.CateringName = catering.CateringName;
            viewModel.ClientName = catering.ClientName;
            viewModel.IsClosed = catering.IsClosed;

            return viewModel;
        }
    }

}
