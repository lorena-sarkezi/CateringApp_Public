CREATE TABLE [cat_app].[roles]
(
	[id] INT IDENTITY NOT NULL, 
    [role_title] NVARCHAR(50) NOT NULL, 
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(),

    CONSTRAINT roles_pk PRIMARY KEY ([id])
)
