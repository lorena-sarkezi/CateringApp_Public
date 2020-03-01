CREATE TABLE [cat_app].[catering_dishes]
(
	catering_id INT NOT NULL,
	dish_id INT NOT NULL,
	
	CONSTRAINT catering_dishes_pk PRIMARY KEY (catering_id, dish_id),
	CONSTRAINT catering_fk FOREIGN KEY (catering_id) REFERENCES cat_app.caterings (id),
	CONSTRAINT dishes_fk FOREIGN KEY (dish_id) REFERENCES cat_app.dishes (id)
)
