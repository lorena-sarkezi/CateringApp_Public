CREATE FUNCTION cat_app.get_role_id(@RoleName NVARCHAR(10))
RETURNS INT
AS
BEGIN
	DECLARE @ret INT;
	SELECT @ret = r.id 
	FROM cat_app.roles r
	WHERE role_title = @RoleName;
	
	RETURN @ret;
END
