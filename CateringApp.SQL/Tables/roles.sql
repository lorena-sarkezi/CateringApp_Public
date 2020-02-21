CREATE TABLE [cat_app].[roles]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [role_title] NVARCHAR(50) NOT NULL, 
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE()
)
