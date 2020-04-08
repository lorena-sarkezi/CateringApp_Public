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
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                        datasets: [{
                            label: "No. of caterings in month",
                            data: res,
                            backgroundColor: 'rgba(115, 206, 255,1)',
                            borderColor: 'rgba(255,255,255,1)'
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
                        },
                        legend: {
                            display: false
                        }
                    }

                };

                const chart = new Chart(ctx, options);
            },
            error: Global.ajaxErrorHandler
        })       
    }
}