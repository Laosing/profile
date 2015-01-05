(function($) {

  function panelTransition() {
    var self = this,
        el = $('.wrapper'),
        firstEl = el.find('article').first(),
        lastEl = el.find('article').last();

    init();

    function init() {
      var _active = el.find('.active');

      _active.next().css({ left: '105%' });
      el.find('article').last().css({ left: '-105%' });

      $('.btn-left').click(function(event) {
        event.preventDefault();
        prev();
      });

      $('.btn-right').click(function(event) {
        event.preventDefault();
        next();
      });
    }

    function next() {
      var _active = el.find('.active'),
          _prev = _active.prev().length ? _active.prev() : lastEl,
          _next = _active.next().length ? _active.next() : firstEl;

      _active.velocity({
        'left': '-105%'
      }, function() {
        $(this).removeClass();
      });

      _next.velocity({
        'left': '0'
      }, function() {
        $(this).addClass('active');
      });

      if(_next.is(firstEl))
        firstEl.next().velocity({ 'left': '105%', });

      if(_next.is(lastEl))
        firstEl.velocity({ 'left': '105%' });
      else
        _active.next().next().velocity({ 'left': '105%' });

      _prev.velocity({
        'left': '-200%',
      }, function() {
        $(this).removeAttr('style');
      });
    }

    function prev() {
      var _active = el.find('.active'),
          _prev = _active.prev().length ? _active.prev() : lastEl,
          _next = _active.next().length ? _active.next() : firstEl;

      _active.velocity({ 'left': '105%' }, function() {
        $(this).removeClass();
      });

      _prev.velocity({ 'left': '0%' }, function() {
        $(this).addClass('active');
      });

      _prev.prev().css({ 'left': '-200%' })
        .velocity({ 'left': '-105%' });

      if(!_prev.prev().length) {
        lastEl.css({ 'left': '-200%' })
          .velocity({ 'left': '-105%' });
      }

      _next.velocity({ 'left': '200%' });
    }
  }

  panelTransition();

})(jQuery);