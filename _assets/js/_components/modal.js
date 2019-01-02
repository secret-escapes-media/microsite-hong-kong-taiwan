

// =========================================
//  MODAL
// =========================================

var modal           = $('.js-modal'),
    modalWrap       = $('.js-modal,.modal__wrap,.modal__item,.modal__content'),
    modalLaunchBtn  = $('.js-open-modal'),
    modalCloseBtn   = $('.js-close-modal'),
    modalTransition = 300; // must be the same as CSS transition duration



// -----------------------------------------
// Open modal and show selected modal__item
// -----------------------------------------

function modalOpen(event, modalId){

  if (event) {
    // CLICKED : If modal was fired from a click event

    event.preventDefault();
    var modalItemID   = $(event.currentTarget).data('modal-item'),
        modalItem = '.modal__item--' + modalItemID,
        modalVideoId = $(modalItem).data('video-id');

    // if group create carousel modal
    if ( $(event.currentTarget).attr('data-modal-group') ) {
      var modalGroup = $(event.currentTarget).data('modal-group');
      modal.addClass('modal--carousel').addClass('modal--carousel-' + modalGroup);
    }

    // update video
    if( $(modalItem).attr('data-video-id') ){
      $('#modal-video__'+modalItemID).attr('src', 'https://www.youtube.com/embed/' + modalVideoId + '?enablejsapi=1&controls=1&rel=0&showinfo=0&modestbranding=1');
    }

    // update map
    if( $(event.currentTarget).attr('data-map-url') ){
      var modalMap = $(event.currentTarget).data('map-url');
      $('#modal-map__'+modalItemID).attr('src', modalMap);
    }

  } else {
    // QUERY - If modal opened from querystring
    modalItem = '.modal__item--' + modalId;
  }


  // hides all modal content
  $('.modal__item').addClass('is-closed').hide();

  // show selected modal
  $(modalItem).removeClass('is-closed').addClass('is-open').show();
  // disable scrolling on background content (doesn't work iOS)
  $('body').addClass('disable-scroll');

  // open modal
  modal.fadeIn(modalTransition, function(){
    $(this).removeClass('is-closed').addClass('is-open');
  });

  if( $('#banner-video').length ){
    document.getElementById('banner-video').pause();
    console.log('pause banner video');
  }

}



// -----------------------------------------
// Closes modal and hides all content
// -----------------------------------------

function modalClose(event){
  event.preventDefault();
  $('body').removeClass('disable-scroll');

  // Reset scroll position
  setTimeout(function() {
    $('.modal__wrap').scrollTop(0);
  }, modalTransition);

  // close modal with fade
  $('.js-modal.is-open').fadeOut(modalTransition, function(){
    $(this).removeClass('is-open').removeClass('modal--carousel').addClass('is-closed');
    $('.modal__item.is-open').removeClass('is-open').addClass('is-closed');
  });

  // disable video
  $('.modal-video__iframe').attr('src','');

  if( $('#banner-video').length ){
    document.getElementById('banner-video').play();
    console.log('play banner video');
  }

}

// open modal when .js-open-modal is clicked
modalLaunchBtn.on('click', function(event) { modalOpen(event); });

// close modal when .js-close-modal is clicked
modalCloseBtn.on('click', function(event) { modalClose(event); });

// closes modal on background click
modalWrap.on('click', function(event) {
  if (event.target !== this){
    return;
  }
  modalClose(event);
});

// closes modal on escape key press
$(document).keyup(function(event) {
  if (event.keyCode == 27) {
    modalClose(event);
  }
});

// opens modal from query string
var targetModalQuery = queryString('modal');
if (targetModalQuery) {
  modalOpen(null, targetModalQuery);

  setTimeout(function(){
    if( $('#banner-video').length ){
      document.getElementById('banner-video').pause();
      console.log('pause banner video');
    }
  },1000);
}






// =========================================
//  MODAL NAVIGATION
// =========================================

function modalNav(direction){

  var currentItem = $('.modal__item.is-open'),
      nextItem    = currentItem.next('.modal__item'),
      prevItem    = currentItem.prev('.modal__item');

  // applies to next or prev
  if( modal.hasClass('modal--carousel-page') ){
    var currentItemGroup    = currentItem.data('group-page'),
        nextItemGroup       = nextItem.data('group-page'),
        prevItemGroup       = prevItem.data('group-page'),
        firstItem           = $('.modal__item[data-group-page="'+ currentItemGroup +'"]:first'),
        lastItem            = $('.modal__item[data-group-page="'+ currentItemGroup +'"]:last');
  }else if( modal.hasClass('modal--carousel-section') ){
    var currentItemGroup    = currentItem.data('group-section'),
        nextItemGroup       = nextItem.data('group-section'),
        prevItemGroup       = prevItem.data('group-section'),
        firstItem           = $('.modal__item[data-group-section="'+ currentItemGroup +'"]:first'),
        lastItem            = $('.modal__item[data-group-section="'+ currentItemGroup +'"]:last');
  }

  if(direction == 'next'){
    //====================================
    // IF NEXT

    currentItem.addClass('is-closing-next').removeClass('is-open');
    // position next modal for animation
    if (nextItem && currentItemGroup === nextItemGroup ) {
      nextItem.addClass('is-next');
    } else {
      firstItem.addClass('is-next');
    }
    // delay to allow for CSS transition
    setTimeout(function() {
      currentItem.removeClass('is-closing-next').addClass('is-closed').hide();
    }, modalTransition);

    if ( nextItem && currentItemGroup === nextItemGroup ) {
      // shows next modal
      nextItem.show().removeClass('is-closed is-next').addClass('is-opening');
      setTimeout(function() {
        nextItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    } else {
      // isn't another modal in category so goes back to beginning
      firstItem.show().removeClass('is-closed is-next').addClass('is-opening');
      setTimeout(function() {
        firstItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    }



  }else if(direction == 'prev'){
    //====================================
    // IF PREVIOUS

    currentItem.addClass('is-closing-prev').removeClass('is-open');
    // position prev modal for animation
    if (prevItem && currentItemGroup === prevItemGroup ) {
      prevItem.addClass('is-prev');
    } else {
      lastItem.addClass('is-prev');
    }
    // delay to allow for CSS transition
    setTimeout(function() {
      currentItem.removeClass('is-closing-prev').addClass('is-closed').hide();
    }, modalTransition);

    if ( prevItem && currentItemGroup === prevItemGroup ) {
      // shows prev modal
      prevItem.show().removeClass('is-closed is-prev').addClass('is-opening');
      setTimeout(function() {
        prevItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    } else {
      // isn't another modal in category so goes back to beginning
      lastItem.show().removeClass('is-closed is-prev').addClass('is-opening');
      setTimeout(function() {
        lastItem.removeClass('is-opening').addClass('is-open');
      }, modalTransition);
    }

  }

}


// button press next/previous navigation
$('.js-modal-nav').on('click', function(event) {
  event.preventDefault();
  var navDirection = $(this).data('nav-direction');
  modalNav(navDirection);
});

// keyboard next/previous navigation
$(document).on('keyup', function(e) {
  if( $('.js-modal.is-open').hasClass('modal--carousel') ){
    if(e.which === 37){
      modalNav('prev');
    }else if(e.which === 39) {
      modalNav('next');
    }
  }
});




