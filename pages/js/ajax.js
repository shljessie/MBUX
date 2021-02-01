
function AjaxCall(url, href, changeHref = true) {
  $.ajax({
    method: "POST",
    url: "http://localhost/"+url
  }).done(function() {
    if(changeHref) window.location.href = href
  });
}


function AjaxCallWithCallback(url, cb) {
  $.ajax({
    method: "POST",
    url: "http://localhost/"+url
  }).done(cb)
}
