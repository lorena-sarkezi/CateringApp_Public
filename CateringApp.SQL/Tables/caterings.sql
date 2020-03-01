CREATE TABLE [cat_app].[caterings]
(
	[id] INT NOT NULL IDENTITY, 
    [catering_name] NVARCHAR(50) NOT NULL, 
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(),

    CONSTRAINT catering_pk PRIMARY KEY ([id])
)
