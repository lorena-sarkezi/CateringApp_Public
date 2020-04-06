using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data;
using CateringApp.Data.Models;
using CateringApp.Web.Helpers;

using CateringApp.Web.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.IO;
using MigraDoc.DocumentObjectModel;
using MigraDoc.DocumentObjectModel.Shapes;
using MigraDoc.DocumentObjectModel.Tables;
using MigraDoc.Rendering;
using PdfSharp.Pdf;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Hosting;

namespace CateringApp.Web.Controllers
{
    [Route("api/catering")]
    [ApiController]
    [Authorize]
    public class CateringsAPIController : ControllerBase
    {
        private readonly CateringDbContext cateringDbContext;
        private readonly IWebHostEnvironment hostingEnvironment;

        public CateringsAPIController(CateringDbContext cateringDbContext, IWebHostEnvironment environment)
        {
            this.cateringDbContext = cateringDbContext;
            this.hostingEnvironment = environment;
        }


        [HttpGet("all_names_only")]
        [Authorize(Roles = "ADMIN")]
        public async Task<List<CateringViewModel>> GetAllCaterings()
        {
            List<Catering> allCateringsList = await cateringDbContext.Caterings
                                                                     .ToListAsync();

            List<CateringViewModel> cateringViewModels = allCateringsList.Select(x => x.GetViewModel()).ToList();
           
            return cateringViewModels;
        }

        [HttpGet("user")]
        [Authorize(Roles = "ADMIN,USER")]
        public async Task<IEnumerable<CateringViewModel>> GetAllCateringsForCurrentUser()
        {
            string userIdStr = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            int userId = int.Parse(userIdStr);

            IQueryable<int> cateringEmployeesQry = cateringDbContext.CateringEmployees
                                                                        .Where(x => x.UserId == userId)
                                                                        .Select(x => x.CateringId)
                                                                        .Distinct();

            IEnumerable<Catering> caterings = await cateringDbContext.Caterings
                                                                     .Where(x => cateringEmployeesQry.Contains(x.CateringId))
                                                                     .ToListAsync();

            return caterings.Select(x => x.GetViewModel());
        }

