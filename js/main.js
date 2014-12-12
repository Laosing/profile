var Portfolio = function() {
  "use strict";

  var self = this,
      _checkout = $('#checkout'),
      _main = $('.main'),
      _work = $('.work'),
      _close = $('.close'),
      _loader = $('.load'),
      _helper = $('.helper');

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
  }

  this.open = function() {
    _main.velocity({
      left: '-30%'
    }, 'normal', 'ease', function() {
      _work.velocity('fadeIn', 'normal', function() {
        self.timelineArray.each(function(index) {
          $(this).velocity('fadeIn', {
            duration: 'normal',
            delay: 200 * index,
            display: 'block'
          });
        });
      });
    });
  }

  this.close = function() {
    _work.velocity('fadeOut', 'normal', function() {
      _main.velocity({
        left: ''
      }, 'normal', 'ease', function() {
        self.timelineArray.hide();
      });
    });
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

        self.timelineArray.hide();
        self.setLogic();
      });
  }

  this.setLogic = function() {
    var lastIndex = this.timelineArray.length - 1;

    this.timelineArray.each(function(index, value) {
      $(value).click(function() {
        var el = $(self.workArray[index]);

        self.logic(el, $(this));
      });
    });

    $('.next').click(function(event) {
      event.preventDefault();

      var el = $(this).parent(),
          index = el.data('work'),
          next = el.next();

      if(index === self.workArray.length - 1) 
        next = $('#work-container li[data-work="0"]');

      self.next(next);
    });

    $('.prev').click(function(event) {
      event.preventDefault();

      var el = $(this).parent(),
          index = el.data('work'),
          prev = el.prev(),
          last = self.timelineArray.length - 1;

      if(index === 0)
        prev = $('#work-container li[data-work="' + last + '"]');

      self.prev(prev);
    });
  }

  this.logic = function(el, timelineEl) {
    if(el.hasClass('active') || $('.velocity-animating').length) {
      return;
    } else if($('.active').length) {
      this.next(el, timelineEl);
    } else {
      _helper.fadeOut('fast', function() {
        self.show(el, timelineEl);
      });
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

    _loader.fadeIn('fast');

    var data = this.json.work[el.data('work')].modal;

    var img = $('<img/>')
      .attr('src', 'img/' + data.image)
      .attr('alt', data.title)
      .load(function() {
        el
          .find('.work-info')
          .prepend($(this));

        if(typeof cb === 'function')
          cb();

        _loader.fadeOut();
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

  this.prev = function(el) {
    this.loadImage(el, function() {
      self.hide('100%', function() {
        el.addClass('active');

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
  windowHeight = $(this).height();

  $('#work-container').css('height', windowHeight);
});

$(window).resize();