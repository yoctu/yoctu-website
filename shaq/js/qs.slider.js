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
                  } else if (id == 'plants') {
                    ISpec.setPLANTS(ui.value);
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

					$("#sPrice").html('$'+configPricing.PriceBaseS+'<span> Monthly</span>');
					$("#mPrice").html('$'+configPricing.PriceBaseM+'<span> Monthly</span>');
					$("#lPrice").html('$'+configPricing.PriceBaseL+'<span> Monthly</span>');
					$("#xlPrice").html('$'+configPricing.PriceBaseXL+'<span> Monthly</span>');

          var presetNames = new Array;
          presetNames[0] = "s";
          presetNames[1] = "m";
          presetNames[2] = "l";
          presetNames[3] = "xl";
          $("#sPlan").on('click', function(e) {
            e.preventDefault();
						$("#planvalue").text(configPricing.PriceBaseS);
            ISpec.selectPreset("s");
						$(".plan-inner").css("border","1px solid #28a745");
						$("#plan-inner-s").css("border","5px solid #28a745");
          });
          $("#mPlan").on('click', function(e) {
            e.preventDefault();
						$("#planvalue").text(configPricing.PriceBaseM);
						ISpec.selectPreset("m");
						$(".plan-inner").css("border","1px solid #28a745");
						$("#plan-inner-m").css("border","5px solid #28a745");
          });
          $("#lPlan").on('click', function(e) {
            e.preventDefault();
						$("#planvalue").text(configPricing.PriceBaseL);
            ISpec.selectPreset("l");
						$(".plan-inner").css("border","1px solid #28a745");
						$("#plan-inner-l").css("border","5px solid #28a745");
          });
          $("#xlPlan").on('click', function(e) {
            e.preventDefault();
						$("#planvalue").text(configPricing.PriceBaseXL);
            ISpec.selectPreset("xl");
						$(".plan-inner").css("border","1px solid #28a745");
						$("#plan-inner-xl").css("border","5px solid #28a745");
          });
        });

        var qsSlider = function() {
          var shaqsslider = {
            min: 1,
            max: o.MaxSHAQS,
            step: 1
          };
          var plantsslider = {
            min: 1,
            max: o.MaxPLANTS,
            step: 1
          };
          var usersslider = {
            min: 1,
            max: o.MaxUSERS,
            step: 1
          };

          this.specification = {
            shaqs: shaqsslider,
            plants: plantsslider,
            users: usersslider
          };
          var pricespec = {
            baseprice: o.PriceBaseS,
            shaqsSpec: o.PriceSHAQS,
            plantsSpec: o.PricePLANTS,
            usersSpec: o.PriceUSERS
          };

          this.setSHAQS = function(sliderStep) {
            var units = 'SHAQ(s)';
            var sTotal = sliderStep + " " + units;
            $("div.values div#shaqsvalue").text(sTotal);
            $("div#qsSlider div#QsControls div#shaqs").slider("value", sliderStep);
          }
          this.setPLANTS = function(sliderStep) {
            var units = 'PLANT(s)';
            var sTotal = sliderStep + " " + units;
            $("div.values div#plantsvalue").text(sTotal);
            $("div#qsSlider div#QsControls div#plants").slider("value", sliderStep);
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
            this.setPLANTS(presetData.plants);
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
            var price = parseFloat($("#planvalue").text());
            var shaqs = parseFloat($("div.values div#shaqsvalue").text());
            var plants = parseFloat($("div.values div#plantsvalue").text());
            var users = parseFloat($("div.values div#usersvalue").text());
            var period_is_year = parseInt($("div#periodselector div#period").slider("value"));
						if (price > 0) {
							price = price + (shaqs / 100) + plants + users;
							$("#selectPricing").show();
						} else {
							$("#selectPricing").hide();
						}
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
              var sliderPLANTS = $("div#QsControls div#plants").slider("value");
              var sliderUSERS = $("div#QsControls div#users").slider("value");
              if (presetData.shaqs == sliderSHAQS &&
                presetData.plants == sliderPLANTS &&
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
