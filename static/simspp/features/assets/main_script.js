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

    // const json = JSON.stringify(object);  // {"name":"John Smith"}
    // console.log(json);
    // const unquoted = json.replace(/"([^"]+)":/g, '$1:');

    $(window).keydown(function(event){
        if(event.keyCode == 13) {
          event.preventDefault();
          event.keyCode = 9;
          event.which = 9;
          $(window).trigger("keydown", [9]);
          //return false;
        }
        //console.log(event.keyCode);
    });

    var animation_duration = 500;
    var structure_cache = {};
    var layers_cache = {};


    const mutation_handler = function(mutations){
        for (const mutation of mutations){
            if (mutation.type === "childList"){
                update_names();
            }
        };
    };
    
    const observer = new MutationObserver(mutation_handler);
    const obs_config = {childList:true, subtree:false};
    const obs_target = document.getElementById('layers_container');

    observer.observe(obs_target, obs_config);

    
    function update_names(){
        if ($("#layers_container >.row").length<1){
            $("#layers_container").append(get_new_layer());
            
        }
        let names = $("#layers_container").find(".layer_name_btn");
        
        $.each(names, function (ind, elem) {
            $(this).find(".number_part").html(ind); 
        });
    }
    

    function get_new_layer(){
        let layer_description = $("#layer_description").html();
        let layer_element = $(layer_description);
        layer_element[0].type = "base";
        layer_element.find(".ema_description").hide();
        return layer_element;
    }

    function get_ema_item(){
        let ema_item_html = $("#ema_item").html();
        return $(ema_item_html);
    }

    function deleteTarget(target){
        target.toggle(animation_duration, target[0].remove);
    }

    $(document).on('click', ".plus_layer_btn", function(){
        let some_new = get_new_layer().toggle();
        $(this).closest(".layer").after(some_new);
        some_new.toggle(animation_duration);
    })

    $(document).on('click', ".minus_layer_btn", function(){
        let target = $(this).closest(".layer");
        deleteTarget(target);
        //target.toggle(animation_duration, target.remove);
        
    })


    $(document).on('click', ".choice_base_btn", function(){
        let base_description = $(this).closest(".layer_body").find(".base_description");
        let ema_description = $(this).closest(".layer_body").find(".ema_description");
        let name_button = $(this).closest(".layer").find(".layer_name_btn");
        $(this).closest(".layer")[0].type = 'base';
        name_button.removeClass("btn-secondary").addClass("btn-warning");
        base_description.slideDown(animation_duration);
        ema_description.slideUp(animation_duration);
    })

    $(document).on('click', ".choice_ema_btn", function(){
        let base_description = $(this).closest(".layer_body").find(".base_description");
        let ema_description = $(this).closest(".layer_body").find(".ema_description");
        let name_button = $(this).closest(".layer").find(".layer_name_btn");
        $(this).closest(".layer")[0].type = 'ema';
        name_button.removeClass("btn-warning").addClass("btn-secondary");
        base_description.slideUp(animation_duration);
        ema_description.slideDown(animation_duration);
    })

    $(document).on('click', ".remove_component_btn", function(){
        let target = $(this).closest($(".row"));
        deleteTarget(target);
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

    $(document).on('click', "#clear_all_btn", function(event){
        $(".popup_container").fadeIn(animation_duration);
    })

    $(document).on('click', "#no_btn", function(event){
        $(".popup_container").fadeOut(animation_duration);
    })

    $(document).on('click', "#yes_btn", function(event){
        $(".popup_container").fadeOut(animation_duration);
        let layers = $("#layers_container").children();
        for (let i=0;i<layers.length;i++){
            setTimeout(()=>{deleteTarget($(layers[i]))}, 200*i);
        }
    })

    $(document).mouseup(function(e){
        let container = $(".popup_container");
        if (!(e.target==container) && container.has(e.target).length===0){
            // container.fadeOut(animation_duration, ()=>{
            //     container.removeClass("is_visible");
            //     container.addClass("not_visible");
            // });
            $(".popup_container").fadeOut(animation_duration);
        }
    })

    $(".matter_name").keyup(function (){
        alert('allo');
    })

    $(document).on('input propertychange paste', ".matter_name", function(){
        let content_name = $(this).closest(".layer").find('.content_part');
        content = $(this).val();
        if (content.length>20) content = content.slice(0,19)+"...";
        if (content.length==0) content = "Layer";
        content_name.text(content);
    })

    $(document).on('input propertychange paste', ".component_name, .fraction", function(){
        let content_name = $(this).closest(".layer").find('.content_part');
        let rows = $(this).closest(".ema_description").children();
        //console.log(rows);
        let dict = new Object();
        let result = "Layer";
        for (row of rows){
            row = $(row);
            if (row.children().length>1){
                let name = row.find(".component_name").val();
                let fraction = row.find(".fraction").val();
                console.log(fraction, isNaN(fraction));
                if (name.length>0 && !isNaN(fraction)){
                    dict[name] = parseFloat(fraction);
                }   
            }
        }
        if (!($.isEmptyObject(dict))){
            result = JSON.stringify(dict);
            result = result.replace(/"([^"]+)":/g, '$1:');
        }            
        content_name.text(result);
    })

    function get_base_data(layer){
        console.log('called base get data : ', layer);

        let data = {};
        data.rfunc = $(layer).find(".real_part_function").val();
        data.ifunc = $(layer).find(".imag_part_function").val();
        data.rconst = $(layer).find(".real_part_constants").val();
        data.iconst = $(layer).find(".imag_part_constants").val();
        return data;
    }

    function get_ema_data(layer){
        console.log('called ema get data: ', layer);

        let data = {};
        // data.rfunc = $(layer).find(".real_part_function").val();
        // data.ifunc = $(layer).find(".imag_part_function").val();
        // data.rconst = $(layer).find(".real_part_constants").val();
        // data.iconst = $(layer).find(".imag_part_constants").val();
        return data;
    }

    $(document).on('click', ".save_layer_btn", function(){
        let layer = $(this).closest(".layer")[0];
        let data;
        if (layer.type === "base"){
            data = get_base_data(layer);
            // if (is_base_valid()){
            //     data = get_base_data();
            //     console.log(data);
            // }
        } else {
            data = get_ema_data(layer);
        }
        console.log(data);        
    })


    // $("#layers_container").bind('DOMNodeInserted', function() {
    //     alert('node inserted');
    // });


    function initialize(){
        $("#layers_container").append(get_new_layer());
    }

    initialize();
    console.log(math.evaluate("a=3"));
    let scope = {
        a: 3,
        b: 4
    }
    console.log(scope);
    
});