$(function() {
    // console.log( "ready!" );
    // alert("The URL of this page is: " + window.location.href);
    // $.get(window.location.href+'layer', (data)=>{
    //     alert(data);
    // })
    // $('#layers_container').load(window.location.href+'layer');

    // var ema_div = $("<div>", {"class": 'ema'}).load(window.location.href+'ema');
    // var base_div = $("<div>", {"class": 'base'}).load(window.location.href+'base');
    // var layer_div = $("<div>", {"class": 'layer'}).load(window.location.href+'layer');

    // var ema_div = $("<div>", {"class": 'ema'});
    // var base_div = $("<div>", {"class": 'base'});
    // var layer_div = $("<div>", {"class": 'layer'});

    // $.get(window.location.href+'ema', function(data){
    //     ema_div.html(data);
    //     alert(ema_div.html());
    // });
    // $.get(window.location.href+'base', function(data){
    //     base_div = data;
    // });
    // $.get(window.location.href+'layer', function(data){
    //     layer_div = data;
    // })

    function AddLayer(){
        // let new_base_div = jQuery.extend(true, {}, base_div);
        // let new_layer_div = jQuery.extend(true, {}, layer_div);
        // layer_div.find('.btn-group').after($("<div>", {"class": 'base'}).load(window.location.href+'base'));
        // //alert(new_layer_div.html());
        let layer_div = $("<div>", {"class": 'layer'}).load(window.location.href+'layer');
        $("#layers_container").append(layer_div);
        console.log('layer added');       

    }

    function AddDescription(){
        //let base_div = $("<div>", {"class": 'base'}).load(window.location.href+'base');
        //base_div.appendTo($('.description'))
        //$('.description').load(window.location.href+'base');
        //$('.description')
    }

    AddLayer();
    AddDescription();
    console.log($(".description").html());
});