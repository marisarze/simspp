$( document ).ready(function() {
    
    Plotly.newPlot('simple', []);    
    var props = Object.getOwnPropertyNames($("#simple").children());
    alert(props);
    
});


