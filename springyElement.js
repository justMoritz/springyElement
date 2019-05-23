var springyElement = (function($){

  /**
   * Stores the original position of the element
   * @param  {jQUery}  the individual jQuery element
   */
  var _setInitialPosition = function($element){
    $element.attr('data-springycompoundx', 0);
    $element.attr('data-springycompoundy', 0);
  };
  
  
  /**
   * Puts the element back into the original position
   * @param  {jQUery}  the individual jQuery element
   */ 
  var _resetHamburgerPosition = function($element){
    $element.css('transform', 'translate(0,0');
    $element.attr('data-springycompoundx', 0);
    $element.attr('data-springycompoundy', 0);
  };
  
  
  /**
   * Checks and moves the element
   * @param  {event}   passed event from element
   * @param  {jQUery}  the individual jQuery element
   * @param  {int}     max amount of px element can travel
   */
  var _mouseUpdateFunct = function(e, $element, modifier){
    
    // variables to hold the input 
    var inputx, inputy;
    
    // determines whether or not input is touch event
    // (if `touches` table is present in the originalEvent)
    // or if not, use the mouse position instead
    if( e.originalEvent.touches === undefined ){
      inputx = e.pageX;
      inputy = e.pageY;
    }else{
      inputx = e.originalEvent.touches[0].pageX;
      inputy = e.originalEvent.touches[0].pageY;
    }

    // calculates the difference between the old and the new 
    // position, and then updates variable store (on the 
    // element for the next round
    var differenceX = inputx - $element.attr('data-springyx');
    var differenceY = inputy - $element.attr('data-springyy');
    $element.attr('data-springyx', inputx);
    $element.attr('data-springyy', inputy);
    
    // the transform property used below (if condition is met)
    var newXposition = Number( $element.attr('data-springycompoundx') ) + differenceX;
    var newYposition = Number( $element.attr('data-springycompoundy') ) + differenceY;
    
    // stores the new position
    $element.attr('data-springycompoundx',  newXposition);
    $element.attr('data-springycompoundy',  newYposition);
    
    // if the total amount of pixels the element will have moved
    // does not exceed the max. amount of pixels the element is allowed to move
    // will spring back if the movement has exeeded twelve times the modified amount
    if(
      newXposition > modifier  ||
      newYposition > modifier  ||
      newXposition < -modifier ||
      newYposition < -modifier
    ){
      if( newXposition > modifier*12  ||
          newYposition > modifier*12  ||
          newXposition < -modifier*12 ||
          newYposition < -modifier*12
      ){
        $element.css('transform', 'translate('+ 0 + 'px, ' + 0 + 'px');
      }
     }else{
       $element.css('transform', 'translate('+ newXposition + 'px, ' + newYposition + 'px');
     }
  
  };

  
  /**
   * The method which jQuery is being extended by
   * @param  {jQuery}  jQuery selector calling the method
   * @param  {int}     max distance the element can travel in pixels
   */
  var _springInit = function($passedElement, distance){
    
    // default setting for distance.
    distance = distance || 20;
    
    // execute for each individual element
    $passedElement.each(function(){
      
      var $element = $(this);

      // set the intial data-attributes
      _setInitialPosition($element);

      // set the inital position of where the mouse entered the element
      $element.on('mouseenter', function(e){
        $element.attr('data-springyx', e.pageX);
        $element.attr('data-springyy', e.pageY);
      }); 

      // Element being moved over listener
      $element.on('mousemove', function(e){
        _mouseUpdateFunct(e, $element, distance);
      });
      
      // Element being touched and moved listener
      $element.on('touchmove', function(e){
        _mouseUpdateFunct(e, $element, distance, true);
      });

     // resets the element when the mouse leaves
      $element.on('mouseup, mouseout', function(){
        _resetHamburgerPosition($element);
      });
      
     // resets the element when the touch is released
      $element.on('touchend', function(){
        _resetHamburgerPosition($element);
      });
      
    }); // end .each()
    
  };
  
  

  /**
   * Extends the jQuery object with the springyElement Method
   * @param  {int}  max distance the element can travel in pixels
   */
  jQuery.fn.springyElement = function(distance) {
    _springInit( $(this), distance );
    return this;
  };

})(jQuery);
