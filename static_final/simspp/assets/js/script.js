$( document ).ready(function() {
    jQuery.noConflict();
    
    
    $('a[href="#simple"]').click(function (){
        TESTER = document.getElementById('simple');
        Plotly.newPlot( TESTER, [{
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 8, 16] }], {
        margin: { t: 0 } } );
        //$('#simple').append(button);
    });
    
    $('a[href="#contour"]').click(function (){
        var size = 100, x = new Array(size), y = new Array(size), z = new Array(size), i, j;

        for(var i = 0; i < size; i++) {
            x[i] = y[i] = -2 * Math.PI + 4 * Math.PI * i / size;
            z[i] = new Array(size);
        }

        for(var i = 0; i < size; i++) {
            for(j = 0; j < size; j++) {
                var r2 = x[i]*x[i] + y[j]*y[j];
                z[i][j] = Math.sin(x[i]) * Math.cos(y[j]) * Math.sin(r2) / Math.log(r2+1);
            }
        }

        var data = [ {
                z: z,
                x: x,
                y: y,
                type: 'contour'
            }
        ];

        Plotly.newPlot('contour', data);
        //$('#contour').append(button);
    });
    
    $('a[href="#contour"]').trigger('click');
    $('a[href="#simple"]').trigger('click');
    

    
    //$('a[href="#simple"]').tab('show');
    //$('.nav-tabs a:last').trigger('click');//.tab('show');
    
    console.log('aaa')
    
    
});


