CREATE TABLE [cat_app].[users]
(
	[id] INT IDENTITY NOT NULL,
    [role_id] INT NOT NULL DEFAULT cat_app.get_role_id('USER'),
    [first_name] NVARCHAR(50) NULL, 
    [last_name] NVARCHAR(50) NULL, 
    [email] NVARCHAR(50) NULL, 
    [username] NVARCHAR(50) NOT NULL,
    [password_hash] NVARCHAR(256) NOT NULL, /* SHA256 for now, PBKDF2 (or something similar) later */
    [date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(), 

    CONSTRAINT users_pk PRIMARY KEY (id),
    CONSTRAINT roles_fk FOREIGN KEY (role_id) REFERENCES [cat_app].[roles](id)
)
