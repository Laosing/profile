(function($) {

"use strict";

var Portfolio = function() {
  var self = this,
      _checkout = $('#checkout'),
      _main = $('.main'),
      _body = $('body'),
      _work = $('.work'),
      _close = $('.close'),
      _side = $('.side'),
      _loader = $('.load'),
      _helper = $('.helper'),
      _legend = $('.legend'),
      _about = $('.about'),
      _mediaMobile = '600px';

  this.timelineArray = null;
  this.workArray = null;
  this.json = null;

  this.init = function() {
    this.setHtml();

    _checkout.click(function(event) {
      event.preventDefault();
      self.open();
    });

    _close.click(function(event) {
      event.preventDefault();
      self.close();
    });

    $('.about-me').click(function(event) {
      event.preventDefault();
      self.aboutOpen();
    });

    $('.about-close').click(function(event) {
      event.preventDefault();
      self.aboutClose();
    });
  }

  this.open = function() {
    var x = this.checkMobile() ? '-100%' : '-30%';

    _main.velocity({
      left: x
    }, 'normal', 'ease', function() {
      _close.velocity('fadeIn', 'fast');

      if(self.checkMobile()) {
        return;
      } else {
        _work.velocity('fadeIn', 'normal', function() {
          self.timelineAnimation();
        });
      }
    });
  }

  this.timelineAnimation = function() {
    if($('#timeline').hasClass('processed'))
      return;

    self.timelineArray.velocity('transition.fadeIn', {
      stagger: 100,
      complete: function() {
        $(this).removeAttr('style');
      }
    });

    $('#timeline').addClass('processed');
  }

  this.close = function() {
    if(this.checkMobile() && _work.hasClass('open')) {
      this.hide(0);

      _work
        .velocity('fadeOut')
        .removeClass('open');

      return;
    }

    _work.velocity('fadeOut', 'normal', function() {
      _main.velocity({
        left: ''
      }, 'normal', 'ease', function() {
        $('#work-container li.active')
          .removeClass('active')
          .removeAttr('style')
          .hide();

        $('.active').removeClass('active');
        _helper.add(_legend).removeAttr('style');

        _work.removeClass('open');
      });
    });

    _close.velocity('fadeOut', 'fast');
  }

  this.aboutOpen = function() {
    setOverflow(true, [_body, _about]);
    _side.velocity({ opacity: 1 }, { display: 'none', duration: 0 });
    _body.velocity({ backgroundColor: '#FF3C1F' });

    _main.velocity({ scale: .9 }, function() {
      _about.show()
        .velocity({ scale: 1.5 }, 0, function() {
          $(this).velocity({
            scale: 1,
            opacity: 1,
          }, 'easeInOutCubic', function() {
            setOverflow(false, _about);

            self.checkMobile(function() {
              $('.social').velocity('fadeIn');
            })
          });
        });
    });
  }

  this.aboutClose = function() {
    setOverflow(true, [_body, _about]);
    _body.velocity({ backgroundColor: '#222' });

    _about.velocity({
      scale: 1.5,
      opacity: 0,
    }, {
      easing: 'easeInOutCubic',
      display: 'none',
      complete: function() {
        _main.velocity({ scale: 1 }, 'ease', function() {
          _side.velocity({ opacity: 1 }, { display: 'block' });
          _body.removeAttr('style');
        });
      }
    });

    self.checkMobile(function() {
      $('.social').velocity('fadeOut');
    })

  }

  this.checkMobile = function(cb) {
    if(Modernizr.mq('only screen and (max-width: ' + _mediaMobile + ')')) {
      if(typeof cb === 'function')
        cb();

      return true;
    }
    return false;
  }

  this.setHtml = function() {
    $.getJSON('portfolio.json')
      .done(function(data) {
        self.json = data;

        var workSource = $('#work-template').html(),
            workTemplate = Handlebars.compile(workSource);

        $('#work-container').html(workTemplate(data));

        var listSource = $('#list-template').html(),
            listTemplate = Handlebars.compile(listSource);

        $('#timeline').html(listTemplate(data));
      })
      .done(function() {
        self.timelineArray = $('#timeline li');
        self.workArray = $('#work-container li');

        self.workArray.hide();

        if(!self.checkMobile())
          self.timelineArray.hide();

        self.setLogic();
      });
  }

  this.setLogic = function() {
    var lastIndex = this.timelineArray.length - 1;

    this.timelineArray.each(function(index, value) {
      $(value).click(function() {
        var el = $(self.workArray[index]);

        self.mainLogic(el, $(this));
      });
    });

    $('.next').click(function(event) {
      event.preventDefault();
      self.nextLogic($(this));
    });

    $('.prev').click(function(event) {
      event.preventDefault();
      self.prevLogic($(this));
    });
  }

  this.prevLogic = function(el) {
    var el = el.parent(),
        index = el.data('work'),
        prev = el.prev(),
        last = self.timelineArray.length - 1,
        timelineElIndex = index !== 0 ? index - 1 : self.workArray.length - 1,
        timelineEl = $($('#timeline li')[timelineElIndex]);

    if(index === 0)
      prev = $('#work-container li[data-work="' + last + '"]');

    self.prev(prev, timelineEl);
  }

  this.nextLogic = function(el) {
    var el = el.parent(),
        index = el.data('work'),
        next = el.next(),
        timelineElIndex = index < self.workArray.length - 1 ? index + 1 : 0,
        timelineEl = $($('#timeline li')[timelineElIndex]);

    if(index === self.workArray.length - 1)
      next = $('#work-container li[data-work="0"]');

    self.next(next, timelineEl);
  }

  this.mainLogic = function(el, timelineEl) {
    if(el.hasClass('active') || $('.velocity-animating').length) {
      return;
    } else if($('.active').length) {
      this.next(el, timelineEl);
    } else {
      _helper.add(_legend).velocity('fadeOut', 'fast', function() {
        self.show(el, timelineEl);
      });
    }

   if(this.checkMobile()) {
      _work.velocity('fadeIn');
    }
  }

  this.show = function(el, timelineEl) {
    el.addClass('active');
    timelineEl.addClass('active');
    _work.addClass('open');

    this.loadImage(el, function() {
      el
        .show()
        .velocity({
          left: '0',
          display: 'block'
        }, 'normal', 'ease');
    });
  }

  this.loadImage = function(el, cb) {
    if(el.find('img').length && typeof cb === 'function') {
      cb();
      return;
    }

    _loader.velocity('fadeIn', 'fast');

    var data = this.json.work[el.data('work')].modal;

    var img = $('<img/>')
      .attr('src', 'img/' + data.image)
      .attr('alt', data.title)
      .load(function() {
        el
          .find('.work-info')
          .prepend($(this));

        _loader
          .velocity('fadeOut', function() {
            $(this).removeClass('velocity-animating');
          });

        if(typeof cb === 'function')
          cb();
      });
  }

  this.hide = function(value, cb) {
    $('#work-container .active').velocity({
      left: value,
      opacity: 0
    }, 'normal', 'ease', function() {
      $('.active')
        .removeAttr('style')
        .removeClass('active');

      $(this).hide();

      if(typeof cb === 'function')
        cb();
    });
  }

  this.next = function(el, timelineEl) {
    this.loadImage(el, function() {
      self.hide('-200%', function() {
        el.addClass('active');
        timelineEl.addClass('active');
        _work.addClass('open');

        el
          .show()
          .velocity({
            left: '0'
          }, 'normal', 'ease');
      });
    });
  }

  this.prev = function(el, timelineEl) {
    this.loadImage(el, function() {
      self.hide('100%', function() {
        el.addClass('active');
        timelineEl.addClass('active');

        el
          .velocity({
            left: '-200%',
          }, 0)
          .show()
          .velocity({
            left: '0',
          }, 'normal', 'ease');
      });
    });
  }

  function setOverflow(prop, el) {
    var prop = prop ? 'hidden' : '';

    if(el.length > 1) {
      $(el).each(function(i, val) {
        val.css({ overflow: prop });
      });
    } else {
      $(el).css({ overflow: prop });
    }
  }

};

var portfolio = new Portfolio();
portfolio.init();

$(window).resize(function() {
  var windowHeight = $(this).height() > 450 ? $(this).height() : 450;

  $('#work-container, .main, .work, .side, .about').css('height', windowHeight);
});

$(window).resize();

})(jQuery);