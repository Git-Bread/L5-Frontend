import Chart from 'chart.js/auto'

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.getElementsByTagName("html")[0].setAttribute("class", "dark");
}

//inital call to api and conversion to a map for use in all subfunctions (same as L2 but changed what data to get)
async function getData() {  
    try {
        let rawData = await fetch("https://studenter.miun.se/~mallar/dt211g/");
        if(!rawData.ok) {
            console.log("problem with fetch content")
        }
        let data = await rawData.json();
        courseMap = data.map(function(data) {
            return [data.name, data.applicantsTotal];
        });
        start(courseMap);
    }
    catch(error) {
        console.log("it broke" + error)
    }
}

//setup for 
function start(courseMap) {
    if(document.getElementById("bar")) {
        courseMap.sort((a, b) => b[1] - a[1]);
        let smallMap = courseMap.slice(0, 6);
        let names = smallMap.map(val => val[0]);
        let values = smallMap.map(val => val[1]);
        
        new Chart(bar, {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: "Antal ansökningar till program",
                    data: values
                }]
            },
            options: {
                plugins: {
                    legend: {
                        labels: {
                            font: {
                                size: 40
                            }
                        }
                    }
                },
                onHover: {
                   
                }
            }
        });

        names.pop();
        values.pop();
        new Chart(circle, {
            type: "pie",
            data: {
                labels: names,
                datasets: [{
                    label: "Antal ansökningar till program",
                    data: values
                }]
            },
        });
        
    }
    else if(document.getElementById("map")) {

    }
}

//startup
getData()