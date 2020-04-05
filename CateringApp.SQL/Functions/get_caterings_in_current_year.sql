-- https://stackoverflow.com/questions/11479918/include-missing-months-in-group-by-query
-- https://stackoverflow.com/questions/13437362/how-to-get-the-first-and-last-date-of-the-current-year

CREATE FUNCTION [cat_app].[get_caterings_in_current_year]()
RETURNS TABLE
AS
RETURN 

	with dates(d) as (
			SELECT DATEADD(MONTH, n, DATEADD(MONTH, DATEDIFF(MONTH, 0, DATEADD(yy, DATEDIFF(yy, 0, GETDATE()), 0)), 0))
			FROM ( SELECT TOP (DATEDIFF(MONTH, DATEADD(yy, DATEDIFF(yy, 0, GETDATE()), 0), DATEADD(yy, DATEDIFF(yy, 0, GETDATE()) + 1, -1)) + 1) 
			n = ROW_NUMBER() OVER (ORDER BY [object_id]) - 1
			FROM sys.all_objects ORDER BY [object_id] ) AS n
		)
		SELECT 
		  [Month]    = MONTH(dates.d), 
		  CateringCount = COUNT(c.catering_date) 
		FROM dates LEFT OUTER JOIN cat_app.caterings AS c
		  ON c.catering_date >= dates.d
		  AND c.catering_date < DATEADD(MONTH, 1, dates.d)
		GROUP BY dates.d;
	