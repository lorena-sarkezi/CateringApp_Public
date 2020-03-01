CREATE TABLE [cat_app].[dishes]
(
	[id] INT IDENTITY NOT NULL, 
    [dish_name] NVARCHAR(128) NOT NULL, 
    [dish_type] INT NULL, 
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(),

    CONSTRAINT dishes_pk PRIMARY KEY (id),
    CONSTRAINT dish_types_fk FOREIGN KEY (dish_type) REFERENCES cat_app.dish_types (id)
)
