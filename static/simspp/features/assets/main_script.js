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


    $(document).on('click', ".save_layer_btn", function(){
        let layer = $(this).closest(".layer")[0];
        let layer_data = validate_layer(layer);
        if (layer_data){
            console.log("layer_data: ", layer_data)
        }        
    })


    $(document).on('click', ".real_data_btn", function(event){
        if ($(this).html() == 'Browse&nbsp;<i class="fa fa-upload"></i>'){
            let target = $(this).closest(".layer").find(".real_data_upload").trigger("click");
        } else {
            let layer = $(this).closest(".layer");
            layer[0].N_wavelength = [];
            layer[0].N = [];
            $(this).html('Browse&nbsp;<i class="fa fa-upload"></i>');
            layer.find(".real_part_function").prop("disabled", false);
            layer.find(".real_part_function").prop("placeholder", "A1*x+A2 or upload data");
            layer.find(".real_part_scope").prop("disabled", false);
            $(".real_data_upload").val("");
        }        
    })


    $(document).on('click', ".imag_data_btn", function(event){
        if ($(this).html() == 'Browse&nbsp;<i class="fa fa-upload"></i>'){
            let target = $(this).closest(".layer").find(".imag_data_upload").trigger("click");
        } else {
            let layer = $(this).closest(".layer");
            layer[0].K_wavelength = [];
            layer[0].K = [];
            $(this).html('Browse&nbsp;<i class="fa fa-upload"></i>');
            layer.find(".imag_part_function").prop("disabled", false);
            layer.find(".imag_part_function").prop("placeholder", "B1*x+B2 or upload data");
            layer.find(".imag_part_scope").prop("disabled", false);
            $(".imag_data_upload").val("");
        }
    })


    $(document).on('change', ".real_data_upload", function(event){
        let file = event.target.files[0];
        let reader = new FileReader();
        let clicked_button = $(this).closest(".layer").find(".real_data_btn");
        reader.onload = data_upload_handler(clicked_button, file);
        reader.readAsText(file);
    })


    $(document).on('change', ".imag_data_upload", function(event){
        let file = event.target.files[0];
        let reader = new FileReader();
        let clicked_button = $(this).closest(".layer").find(".imag_data_btn");
        reader.onload = data_upload_handler(clicked_button, file);
        reader.readAsText(file);
    })

    function data_upload_handler(clicked_button, file){
        return function (event) { 
            let raw_data = event.target.result;
            let layer = clicked_button.closest(".layer");
            let rpf = layer.find(".real_part_function");
            let ipf = layer.find(".imag_part_function");
            let rpc = layer.find(".real_part_scope");
            let ipc = layer.find(".imag_part_scope");
            let rdb = layer.find(".real_data_btn");
            let idb = layer.find(".imag_data_btn");

            let regexp = /(?<wavelength>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]+(?<N>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]+(?<K>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]*\R*/gm;
            let matched_iter = raw_data.matchAll(regexp);
            let matched_array = Array.from(matched_iter);
            if (matched_array.length>0){
                let wavelength = [];
                let N = [];
                let K = [];
                for (let result of matched_array){
                    wavelength.push(Number(result.groups.wavelength));
                    N.push(Number(result.groups.N))
                    K.push(Number(result.groups.K))
                    
                }
                layer[0].N_wavelength = wavelength;
                layer[0].K_wavelength = wavelength;
                layer[0].N = N;
                layer[0].K = K;
                if (rpf.val()!=""){

                }
                rpf.prop("placeholder", file.name);
                ipf.prop("placeholder", file.name);
                rpf.prop("disabled", true);
                rpc.prop("disabled", true);
                ipf.prop("disabled", true);
                ipc.prop("disabled", true);
                rdb.html('<i class="fas fa-times">File');
                idb.html('<i class="fas fa-times">File');
                return true;
            }
            regexp = /(?<wavelength>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]+(?<N>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ \t]*\R*/g;
            matched_iter = raw_data.matchAll(regexp);
            matched_array = Array.from(matched_iter);
            if (matched_array.length>0){
                let wavelength = [];
                let part = [];
                for (let result of matched_array){
                    wavelength.push(Number(result.groups.wavelength));
                    part.push(Number(result.groups.N))
                }
                layer[0].wavelength = wavelength;
                if (clicked_button.hasClass("real_data_btn")){
                    layer[0].N = part;
                    layer[0].N_wavelength = wavelength;
                    rpf.prop("placeholder", file.name);
                    rpf.prop("disabled", true);
                    rpc.prop("disabled", true);
                    rdb.html('<i class="fas fa-times">File');
                } else if (clicked_button.hasClass("imag_data_btn")){
                    layer[0].K = part;
                    layer[0].K_wavelength = wavelength;
                    ipf.prop("placeholder", file.name);
                    ipf.prop("disabled", true);
                    ipc.prop("disabled", true);
                    idb.html('<i class="fas fa-times">File');
                } return true;
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



    // function validate_layer(layer){
    //     data = new Object();
    //     layer = $(layer);
    //     if (layer[0].type==="base"){
    //         if (layer.find(".real_part_function").prop("disabled")){
    //             data.N_wavelength = layer[0].N_wavelength;
    //             data.N = layer[0].N;
    //             return data;
    //         }
    //         let raw_real_func = layer.find(".real_part_function").val();
    //         let raw_imag_func = layer.find(".real_part_").val();
    //         if (raw_real_func.length==0){
    //             layer.find(".real_part_function").addClass("nonvalid");
    //             return false;
    //         }
    //         if (raw_imag_func.length==0){
    //             layer.find(".real_imag_function").addClass("nonvalid");
    //             return false;
    //         }
    //         let regexp = /(?<param>[a-zA-Z]+\d*) *= *(?<value>[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)[ ,;]*/gm;
    //         let matched_iter = raw_real_scope.matchAll(regexp);
    //         let matched_array = Array.from(matched_iter);
    //         if (matched_array.length==0)
                
    //             let wavelength = [];
    //         let part = [];
    //         for (let result of matched_array){
    //             wavelength.push(Number(result.groups.wavelength));
    //             part.push(Number(result.groups.N))
    //             }
    //         }
    //     }

    // }

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