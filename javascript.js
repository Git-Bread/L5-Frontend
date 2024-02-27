import Chart from 'chart.js/auto'

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches){
    document.getElementsByTagName("html")[0].setAttribute("class", "dark");
}