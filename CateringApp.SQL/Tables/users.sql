﻿CREATE TABLE [cat_app].[users]
(
	[id] INT NOT NULL, 
    [name] NVARCHAR(50) NOT NULL, 
    [surname] NVARCHAR(50) NOT NULL, 
    [email] NVARCHAR(50) NOT NULL, 
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(), 
    [role_id] INT NOT NULL,

    CONSTRAINT roles_pk PRIMARY KEY (id),
    CONSTRAINT roles_fk FOREIGN KEY (role_id) REFERENCES [cat_app].[roles](id)
)
