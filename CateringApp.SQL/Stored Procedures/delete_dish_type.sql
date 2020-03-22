CREATE PROCEDURE [cat_app].[delete_dish_type]
	@dishTypeId int
AS
BEGIN
	BEGIN TRANSACTION deleteDishType
	
	BEGIN TRY

		DECLARE @dishes TABLE
		(
			food_id INT NOT NULL
		);


		insert into @dishes
		select d.id 
		from cat_app.dishes d
		where dish_type_id = @dishTypeId;

		delete from cat_app.catering_dishes
		where dish_id in (select food_id from @dishes);

		delete from cat_app.dishes
		where id in (select food_id from @dishes);

		delete from cat_app.dish_types
		where id = @dishTypeId;

		IF @@TRANCOUNT > 0
		COMMIT TRANSACTION deleteDishType

	END TRY

	 BEGIN CATCH 
        IF @@TRANCOUNT > 0 
        ROLLBACK TRANSACTION deleteDishType; 

        THROW; 
    END CATCH 

END