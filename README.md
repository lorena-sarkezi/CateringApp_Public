# CateringApp

Kloniraj repo u direktorij (možeš i kroz Visual Studio kroz GUI).

Nakon kloniranja desni klik na **Solution**, odaberi **Restore Nuget Packages**

Pokreni (Ctrl+F5)

Prvo pokretanje traje oko 2 minute, dok ne povuče sve s NPM-a.

## Podjela na projekte/module (buduće)

* **CateringApp.Web** -> view-ovi, controlleri, jezgra aplikacije
* **CateringApp.Data** -> DbContext definicija, bazni modeli, model extenzije/dodatne definicije pravila
* **CateringApp.SQL** -> SQL datoteke s DDL-ovima (tablice, procedure, whatever)
 
Koji god DDL se piše, obavezno staviti u file u **CateringApp.SQL** i napraviti schema compare, bolje ne okidati DDL direktno da se ne desi razlika u između baze i projekta. Ako ima vise schema na bazi, tako organizirajte i foldere.

I pogotovo ne okidati merge/join u prazno.


## Stuff

~~Fronta je pisana u Reactu, framework je React-Bootstrap https://react-bootstrap.github.io/

~~Bilo bi dobro prebaciti na Material-UI, https://themes.material-ui.com/

Baza je gotova, napisabi svi eniteti/modeli, postavljene relacije

## Prebacit ćemo se na Bootstrap i goli HTML/Razor + TypeScript

Iako je React kod puno stvari fleksibilniji i snažniji, predugo traje razvj (nedostatak iskustva)

https://dashboardpack.com/theme-details/architectui-html-dashboard-free/  
https://adminlte.io/  
https://startbootstrap.com/themes/sb-admin-2/

