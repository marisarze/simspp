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
    var animation_duration = 500;
    var structure_cache = {};

    
    function get_new_layer(){
        let layer_description = $("#layer_description").html();
        let layer_element = $(layer_description);
        layer_element.find(".ema_description").hide();
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
        let some_new = get_new_layer().toggle();
        $(this).parent().parent().after(some_new);
        some_new.toggle(animation_duration);
    })

    $(document).on('click', ".minus_layer_btn", function(){
        let target = $(this).parent().parent();
        target.toggle(animation_duration, ()=>(target.remove()));
        if ($("#layers_container >.row").length<2){
            $("#layers_container").append(get_new_layer());
        }
        
    })

    $(document).on('click', ".choice_base_btn", function(){
        let base_description = $(this).closest(".layer_body").find(".base_description");
        let ema_description = $(this).closest(".layer_body").find(".ema_description");
        base_description.slideDown(animation_duration);
        ema_description.slideUp(animation_duration);
    })

    $(document).on('click', ".choice_ema_btn", function(){
        let base_description = $(this).closest(".layer_body").find(".base_description");
        let ema_description = $(this).closest(".layer_body").find(".ema_description");
        base_description.slideUp(animation_duration);
        ema_description.slideDown(animation_duration);
    })

    $(document).on('click', ".remove_component_btn", function(){
        let target = $(this).closest($(".row"));
        target.toggle(animation_duration, ()=>(target.remove));
    })

    $(document).on('click', ".add_component_btn", function(){
        let new_item = get_ema_item();
        new_item.toggle();
        let target = $(this).parent().parent();
        target.before(new_item);
        new_item.toggle(animation_duration);
    })

    $(document).on('click', ".layer_name_btn", function(){
        $(this).next().toggle(animation_duration);
    })


    function initialize(){
        $("#layers_container").append(get_new_layer());
    }

    initialize();
});