var Portfolio = function() {

  var self = this,
      checkout = $('#checkout'),
      main = $('.main')

  this.init = function() {
    checkout.click(function() {
      main.toggleClass('active');
    });

    this.timeline();
  }

  this.timeline = function() {
    var timeline = $('#timeline');

    $.getJSON('/portfolio.json')
      .done(function(data) {
        $.each(data.work, function(key, value) {

        });
      });
  }

};

var portfolio = new Portfolio();
portfolio.init();
