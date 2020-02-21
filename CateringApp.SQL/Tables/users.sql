CREATE TABLE [cat_app].[users]
(
	[Id] INT NOT NULL PRIMARY KEY, 
    [name] NVARCHAR(50) NOT NULL, 
    [surname] NVARCHAR(50) NOT NULL, 
    [email] NVARCHAR(50) NOT NULL, 
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(), 
    [role_id] INT NULL,

    CONSTRAINT roles_fk FOREIGN KEY (role_id) REFERENCES [cat_app].[roles](id)
)
