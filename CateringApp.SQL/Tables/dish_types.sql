CREATE TABLE [cat_app].[dish_types]
(
	[id] INT NOT NULL IDENTITY, 
    [dish_type_name] NVARCHAR(50) NOT NULL, 
    [dish_type_description] NVARCHAR(MAX) NULL,
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(),

    CONSTRAINT dish_type_pk PRIMARY KEY (id)
)
