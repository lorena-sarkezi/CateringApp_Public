CREATE TABLE [cat_app].[catering_employees]
(
	user_id INT NOT NULL,
	catering_id INT NOT NULL,

	[date_created] DATETIME2(3) NOT NULL DEFAULT GETDATE(), 
    CONSTRAINT catering_emps_pk PRIMARY KEY (user_id, catering_id),
	CONSTRAINT users_fk FOREIGN KEY (user_id) REFERENCES [cat_app].[users](id),
	CONSTRAINT caterings_fk FOREIGN KEY (catering_id) REFERENCES [cat_app].[caterings](id)
)
