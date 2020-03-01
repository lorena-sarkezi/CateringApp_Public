CREATE TABLE [cat_app].[dish_types]
(
	[id] INT NOT NULL PRIMARY KEY, 
    [dish_type_name] NVARCHAR(50) NOT NULL, 
    [date_creared] DATETIME2(3) NOT NULL DEFAULT GETDATE()
)
