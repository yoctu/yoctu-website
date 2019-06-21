(function($) {
  $.fn.extend({
    qsSlider: function(options) {
      var defaults = {};
      var o = $.extend(defaults, options);
      this.each(function() {
        $(function() {
          var ISpec = new qsSlider;
          $("div.slider").each(
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
                  } else if (id == 'plants') {
                    ISpec.setPLANTS(ui.value);
                  }
                  ISpec.updatePrice();
                }
              });

            }
          );
          $("#archiveBtn").on('change', function(){    // 2nd (A)
          });
          $("#plantsBtn").on('change', function(){    // 2nd (A)
              if ($("#plantsBtn").is(":checked"))  {
                $("#plantsSlide").css('display','block');
                $("#plantsBR").css('display','none');
              } else  {
                $("#plantsSlide").css('display','none');
                $("#plantsBR").css('display','block');
              }
          });
          $("#ratingBtn").on('change', function(){    // 2nd (A)
              if ($("#ratingBtn").is(":checked")) configPricing.PriceSHAQS += configPricing.PriceRATING;
              else configPricing.PriceSHAQS -= configPricing.PriceRATING;
              ISpec.updatePrice();
          });
          $("#notifsBtn").on('change', function(){    // 2nd (A)
              if ($("#notifsBtn").is(":checked")) configPricing.PriceSHAQS += configPricing.PriceNOTIF;
              else configPricing.PriceSHAQS -= configPricing.PriceNOTIF;
              ISpec.updatePrice();
          });
          $("#brandingBtn").on('change', function(){    // 2nd (A)
              if ($("#brandingBtn").is(":checked")) configPricing.PriceUSERS += configPricing.PriceBRAND;
              else configPricing.PriceUSERS -= configPricing.PriceBRAND;
              ISpec.updatePrice();
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
          ISpec.selectPreset();
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
          var plantsslider = {
            min: 1,
            max: o.MaxPLANTS,
            step: 1
          };

          this.specification = {
            shaqs: shaqsslider,
            users: usersslider,
            plants: plantsslider
          };

          this.setSHAQS = function(sliderStep) {
            var units = 'SHAQ(s)';
            var sTotal = sliderStep + " " + units;
            $("#shaqsvalue").text(sTotal);
            $("#shaqs").slider("value", sliderStep);
          }
          this.setUSERS = function(sliderStep) {
            var units = 'USER(s)';
            var sTotal = sliderStep + " " + units;
            $("#usersvalue").text(sTotal);
            $("#users").slider("value", parseFloat(sliderStep));
          }
          this.setPLANTS = function(sliderStep) {
            var units = 'Extra Location(s)';
            var sTotal = sliderStep + " " + units;
            $("#plantsvalue").text(sTotal);
            $("#plants").slider("value", parseFloat(sliderStep));
          }
          this.selectPreset = function() {
            this.setSHAQS(presetspec.shaqs);
            this.setUSERS(presetspec.users);
            this.setPLANTS(presetspec.plants);
            this.updatePrice();
          };

          this.updatePrice = function() {
            var price = calculatePrice();
            $("div#QsPrice span#dollar").text(price.dollar);
            $("div#QsPrice span#cents").text("." + price.cents);
          };

          var calculatePrice = function() {
            var shaqs = parseFloat($("#shaqsvalue").text());
            var users = parseFloat($("#usersvalue").text());
            var period_is_year = parseInt($("#period").slider("value"));
						var price = (shaqs * configPricing.PriceSHAQS ) + (users * configPricing.PriceUSERS);
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
        };
      });
      return this;
    }
  });

  $.fn.extend({
    qsSlider: $.fn.qsSlider
  });

})(jQuery);
