module Home {
    export function initialize() {
        initData();
    }

    export async function initData() {
        $.ajax({
            url: `/api/home/count/caterings/open`,
            method: "get",
            success: (res: number) => {
                document.getElementById("open-count").innerText = res.toString();
            }
        });

        $.ajax({
            url: `/api/home/count/caterings/closed`,
            method: "get",
            success: (res: number) => {
                document.getElementById("closed-count").innerText = res.toString();
            }
        });

        let canvas = <HTMLCanvasElement>document.getElementById("caterings-month-chart");
        let ctx = canvas.getContext("2d");

        const getRandomColor = () => {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }

        await $.ajax({
            url: "/api/home/count/caterings/months",
            method: "get",
            success: (res: number[]) => {

                console.log(res);

                const options: Chart.ChartConfiguration = {
                    type: "bar",
                    data: {
                        labels: ["Sij", "Velj", "Ožu", "Tra", "Svi", "Lip", "Srp", "Kol", "Ruj", "Lis", "Stu", "Pro"],
                        datasets: [{
                            label: "Br. cateringa u mjesecu",
                            data: res,
                            backgroundColor: getRandomColor
                        }]
                    },
                    options: {
                        scales: {
                            yAxes: [{
                                ticks: {
                                    stepSize: 1,
                                    beginAtZero: true
                                }
                            }]
                        }
                    }

                };

                const chart = new Chart(ctx, options);
            },
            error: Global.ajaxErrorHandler
        })       
    }
}