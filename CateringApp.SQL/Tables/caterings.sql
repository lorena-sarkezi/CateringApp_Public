﻿CREATE TABLE [cat_app].[caterings]
(
	[id] INT NOT NULL IDENTITY, 
    [catering_name] NVARCHAR(50) NOT NULL, 
    [client_name] NVARCHAR(50) NULL,
    [catering_date] DATETIME2(3) NOT NULL DEFAULT GETDATE(),
    [vehicle_id] INT NULL,
    [is_closed] BIT NOT NULL DEFAULT 0,
    [closing_comment] NVARCHAR(MAX) NULL,
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(),

    CONSTRAINT catering_pk PRIMARY KEY ([id]),
    CONSTRAINT vehicle_fk FOREIGN KEY (vehicle_id) REFERENCES cat_app.vehicles (id)
)
