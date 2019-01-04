///////////////////////////////////////
//      smooth-scrolling - http://css-tricks.com/snippets/jquery/smooth-scrolling/
///////////////////////////////////////
$(function() {
  $('a[href*=\\#]:not([href=\\#])').click(function() {
    if (location.pathname.replace(/^\//,'') === this.pathname.replace(/^\//,'') && location.hostname === this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 500);
        return false;
      }
    }
  });
});


///////////////////////////////////////
//      inserts current year
///////////////////////////////////////
$('.js-year').html(new Date().getFullYear());


///////////////////////////////////////
//      detects touch device
///////////////////////////////////////
if ("ontouchstart" in document.documentElement){
  $('html').addClass('touch');
} else {
  $('html').addClass('no-touch');
}


///////////////////////////////////////
//        Navigation
///////////////////////////////////////

// mobile nav toggle open & close
$('.js-toggle-mobile-nav').on('click', function(e) {
  $('.mobile-nav').toggleClass('is-open').toggleClass('is-closed');
});



///////////////////////////////////////
//   Query string searcher
///////////////////////////////////////

function queryString(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split("&");
  for (var i = 0; i < sURLVariables.length; i++){
    var sParameterName = sURLVariables[i].split("=");
    if (sParameterName[0] == sParam){
      return sParameterName[1];
    }
  }
}