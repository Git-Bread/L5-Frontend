import Chart from 'chart.js/auto'
let color = true;
let map;

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.getElementsByTagName("html")[0].setAttribute("class", "dark");
    color = false;
}

//inital call to api and conversion to a map for use in all subfunctions (same as L2 but changed what data to get)
async function getData() {  
    try {
        let rawData = await fetch("https://studenter.miun.se/~mallar/dt211g/");
        if(!rawData.ok) {
            console.log("problem with fetch content")
        }
        let data = await rawData.json();
        let courseMap = data.map(function(data) {
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

    //makes it readable if you use darkmode
    if(!color) {
        Chart.defaults.color = "#ffffff";
    }

    //sets better chart fontsize
    Chart.defaults.font.size = 20
    if(window.outerWidth < 400) {
        Chart.defaults.font.size = 10
    }

    //if page diagram
    if(document.getElementById("bar")) {

        //sort and then take 6 largest by value
        courseMap.sort((a, b) => b[1] - a[1]);
        let smallMap = courseMap.slice(0, 6);
        let names = smallMap.map(val => val[0]);
        let values = smallMap.map(val => val[1]);
        
        //blockchart
        new Chart(bar, {
            type: "bar",
            data: {
                labels: names,
                datasets: [{
                    label: " Antal ansökningar till program",
                    data: values
                }]
            },
            //makes the chart more responsive
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        ticks: {
                            autoSkip: false,
                        }
                    }
                }
            }
        });

        //decrease size to 5
        names.pop();
        values.pop();

        //piechart
        new Chart(circle, {
            type: "pie",
            data: {
                labels: names,
                datasets: [{
                    label: " Antal ansökningar",
                    data: values,
                }]
            },
        });
        
    }

    //if page map
    else if(document.getElementById("map")) {
        maps();
    }
}

//using leaflet for map
function maps() {
    //inital code mostly from leaflet (https://leafletjs.com/examples/quick-start/) values customized
    map = L.map('map').setView([62.393713, 17.283529], 17);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
}

//search
window.search = function search(val) {
    fetchSearch("https://nominatim.openstreetmap.org/search?format=json&q=" + val)
}

function move(location) {
    location = location[0];
    console.log(location)
    map.flyTo([location[1], location[2]], 8);
}

//a bit messy but dident wanna restructure
async function fetchSearch(url) {  
    try {
        let rawData = await fetch(url);
        if(!rawData.ok) {
            console.log("problem with fetch content")
        }
        let data = await rawData.json();
        let map = data.map(function(data) {
            return [data.display_name, data.lat, data.lon];
        });
        move(map);
    }
    catch(error) {
        console.log("it broke" + error)
    }
}

//startup
getData()