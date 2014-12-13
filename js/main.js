(function($) {

"use strict";

var Portfolio = function() {
  var self = this,
      _checkout = $('#checkout'),
      _main = $('.main'),
      _work = $('.work'),
      _close = $('.close'),
      _loader = $('.load'),
      _helper = $('.helper'),
      _about = $('.about'),
      _mediaMobile = '600px';

  var typedArray = [
    "Hi!^1500 Here's some fun facts about me.",
    "Starcraft 2 is my favourite game",
    "Sublime Text is the best code editor!",
    "I have a dog named Leo",
    "Chrome > Firefox :)",
    "My favourite food is pho? (rice noodle soup...)",
    "Ubuntu for development, Windows for gaming :D",
    "I prefer SASS > SCSS syntax",
    "Smile and have fun!",
    "Badminton is my favourite sport",
    "My favourite programming language is JavaScript",
    "I love solving problems",
    "I've been training in martial arts for over 5 years",
    "Dream of working with an awesome group of inspiring people who want to make awesome things!",
    "The end.",
    ""
  ];

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
      if(self.checkMobile()) {
        self.timelineAnimation();
      } else {
        _work.velocity('fadeIn', 'normal', function() {
          self.timelineAnimation();
        });
      }
    });
  }

  this.timelineAnimation = function() {
    self.timelineArray.each(function(index) {
      $(this).velocity('fadeIn', {
        duration: 'normal',
        delay: 150 * index,
        display: 'block'
      });
    });
  }

  this.close = function() {
    _work.velocity('fadeOut', 'normal', function() {
      _main.velocity({
        left: ''
      }, 'normal', 'ease', function() {
        $('.active, .helper')
          .removeClass('active')
          .removeAttr('style');

        self.timelineArray.hide();
      });
    });
  }

  this.aboutOpen = function() {
    _about.velocity({
      top: '',
      ease: 'ease'
    }, function() {
      $(this)
        .find('.about-text')
        .typed({
          strings: typedArray,
          loop: true,
          typeSpeed: 0,
          contentType: 'text',
          backDelay: 2000,
          startDelay: 1000
        });

      self.checkMobile(function() {
        $('.social').velocity('fadeIn');
      })
    });
  }

  this.checkMobile = function(cb) {
    if(Modernizr.mq('only screen and (max-width: ' + _mediaMobile + ')')) {
      if(typeof cb === 'function')
        cb();

      return true;
    }
    return false;
  }

  this.aboutClose = function() {
    _about.velocity({
      top: '100%',
      ease: 'ease'
    }, function() {
      var span = $('<span/>', {
        class: 'about-text'
      });

      $(this).find('.about-wrap').html('').append(span);
    });

    self.checkMobile(function() {
      $('.social').velocity('fadeOut');
    })
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

        self.timelineArray.hide()
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
      _helper.velocity('fadeOut', 'fast', function() {
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

    this.loadImage(el, function() {
      el.velocity({
        left: '0'
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

        _loader.velocity('fadeOut');

        if(typeof cb === 'function')
          cb();
      });
  }

  this.hide = function(value, cb) {
    $('.work-piece.active').velocity({
      left: value,
      opacity: 0
    }, 'normal', 'ease', function() {
      $('.active')
        .removeAttr('style')
        .removeClass('active');

      if(typeof cb === 'function')
        cb();
    });
  }

  this.next = function(el, timelineEl) {
    this.loadImage(el, function() {
      self.hide('-200%', function() {
        el.addClass('active');
        timelineEl.addClass('active');

        el.velocity({
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
            'left': '-200%',
          }, 0)
          .velocity({
            left: '0',
          }, 'normal', 'ease');
      });
    });
  }
};

var portfolio = new Portfolio();
portfolio.init();

$(window).resize(function() {
  var windowHeight = $(this).height();

  $('#work-container').css('height', windowHeight);
});

$(window).resize();

})(jQuery);