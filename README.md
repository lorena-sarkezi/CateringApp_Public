# CateringApp

Simple web application made as part of a University class

## Technical info

Technologies:
* .NET Core MVC + WebAPI
* Entity Framework Core
* Microsoft SQL (Azure SQL)
* Bootstrap
* TypeScript

Bootstrap theme used:

* https://adminlte.io/  

**Security implemented using JWT tokens and .NET Core's auth services (Identity, Claims)**

## App Details

The idea for this app is that it's supposed to be used as an internal application in a Catering company.

![Imgur](https://i.imgur.com/fnWLv48.png)

Caterings can be created by users with ADMIN privileges. Only ADMIN users/employees can view caterings in detail, and edit them.

![Imgur](https://i.imgur.com/t05rNGb.png)

Users canbbe assigned to Caterings. Every Catering has an event date, food items to be served, a delivery vehicle to be used. Every Catering can also be printed as a PDF.

![Imgur](https://i.imgur.com/nbwEfvx.png)

Every item that can be assigned to a Catering (users, food items, vehicles) can be created, edited or deleted through the application.

![Imgur](https://i.imgur.com/RRXpPLA.png)

![Imgur](https://i.imgur.com/qcBYYrF.png)


Every Catering can be marked as closed. Before closing, an optional comment can be entered. When a Catering is marked as closed, it can never again be edited, and its information is read-only.

![Imgur](https://i.imgur.com/NCb2uWy.png =250x)


