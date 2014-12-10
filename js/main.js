var Portfolio = function() {

  var self = this,
      checkout = $('#checkout'),
      main = $('.main'),
      work = $('.work'),
      workContainer = $('#work-container'),
      close = $('.close');

  this.timelineArray = null;
  this.workArray = null;

  this.init = function() {
    checkout.click(function(event) {
      event.preventDefault();

      main.velocity({
        left: '-30%'
      }, 'normal', 'ease', function() {
        work.velocity('fadeIn', 'normal');
      });
    });

    close.click(function(event) {
      event.preventDefault();

      work.velocity('fadeOut', 'normal', function() {
        main.velocity({
          left: ''
        }, 'normal', 'ease');
      });
    });

    this.setHtml();
  }

  this.setHtml = function() {
    var self = this;

    $.getJSON('/portfolio.json')
      .done(function(data) {
        var workSource = $('#work-template').html();
            workTemplate = Handlebars.compile(workSource);

        $('#work-container').html(workTemplate(data));

        var listSource = $('#list-template').html(),
            listTemplate = Handlebars.compile(listSource);

        $('#timeline').html(listTemplate(data));
      })
      .done(function() {
        self.timelineArray = $('#timeline li');
        self.workArray = $('#work-container li');

        self.setLogic();
      });
  }

  this.setLogic = function() {
    var self = this,
        lastIndex = this.timelineArray.length - 1;

    this.timelineArray.each(function(index, value) {
      $(value).click(function() {
        var el = $(self.workArray[index]);

        self.logic(el);
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

  this.logic = function(el) {
    if(el.hasClass('active')) {
      return;
    } else if($('.active').length === 1) {
      this.next(el);
    } else {
      this.show(el);
    }
  }

  this.show = function(el) {
    el.addClass('active');

    el.velocity({
      left: '0'
    }, 'normal', 'ease');
  }

  this.hide = function(value, cb) {
    $('.active').velocity({
      left: value,
      opacity: 0
    }, 'normal', 'ease', function() {
      $('.active')
        .removeAttr('style')
        .removeClass('active');

      cb();
    });
  }

  this.next = function(el) {
    this.hide('-200%', function() {
      el.addClass('active');

      el.velocity({
        left: '0'
      }, 'normal', 'ease');
    });
  }

  this.prev = function(el) {
    this.hide('100%', function() {
      el.addClass('active');

      el
        .velocity({
          'left': '-200%',
        }, 0)
        .velocity({
          left: '0',
        }, 'normal', 'ease');
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