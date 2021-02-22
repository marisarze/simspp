$(".btn-block").click(()=>{
    let dng_button = $(".btn-danger");
    let scs_button = $(".btn-success");
    dng_button.toggleClass("btn-success btn-danger");
    scs_button.toggleClass("btn-danger btn-success");
});