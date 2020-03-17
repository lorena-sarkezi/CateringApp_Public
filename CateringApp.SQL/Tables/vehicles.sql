CREATE TABLE [cat_app].[vehicles]
(
	[id] INT IDENTITY NOT NULL, 
    [vehicle_name] NVARCHAR(50) NOT NULL, 
    [registration] NVARCHAR(16) NOT NULL,
    [kilometers] DECIMAL(2) NOT NULL,
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(),

    CONSTRAINT vehicle_pk PRIMARY KEY (id)
)
