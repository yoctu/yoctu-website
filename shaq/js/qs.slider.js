(function($) {
  $.fn.extend({
    qsSlider: function(options) {
      var defaults = {};
      var o = $.extend(defaults, options);
      this.each(function() {
        $(function() {
          var ISpec = new qsSlider;
          $("div#qsSlider #QsControls div.slider").each(
            function(i, control) {
              var id = $(control).attr('id');
              $(control).slider({
                orientation: "horizontal",
                range: "min",
                min: parseFloat(ISpec.specification[id].min),
                max: parseFloat(ISpec.specification[id].max),
                step: parseFloat(ISpec.specification[id].step),
                slide: function(event, ui) {
                  if (id == 'shaqs') {
                    ISpec.setSHAQS(ui.value);
                  } else if (id == 'users') {
                    ISpec.setUSERS(ui.value);
                  }
                  ISpec.updatePrice();
                }
              });

            }
          );
          $("div#qsSlider #panelstext").on('click', function(e) {
            e.preventDefault();
            $("div#qsSlider #panel").slider("option", "value", "1");
          });
          $("div#qsSlider #panel").slider({
            orientation: "vertical",
            min: parseFloat(0),
            max: parseFloat(1),
            step: parseFloat(1),
            change: function(event, ui) {
              ISpec.updatePrice();
            }
          });

          $("div#qsSlider #offerstext").on('click', function(e) {
            e.preventDefault();
            $("div#qsSlider #period").slider("option", "value", "1");
          });

          $("div#qsSlider #period").slider({
            orientation: "vertical",
            min: parseFloat(0),
            max: parseFloat(1),
            step: parseFloat(1),
            change: function(event, ui) {
              ISpec.updatePrice();
            }
          });
        });

        var qsSlider = function() {
          var shaqsslider = {
            min: 1,
            max: o.MaxSHAQS,
            step: 1
          };
          var usersslider = {
            min: 1,
            max: o.MaxUSERS,
            step: 1
          };

          this.specification = {
            shaqs: shaqsslider,
            users: usersslider
          };
          var pricespec = {
            baseprice: o.PriceBase,
            shaqsSpec: o.PriceSHAQS,
            usersSpec: o.PriceUSERS
          };

          this.setSHAQS = function(sliderStep) {
            var units = 'SHAQ(s)';
            var sTotal = sliderStep + " " + units;
            $("div.values div#shaqsvalue").text(sTotal);
            $("div#qsSlider div#QsControls div#shaqs").slider("value", sliderStep);
          }
          this.setUSERS = function(sliderStep) {
            var units = 'USER(s)';
            var value = sliderStep;
            var sTotal = value + " " + units;
            $("div.values div#usersvalue").text(sTotal);
            $("div#qsSlider div#QsControls div#users").slider("value", parseFloat(sliderStep));
          }
          this.selectPreset = function(presetName) {
            var presetData = $(presetspec).attr(presetName);
            this.setSHAQS(presetData.shaqs);
            this.setUSERS(presetData.users);
            this.updatePrice();
          };

          this.updatePrice = function() {
            var price = calculatePrice();
            $("div#QsPrice span#dollar").text(price.dollar);
            $("div#QsPrice span#cents").text("." + price.cents);
            checkValueForPreset();
          };

          var calculatePrice = function() {
            var shaqs = parseFloat($("div.values div#shaqsvalue").text());
            var users = parseFloat($("div.values div#usersvalue").text());
            var period_is_year = parseInt($("div#periodselector div#period").slider("value"));
						var price = (shaqs / 100) users;
            if (period_is_year) {
              price *= 12;
              price = price - (price * o.discount);
              price = price = (price / 12);
            }

            var priceParts = price.toFixed(2).toString().split(".");
            return {
              "dollar": priceParts[0],
              "cents": priceParts[1],
              "price": price
            }
          };

          var checkValueForPreset = function() {
            $("div#presets div.product .btn").removeClass('btn-primary');
            for (i in presetspec) {
              var presetData = presetspec[i];
              var sliderSHAQS = $("div#QsControls div#shaqs").slider("value");
              var sliderUSERS = $("div#QsControls div#users").slider("value");
              if (presetData.shaqs == sliderSHAQS &&
                presetData.users == sliderUSERS) {
                var presetClass = "preset" + i.toLowerCase();
                $("div#presets div.product .btn").removeClass('btn-primary');
                $("div#presets div." + presetClass + " .btn").addClass('btn-primary');
              }
            }
          };
        };
      });
      return this;
    }
  });

  $.fn.extend({
    qsSlider: $.fn.qsSlider
  });

})(jQuery);
