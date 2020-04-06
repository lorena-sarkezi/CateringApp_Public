using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;

using CateringApp.Data.Models;

namespace CateringApp.Web.Models
{
    public class CateringViewModel
    {
        public int CateringId { get; set; }
        public string CateringName { get; set; }
        public string ClientName { get; set; }
        public string CateringDate { get; set; }

        public bool IsClosed { get; set; }
        
    }

    public static partial class ModelExtensions
    {
        public static CateringViewModel GetViewModel(this Catering catering)
        {
            CateringViewModel viewModel = new CateringViewModel
            {
                CateringId = catering.CateringId,
                CateringName = catering.CateringName,
                ClientName = catering.ClientName,
                CateringDate = catering.CateringDate.ToString("dd.MM.yyyy."),
                IsClosed = catering.IsClosed
            };

            return viewModel;
        }
    }

}
