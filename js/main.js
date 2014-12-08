var Portfolio = function() {

  var self = this,
      config = {
        checkout: $('#checkout'),
        main: $('.main')
      };

  this.init = function() {
    config.checkout.click(function() {
      config.main.toggleClass('active');
    });

    this.timeline();
  }

  this.timeline = function() {
    var timeline = $('#timeline');

    $.getJSON('/portfolio.json')
      .done(function(data) {
        $.each(data.work, function(key, value) {

          $('#timeline').loadTemplate($('#timeline-template'), {
            id: 'timeline' + key,
            title: value.timeline.title,
            desc: value.timeline.description
          }, {append: true, afterInsert: function($ele) {
            $ele.click(function() {
              var el = this.id.match(/\d+/)[0];
              console.log(+el);
              $('#' + el).toggleClass('active');
            })
          }});

          $('#work-container').loadTemplate($('#work-template'), {
            id: key,
            img: 'img/' + value.modal.image,
            alt: value.modal.title,
            title: value.modal.title,
            desc: value.modal.description,
            link: value.modal.link
          }, {append: true});
        });
      });
  }

};

var portfolio = new Portfolio();
portfolio.init();
