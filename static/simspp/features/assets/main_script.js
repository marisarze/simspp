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

    var csrftoken = Cookies.get('csrftoken');



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
        layer_element[0].wavelength = [null,null];
        layer_element[0].refractive = [null,null];
        layer_element[0].functions = [null,null];
        layer_element[0].scopes = [null,null];
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
        let new_layer = get_new_layer().toggle();
        $(this).closest(".layer").after(new_layer);
        new_layer.toggle(animation_duration);
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


    $(document).on('click', ".data_btn", function(event){
        let row = $(this).closest(".base_row");
        let layer = $(this).closest(".layer");
        if ($(this).html() == 'Browse&nbsp;<i class="fa fa-upload"></i>'){
            row.find(".data_upload").trigger("click");
        } else {
            let index = layer.find(".base_row").index(row);
            layer[0].wavelength[index] = [];
            layer[0].refractive[index] = [];
            $(this).html('Browse&nbsp;<i class="fa fa-upload"></i>');
            row.find(".function_input").prop("disabled", false);
            row.find(".scope_input").prop("disabled", false);
            row.find(".data_upload").val("");
        }        
    })


    $(document).on('change', ".data_upload", function(event){
        let file = event.target.files[0];
        let reader = new FileReader();
        let clicked_button = $(this).closest(".base_row").find(".data_btn");
        reader.onload = data_upload_handler(clicked_button, file);
        reader.readAsText(file);
    })


    function data_upload_handler(clicked_button, file){
        return function (event) { 
            let raw_data = event.target.result;
            let layer = clicked_button.closest(".layer");
            let regexp = /(?<wavelength>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]+(?<N>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]+(?<K>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]*\R*/gm;
            let matched_iter = raw_data.matchAll(regexp);
            let matched_array = Array.from(matched_iter);
            let name = file.name;
            if (file.name.length>20){
                name = file.name.slice(0,19)+"...";
            }
            if (matched_array.length>0){
                let wavelength = [];
                let N = [];
                let K = [];
                for (let result of matched_array){
                    wavelength.push(Number(result.groups.wavelength));
                    N.push(Number(result.groups.N))
                    K.push(Number(result.groups.K))
                    
                }
                layer[0].wavelength = [wavelength, wavelength];
                layer[0].refractive = [N, K];
                layer.find(".function_input").prop("disabled", true);
                layer.find(".scope_input").prop("disabled", true);
                layer.find(".data_btn").html('<i class="fas fa-times">'+name);
                return true;
            }
            regexp = /(?<wavelength>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]+(?<N>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]*\R*/g;
            matched_iter = raw_data.matchAll(regexp);
            matched_array = Array.from(matched_iter);
            if (matched_array.length>0){
                let row = clicked_button.closest(".base_row");
                let func_input = row.find(".function_input");
                let scope_input = row.find(".scope_input");
                let index = layer.find(".base_row").index(row);
                let wavelength = [];
                let part = [];
                for (let result of matched_array){
                    wavelength.push(Number(result.groups.wavelength));
                    part.push(Number(result.groups.N))
                }
                layer[0].wavelength[index] = wavelength;
                layer[0].refractive[index] = part;
                func_input.prop("disabled", true);
                scope_input.prop("disabled", true);
                
                clicked_button.html('<i class="fas fa-times">'+name);
                return true;
            }
            return false;              
        }
        
    }

    $(document).on('focusout', ".component_name, .fraction", function(){
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
                if (name.length>0 && !isNaN(fraction) && fraction.length>0){
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


    $(document).on('focusout', ".matter_name", function(){
        let content_name = $(this).closest(".layer").find('.content_part');
        content = $(this).val();
        if (content.length>20) content = content.slice(0,19)+"...";
        if (content.length==0) content = "Layer";
        content_name.text(content);
    })

    $(document).on('keydown', ".matter_name", function(e){
        if (e.keyCode == 32) {
            return false;
        }
    })

    $(document).on('keydown', ".component_name", function(e){
        if (e.keyCode == 32) {
            return false;
        }
    })

    $(document).on('keyup paste', ".fraction", function(e){
        this.value = this.value.replace(/[^0-9]/g, '');
    })
    

    $(document).on('focusout', ".thickness", function(event){
        let raw_val = $(this).val();
        let regexp = /^(?<thickness>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ ]*(?<magnitude>([aA]ngstrom)|(mm)|(m)|(nm)|(um)|(cm)|(A)?)/;
        let respect = {nm: 1e-9, A:1e-10, Angstrom:1e-10, mm:1e-3, um:1e-6, cm:1e-2, m:1};
        let matched_array = raw_val.match(regexp);
        //matched_array = Array.from(matched_iter);
        if (matched_array!=null){
            let thickness = matched_array[1];
            let magnitude = matched_array[3];
            if (matched_array[3]==undefined || matched_array[3]==""){
                $(this).closest(".layer").find(".thickness_part").text(thickness + " m");
                thickness = Number(thickness);
            } else {
                magnitude = magnitude=="Angstrom" ? A : magnitude; 
                $(this).closest(".layer").find(".thickness_part").text(thickness + " " + magnitude);
                thickness = Number(thickness)*respect[magnitude];
            }
            $(this).closest(".layer")[0].thickness = thickness;
        } else {
            $(this).closest(".layer").find(".thickness_part").text(" ");
            $(this).closest(".layer")[0].thickness = null;
        }
    })


    $(document).on('click', ".save_layer_btn", function(){
        let layer = $(this).closest(".layer")[0];
        let layer_data = validate_layer(layer);
        if (layer_data){
            //console.log("layer_data: ", layer_data)
            send_data(layer_data);
        }        
    })


    function send_data(target){
        console.log('stringified', JSON.stringify(target));
        target = JSON.stringify(target);
        // console.log('stringified', JSON.stringify(target));
        // target = target.replace(/\"/g, "'");
        // console.log('stringified', JSON.stringify(target));\

        // $.post(
        //     "/ajax/handle_layer",
        //     target,
        //     function(result) {
        //     $(".info_message").text(JSON.stringify(result));
        //     }
        // )
        $.ajax({
            method: "POST",
            type: "POST",
            dataType: 'json',
            contentType: 'application/x-www-form-urlencoded; charset=utf-8',
            url: "/ajax/handle_layer",
            data: target,
            headers: {'X-CSRFToken': csrftoken},
            success: function(result) {
                    $(".info_message").text(JSON.stringify(result));
                    }
        });
    };

    function validate_layer(layer){
        let data = new Object();
        layer = $(layer);
        data.type = layer[0].type;
        if (!layer[0].thickness){
            layer.find(".thickness").addClass("nonvalid");
            return false;
        }
        data.thickness = layer[0].thickness;        
        if (layer[0].type==="base"){
            let matter_name = layer.find(".matter_name").val();
            if (matter_name.length==0){
                layer.find(".matter_name").addClass("nonvalid");
                return false;
            }
            data.matter_name = matter_name;
            data.wavelength = [null,null];
            data.refractive = [null,null];
            data.functions = [null,null];
            data.scopes = [null,null];
            let rows = layer.find(".base_row");
            for (let row of rows){
                row = $(row);
                //console.log("row is: ", row);
                let index = rows.index(row);
                if (row.find(".function_input").prop("disabled")){
                    data.wavelength[index] = layer[0].wavelength[index];
                    data.refractive[index] = layer[0].refractive[index];
                } else {
                    let raw_function = row.find(".function_input").val();
                    if (raw_function.length==0){
                        row.find(".function_input").addClass("nonvalid");
                        return false;
                    }
                    let raw_scope = row.find(".scope_input").val();
                    // if (raw_scope.length==0){
                    //     row.find(".scope_input").addClass("nonvalid");
                    //     return false;
                    // }
                    let regexp = /(?<param>[a-zA-Z]+\d*) *= *(?<value>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ ,;]*/gm;
                    let matched_iter = raw_scope.matchAll(regexp);
                    let matched_array = Array.from(matched_iter);
                    let scope = new Object();
                    if (matched_array.length>0)
                        for (let result of matched_array){
                            scope[result.groups.param] = result.groups.value; 
                        }
                    
                    regexp = /[,;]+/g;
                    raw_function = raw_function.replace(regexp, "");
                    try {
                        let parsed_func = math.parse(raw_function).compile().evaluate;
                        let waves = [0.4, 0.56, 0.8, 1]
                        for (wave of waves){
                            scope.x = wave;
                            if (isNaN(parsed_func(scope))) return false;
                        } 
                    } catch {
                        row.find(".function_input").addClass("nonvalid");
                        row.find(".scope_input").addClass("nonvalid");
                        return false;

                    }
                    data.scopes[index] = scope;
                    data.functions[index] = raw_function;
                }
            }
        }
        return data;
    }

    
    
    

    // $("#layers_container").bind('DOMNodeInserted', function() {
    //     alert('node inserted');
    // });


    function initialize(){
        $("#layers_container").append(get_new_layer());
    }


    initialize();
    // console.log(math.evaluate("a=3"));
    // let scope = {
    //     a: 3,
    //     b: 4
    // }
    // console.log(scope);
    
});


// $(document).on('input propertychange paste', ".component_name, .fraction", function(){
//     let content_name = $(this).closest(".layer").find('.content_part');
//     let rows = $(this).closest(".ema_description").children();
//     //console.log(rows);
//     let dict = new Object();
//     let result = "Layer";
//     for (row of rows){
//         row = $(row);
//         if (row.children().length>1){
//             let name = row.find(".component_name").val();
//             let fraction = row.find(".fraction").val();
//             console.log(fraction, isNaN(fraction));
//             if (name.length>0 && !isNaN(fraction)){
//                 dict[name] = parseFloat(fraction);
//             }   
//         }
//     }
//     if (!($.isEmptyObject(dict))){
//         result = JSON.stringify(dict);
//         result = result.replace(/"([^"]+)":/g, '$1:');
//     }            
//     content_name.text(result);
// })