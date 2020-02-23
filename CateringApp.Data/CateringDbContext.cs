using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data.Models;

namespace CateringApp.Data
{
    public class CateringDbContext: DbContext
    {
        public CateringDbContext(DbContextOptions<CateringDbContext> options): base(options)
        {

        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
    }
}
