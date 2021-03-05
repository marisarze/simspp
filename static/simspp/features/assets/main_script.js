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
    
    
    function get_new_layer(){
        let layer_description = $("#layer_description").html();
        let layer_element = $(layer_description);
        layer_element.find(".description").append(get_base_content());
        return layer_element;
    }

    function get_base_content(){
        let base_description = $("#base_description").html();
        return $(base_description);
    }

    function get_ema_content(){
        let ema_description = $("#ema_description").html();
        return $(ema_description);
    }

    function get_ema_item(){
        let ema_item_html = $("#ema_item").html();
        return $(ema_item_html);
    }

    $(document).on('click', ".plus_layer_btn", function(){
        $(this).parent().parent().after(get_new_layer());
    })

    $(document).on('click', ".minus_layer_btn", function(){
        $(this).parent().parent().remove();
        if ($("#layers_container .row").length==0)
        $("#layers_container").append(get_new_layer());
    })

    $(document).on('click', ".choice_base_btn", function(){
        let description = $(this).parent().parent().find(".description");
        description.empty();
        description.append(get_base_content());
    })

    $(document).on('click', ".choice_ema_btn", function(){
        let description = $(this).parent().parent().find(".description");
        description.empty();
        description.append(get_ema_content());
    })

    $(document).on('click', ".add_component_btn", function(){
        $(this).parent().parent().before(get_ema_item());
    })


    function initialize(){
        $("#layers_container").append(get_new_layer());
    }

    initialize();
});