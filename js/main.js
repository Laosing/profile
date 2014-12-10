var Portfolio = function() {

  var self = this,
      checkout = $('#checkout'),
      main = $('.main'),
      work = $('.work'),
      workContainer = $('#work-container');

  this.timelineArray = null;
  this.workArray = null;

  this.init = function() {
    checkout.click(function(event) {
      event.preventDefault();

      main.velocity({
        left: '-30%'
      }, 'fast', 'ease', function() {
        work.velocity('fadeIn', 'fast');
      });
    });

    // workContainer.click(function(event) {
    //   event.preventDefault();

    //   work.velocity('fadeOut', 'fast', function() {
    //     main.velocity({
    //       left: ''
    //     }, 'fast', 'ease');
    //   });
    // });

    this.setHtml();
  }

  this.setHtml = function() {
    var self = this;

    $.getJSON('/portfolio.json')
      .done(function(data) {
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

        self.setLogic();
      });
  }

  this.setLogic = function() {
    var self = this;

    this.timelineArray.each(function(index, value) {
      $(value).click(function() {
        var el = $(self.workArray[index]);

        self.logic(el);
      });
    });
  }

  this.logic = function(el) {
    if(el.hasClass('active')) {
      return;
    } else if($('.active').length) {
      $('.active').velocity({
        left: '-200%'
      }, 'fast', 'ease', function() {
        $('.active')
          .removeAttr('style')
          .removeClass('active');
      });

      el.velocity({
        left: '0'
      }, 'fast', 'ease', function() {
        el.addClass('active');
      });
    } else {
      this.show(el);
    }
  }

  this.show = function(el) {
    el.velocity({
      left: '0'
    }, 'fast', 'ease', function() {
      el.addClass('active');
    });
  }

  this.showNext = function(el) {

  }

  this.showPrev = function(el) {

  }
};

var portfolio = new Portfolio();
portfolio.init();

$(window).resize(function() {
  windowHeight = $(this).height();

  $('#work-container').css('height', windowHeight);
});

$(window).resize();