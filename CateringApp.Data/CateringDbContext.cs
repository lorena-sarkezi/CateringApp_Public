using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;

using CateringApp.Data.Models;

namespace CateringApp.Data
{
    public class CateringDbContext : DbContext
    {
        public CateringDbContext(DbContextOptions<CateringDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CateringEmployees>()
                .HasKey(ce => new { ce.UserId, ce.CateringId });

            modelBuilder.Entity<CateringEmployees>()
                .HasOne(ce => ce.Catering)
                .WithMany(c => c.CateringEmployees)
                .HasForeignKey(ce => ce.CateringId);

            modelBuilder.Entity<CateringEmployees>()
                .HasOne(ce => ce.User)
                .WithMany(u => u.CateringEmployees)
                .HasForeignKey(ce => ce.UserId);



            modelBuilder.Entity<CateringDishes>()
                .HasKey(cd => new { cd.CateringId, cd.DishId });

            modelBuilder.Entity<CateringDishes>()
                .HasOne(cd => cd.Catering)
                .WithMany(c => c.CateringDishes)
                .HasForeignKey(cd => cd.CateringId);

            modelBuilder.Entity<CateringDishes>()
                .HasOne(cd => cd.Dish)
                .WithMany(d => d.CateringDishes)
                .HasForeignKey(cd => cd.DishId);

            

        }

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Role> Roles { get; set; }
        public virtual DbSet<Catering> Caterings { get; set; }
        public virtual DbSet<CateringEmployees> CateringEmployees { get; set; }
        public virtual DbSet<CateringDishes> CateringDishes { get; set; }
        public virtual DbSet<Dish> Dishes { get; set; }
        public virtual DbSet<DishType> DishTypes { get; set; }

        public virtual DbSet<Vehicle> Vehicles { get; set; }
    }
}