        //pdf export
        [HttpGet("pdf/{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> GetSingleCateringPDFFile([FromRoute] int cateringId)
        {
            int cnt = 0;

            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .ThenInclude(x => x.User)
                                                       .Include(x => x.CateringDishes)
                                                       .ThenInclude(x => x.Dish)
                                                       .ThenInclude(x => x.DishType)
                                                       .Include(x => x.Vehicle)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            Document pdfDocument = new Document();

            //-----------------------------
            Section section = pdfDocument.AddSection();

            Image image = section.AddImage(Path.Combine(this.hostingEnvironment.ContentRootPath, "Resources/logo.png"));
            image.Height = "4cm";
            image.LockAspectRatio = true;
            image.RelativeVertical = RelativeVertical.Line;
            image.RelativeHorizontal = RelativeHorizontal.Margin;
            image.Top = ShapePosition.Top;
            image.Left = ShapePosition.Center;

            var paragraph = section.AddParagraph();
            paragraph.Format.Alignment = ParagraphAlignment.Center;
            //paragraph.Format.SpaceBefore = "-4.20cm";

            paragraph.Format.Font = new Font("Arial")
            {
                Size = 14,
            };
            paragraph.AddFormattedText("Catering.inc");

            Table table = section.AddTable();
            table.Borders.Visible = false;
            table.Borders.Width = 0.15;
            var column = table.AddColumn("16cm");
            var row = table.AddRow();
            row.Borders.Bottom.Visible = true;
            row.Height = "16mm";

            Table dataTable = section.AddTable();
            dataTable.KeepTogether = false;
            dataTable.Borders.Width = 0;
            dataTable.Rows.VerticalAlignment = VerticalAlignment.Top;
            dataTable.Shading.Color = Color.Empty;

            Column dataColumn = dataTable.AddColumn("7.75cm");
            dataColumn.Format.Alignment = ParagraphAlignment.Left;

            dataColumn = dataTable.AddColumn("0.5cm");
            dataColumn.Format.Alignment = ParagraphAlignment.Center;

            dataColumn = dataTable.AddColumn("7.75cm");
            dataColumn.Format.Alignment = ParagraphAlignment.Left;

            Row spacingRow = dataTable.AddRow();
            spacingRow.TopPadding = 0.5;
            spacingRow.BottomPadding = 0.5;

            Row dtRow = dataTable.AddRow();
            dtRow.Cells[0].AddParagraph("Catering:");
            dtRow.Cells[0].Format.Font.Bold = true;
            dtRow.Cells[2].AddParagraph(catering.CateringName);

            dtRow = dataTable.AddRow();
            dtRow.Borders.Bottom.Width = 0.15;

            spacingRow = dataTable.AddRow();
            spacingRow.TopPadding = 0.5;
            spacingRow.BottomPadding = 0.5;

            dtRow = dataTable.AddRow();
            dtRow.Cells[0].AddParagraph("Ime klijenta:");
            dtRow.Cells[0].Format.Font.Bold = true;
            dtRow.Cells[2].AddParagraph(catering.ClientName);

            dtRow = dataTable.AddRow();
            dtRow.Borders.Bottom.Width = 0.15;

            spacingRow = dataTable.AddRow();
            spacingRow.TopPadding = 0.5;
            spacingRow.BottomPadding = 0.5;

            dtRow = dataTable.AddRow();
            dtRow.Cells[0].AddParagraph("Status:");
            dtRow.Cells[0].Format.Font.Bold = true;
            dtRow.Cells[2].AddParagraph(catering.IsClosed == true ? "Zatvoren" : "Aktivan");

            dtRow = dataTable.AddRow();
            dtRow.Borders.Bottom.Width = 0.15;

            spacingRow = dataTable.AddRow();
            spacingRow.TopPadding = 0.5;
            spacingRow.BottomPadding = 0.5;

            cnt = 0;
            foreach (var emp in catering.CateringEmployees)
            {
                dtRow = dataTable.AddRow();
                if(cnt == 0)
                {
                    dtRow.Cells[0].AddParagraph("Zaduženi zaposlenici:");
                }
                else
                {
                    dtRow = dataTable.AddRow();
                }
                dtRow.Cells[0].Format.Font.Bold = true;
                dtRow.Cells[2].AddParagraph(emp.User.FirstName + " " + emp.User.LastName);
                cnt++;
            }

            dtRow = dataTable.AddRow();
            dtRow.Borders.Bottom.Width = 0.15;

            spacingRow = dataTable.AddRow();
            spacingRow.TopPadding = 0.5;
            spacingRow.BottomPadding = 0.5;

            dtRow = dataTable.AddRow();
            dtRow.Cells[0].AddParagraph("Vozilo:");
            dtRow.Cells[0].Format.Font.Bold = true;
            dtRow.Cells[2].AddParagraph(catering.Vehicle.VehicleName);

            dtRow = dataTable.AddRow();
            dtRow.Borders.Bottom.Width = 0.15;

            spacingRow = dataTable.AddRow();
            spacingRow.TopPadding = 0.5;
            spacingRow.BottomPadding = 0.5;

            cnt = 0;
            foreach (var dish in catering.CateringDishes)
            {
                dtRow = dataTable.AddRow();
                if (cnt == 0)
                {
                    dtRow.Cells[0].AddParagraph("Hrana:");
                }
                else
                {
                    dtRow = dataTable.AddRow();
                }
                dtRow.Cells[0].Format.Font.Bold = true;
                dtRow.Cells[2].AddParagraph(dish.Dish.DishName + "(" + dish.Dish.DishType.DishTypeName + ")");
                cnt++;
            }

            dtRow = dataTable.AddRow();
            dtRow.Borders.Bottom.Width = 0.15;

            //if (catering.IsClosed)
            //{
            //    spacingRow = dataTable.AddRow();
            //    spacingRow.TopPadding = 0.5;
            //    spacingRow.BottomPadding = 0.5;

            //    dtRow = dataTable.AddRow();
            //    dtRow.Cells[0].AddParagraph("Komentar:");
            //    dtRow.Cells[0].Format.Font.Bold = true;
            //    dtRow.Cells[2].AddParagraph(catering.ClosingComment);

            //    dtRow = dataTable.AddRow();
            //    dtRow.Borders.Bottom.Width = 0.15;
            //}
            
            var foot = section.Footers.Primary.AddParagraph();
            foot.Format.Alignment = ParagraphAlignment.Right;;
            //paragraph.Format.SpaceBefore = "-4.20cm";

            foot.Format.Font = new Font("Arial")
            {
                Size = 8,
            };
            foot.AddFormattedText("Datum: " + DateTime.Now.ToString("dd.MM.yyyy"));
            //-----------------------------
            var pdfStream = new MemoryStream();

            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(true, PdfFontEmbedding.Always);
            pdfRenderer.Document = pdfDocument;
            pdfRenderer.RenderDocument();
            pdfRenderer.PdfDocument.Save(pdfStream, false);

            Response.Clear();
            var cd = new ContentDispositionHeaderValue("attachment");
            Response.Headers.Add(HeaderNames.ContentDisposition, cd.ToString());
            Response.Headers.Add(HeaderNames.ContentLength, pdfStream.Length.ToString());

            return File(pdfStream, "application/octet-stream", catering.CateringName + "_doc.pdf");
        }

        [HttpGet("{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<CateringDetailModel> GetSingleCateringDetails([FromRoute] int cateringId)
        {
            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .ThenInclude(x => x.User)
                                                       .Include(x => x.CateringDishes)
                                                       .ThenInclude(x => x.Dish)
                                                       .ThenInclude(x => x.DishType)
                                                       .Include(x => x.Vehicle)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            CateringDetailModel model = catering.GetCateringDetailModel();

            return model;
        }

        [HttpPost("")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> SubmitCatering([FromBody] CateringDetailModel model)
        {
            Catering catering = new Catering
            {
                CateringName = model.CateringName,
                ClientName = model.ClientName,
                VehicleId = (int)model.Vehicles[0].VehicleId
            };

            if (catering.VehicleId == 0) catering.VehicleId = null;

            cateringDbContext.Caterings.Add(catering);
            await cateringDbContext.SaveChangesAsync();

            List<CateringEmployees> cateringEmployees = new List<CateringEmployees>();
            List<CateringDishes> cateringDishes = new List<CateringDishes>();

            foreach (UserViewModel user in model.Users)
            {
                cateringEmployees.Add(new CateringEmployees
                {
                    CateringId = catering.CateringId,
                    UserId = user.UserId ?? -1
                });
            }

            foreach(FoodItemViewModel item in model.Dishes)
            {
                cateringDishes.Add(new CateringDishes
                {
                    CateringId = catering.CateringId,
                    DishId = item.Id
                });
            }

            cateringDbContext.AddRange(cateringEmployees);
            cateringDbContext.AddRange(cateringDishes);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpPut("close/{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> CloseCatering([FromRoute] int cateringId, [FromBody] CateringClosingModel model)
        {
            Catering catering = await cateringDbContext.Caterings.FirstOrDefaultAsync(x => x.CateringId == cateringId);
            catering.ClosingComment = model.ClosingComment;
            catering.IsClosed = true;

            cateringDbContext.Caterings.Update(catering);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
            
        }

        [HttpPut("{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> UpdateCatering([FromRoute] int cateringId,  [FromBody] CateringDetailModel model)
        {
            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .Include(x => x.CateringDishes)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            catering.CateringName = model.CateringName;
            catering.ClientName = model.ClientName;
            catering.VehicleId = (int)model.Vehicles[0].VehicleId;

            if (catering.VehicleId == 0) catering.VehicleId = null;

            catering.CateringEmployees = model.Users.Select(x => new CateringEmployees
            {
                CateringId = cateringId,
                UserId = (int)x.UserId
            }).ToList();

            catering.CateringDishes = model.Dishes.Select(x => new CateringDishes
            {
                CateringId = cateringId,
                DishId = x.Id
            }).ToList();

            cateringDbContext.Update<Catering>(catering);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpDelete("{cateringId}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IActionResult> DeleteCatering([FromRoute] int cateringId)
        {
            Catering catering = await cateringDbContext.Caterings
                                                       .Include(x => x.CateringEmployees)
                                                       .Include(x => x.CateringDishes)
                                                       .FirstOrDefaultAsync(x => x.CateringId == cateringId);

            cateringDbContext.Remove<Catering>(catering);
            await cateringDbContext.SaveChangesAsync();

            return Ok();
            
        }


        [HttpGet("details")]
        [Authorize(Roles = "ADMIN")]
        public async Task<CateringDetailModel> GetCateringCreationData()
        {
            CateringDetailModel retModel = new CateringDetailModel();
            
            List<User> users = await cateringDbContext.Users.ToListAsync();
            List<Vehicle> vehicles = await cateringDbContext.Vehicles.ToListAsync();


            foreach(User user in users)
            {
                retModel.Users.Add(user.GetViewModel());
            }

            foreach (Vehicle vehicle in vehicles)
            {
                retModel.Vehicles.Add(vehicle.GetViewModel());
            }


            return retModel;
        }

        


        [HttpGet("users")]
        [Authorize(Roles = "ADMIN")]
        public async Task<IEnumerable<UserViewModel>> GetUsers()
        {
            IEnumerable<User> users = await cateringDbContext.Users
                                                             .ToListAsync();

            IEnumerable<UserViewModel> userViewModels = users.Select(x => x.GetViewModel())
                                                             .ToList();

            return userViewModels;
        }

    }
}