         
function setRequestAnimFrame() {
	window.requestAnimFrame = (function(){
	  return  window.requestAnimationFrame       ||
	          window.webkitRequestAnimationFrame || 
	          window.mozRequestAnimationFrame    || 
	          window.oRequestAnimationFrame      || 
	          window.msRequestAnimationFrame     ||
	          function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	          };
	})();

}
 
function enable_slider(el, val)
{
    if (val)
        el.slider("enable");
    else
        el.slider("disable");
}
function enable(el, val)
{
    if (val == null)
         val = true;     
    el.attr("disabled", !val)
}
function ischecked(el)
{
    return el.is(":checked");    
}
function check(el, val)
{
   //debugger;
    if (val == null)
        val = true;
    return el.attr("checked", val);    
}


function requestText(url)
{
    var request = new XMLHttpRequest();
    request.open('GET', url, false); 
    request.send(null);
 
    if (request.status === 200) {
        //console.log(request.responseText);
        return  request.responseText;
    }
    else
    {
        return null;
    }
}
function showModalDialog(title, text)
{
	$("#dialog-modal").text(text);
	$("#dialog-modal").attr("title", title);

    $(function() {
        $( "#dialog-modal" ).dialog({
            height: 140,
            modal: true
        });
    });
}