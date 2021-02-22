$(function() {
    console.log( "ready!" );
    alert("The URL of this page is: " + window.location.href);
    $('#replacable').load(window.location.href+'layer');
});