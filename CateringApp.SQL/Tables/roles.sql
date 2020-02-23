CREATE TABLE [cat_app].[roles]
(
	[id] INT NOT NULL, 
    [role_title] NVARCHAR(50) NOT NULL, 
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(),

    CONSTRAINT role_pk PRIMARY KEY ([id])
)
