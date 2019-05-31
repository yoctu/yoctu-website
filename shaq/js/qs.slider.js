/*! Cloud Pricing Slider*/

(function($) {

	$.fn.extend({
	qsSlider: function(options) {
		
		var defaults = {
			//Set Your own Pricing if want use in whmcs pricing should be must same as per whmcs configuration option pricing
			PriceBase	: '1.00',		// base price should be as per this calcution (1 SHAQS Core + 256MB PLANTS + 50GB USERS)
			PriceSHAQS	: '0.01',		// per month per unit
			PricePLANTS	: '1.00',		// per month per 1024 MB
			PriceUSERS 	: '1.00',		// per month per 10 GB
			
			
			//Maximum Slider values
			MaxSHAQS	: '16',		// Maximum SHAQS
			MaxPLANTS	: '14',		// Maximum PLANTS //It should be + 2 like if you want maximum PLANTS 16 GB then make it 18 etc..		
			MaxUSERS	: '50',		// Maximum USERS //Its for 500 GB USERS Storage maximum, if want to change it make 100 for 1000 GB, 150 For 1500GB and so on..
			
			//Set BuyNow Link
			BuyNowLink	: '',
			
			//IDs get from WHMCS configuration Options
			cpuID	: '',
			ramID	: '',
			hddID	: '',
			cpID	: '',
			
			//Contorl Panel value configuration options IDs
			cpYesID	: '',
			cpNoID	: '',
			
			cPanelPrice	: '10',
			
			//Disocunt on annually billing i.e. 0.10 for 10% so no..
			discount	: '0.0',
			
			//Tooltips Contents
			TipsXS	: '',
			TipsS	: '',
			TipsM	: '',
			TipsL	: '',
			TipsXL	: '',
			
			//Default Preset Configuration
			defaultPreset : 's'
		};
	  
		var o = $.extend(defaults, options);
		
		this.each(function(){
		
			$(function() {
				// Create the qsSlider controller class, so its specs can be used
				// to create the controls.
				var ISpec = new qsSlider; 

				$("div#qsSlider #QsControls div.slider").each( 
					function(i, control) {
						var id = $(control).attr('id');

						$(control).slider({
							orientation: "horizontal",
							range:       "min",
							min:         parseFloat(ISpec.specification[id].min),
							max:         parseFloat(ISpec.specification[id].max),
							step:        parseFloat(ISpec.specification[id].step),
							slide: function(event, ui) {
						
								if (id == 'cpu') {
									ISpec.setSHAQS( ui.value );
								
								} else if (id == 'ram') {
									ISpec.setPLANTS( ui.value );
								
								} else if (id == 'hdd') {
									ISpec.setUSERS( ui.value );
								}
								ISpec.updatePrice();
							}
						});

					}
				);

				// For useability add a click link for the cPanel addon.
				$("div#qsSlider #panelstext").on('click', function(e) {
					e.preventDefault();
					$("div#qsSlider #panel").slider("option", "value", "1");
				});

				// Add the yes/no selector switch.
				$("div#qsSlider #panel").slider({
					orientation: "vertical",
					min:         parseFloat(0),
					max:         parseFloat(1),
					step:        parseFloat(1),
					change: function(event, ui) {
						ISpec.updatePrice();
					}
				});

				// For useability add a click link to the offertext.
				$("div#qsSlider #offerstext").on('click', function(e) {
					e.preventDefault();
					$("div#qsSlider #period").slider("option", "value", "1");
				});

				// Add the month/year selector switch.
				$("div#qsSlider #period").slider({
					orientation: "vertical",
					min:         parseFloat(0),
					max:         parseFloat(1),
					step:        parseFloat(1),
					change: function(event, ui) {
						ISpec.updatePrice();
					}
				});

				// Add the preset buttons
				var presetNames    = new Array;
					presetNames[0] = "xs";
					presetNames[1] = "s";
					presetNames[2] = "m";
					presetNames[3] = "l";
					presetNames[4] = "xl";
	
				//Add tootip contents
				var presetTips   = new Array;
					presetTips[0] = o.TipsXS
					presetTips[1] = o.TipsS
					presetTips[2] = o.TipsM
					presetTips[3] = o.TipsL
					presetTips[4] = o.TipsXL

				for (var i = 0; i < presetNames.length; i++) {
					var id = presetNames[i]
					var presetClass = "product preset" + id.toLowerCase(); 

					$("div#presets").append(
						$('<div>').addClass(presetClass).append(
							$("<button type='button' class='btn btn-sm'>").text(id).on('click', function(e) {
									e.preventDefault();
									ISpec.selectPreset( $(this).text() );
								}
							)
							.hover(
								function(e) {
								// Find the tip for this preset 
									var toolTip;
									var presetText = $(this).text();
										for (var j = 0; j < presetNames.length; j++) { 
									if (presetNames[j] == presetText) {
										toolTip = presetTips[j];
									}	
								}

								if ( toolTip != undefined
										&& toolTip != "") {
										var offsetTop = $(this).offset().top - $("div#qsSlider").offset().top;
										$("div#tooltip div.text").text(toolTip);
										$("div#tooltip").fadeIn();
									}
								},
								function(e) {
									$("div#tooltip").hide();
								}
							)
						)
					);
				};

				// Preset the slider to default
				ISpec.selectPreset(o.defaultPreset);
			});


			var qsSlider = function() {

				// Tweak slider steps
				var cpuslider = {
					min:     1,                     // Slider min value
					max:     o.MaxSHAQS,              // Slider max value
					step:    1                      // Slider increments
				};

				var ramslider = {
					min:     1,                     // Slider min value
					max:     o.MaxPLANTS,              // Slider max value 
					step:    1                      // Slider increments
				};

				var hddslider = {
					min:     1,                     // Slider min value
					max:     o.MaxUSERS,              // Slider max value
					step:    1                      // Slider increments
				};

				// Presets buttons - numbers reference the number of slider steps.
				var presetspec = {
					xs:  { cpu: "100",  ram: "1",  hdd: "1"   },
					s:   { cpu: "200",  ram: "2",  hdd: "5"   },
					m:   { cpu: "500",  ram: "3",  hdd: "10"  }, 
					l:   { cpu: "1000",  ram: "5", hdd: "50"  },
					xl:  { cpu: "3000",  ram: "10",  hdd: "100" }
				};
   
				// Exported spec.
				this.specification = { 
					cpu: cpuslider,
					ram: ramslider,
					hdd: hddslider
				};
	
				// Getting priceing
				var pricespec = {
					baseprice:  o.PriceBase,
					cpu_ghz_mo: o.PriceSHAQS,
					ram_gb_mo:  o.PricePLANTS,
					hdd_gb_mo:  o.PriceUSERS
				};


				// Functions //

				// Sets the number of SHAQS.
				this.setSHAQS = function(sliderStep) {
	
					var units = 'SHAQ(s)';
					var sTotal = sliderStep + " " + units;
		
					// And the Text box.
					$("div.values div#cpuvalue").text(sTotal);
		
					// And update the slider (if we were called by preset, this will actually change the slider, if we're called by the slider nothing will happen.
					$("div#qsSlider div#QsControls div#cpu").slider("value", sliderStep);
				}


				// Sets the number of PLANTS.   
				this.setPLANTS = function(sliderStep) {

					// And the Text box. Now there's a little specialness here, as we want
					// bump the first 2 steps to a named value, then subtract 2 from the
					// rest. Ie. 256 / 512 / 1 / 2 ...
					var units = 'PLANT(s)';		
					var sTotal = sliderStep + " " + units;
		
					// And the indicator text.
					$("div.values div#ramvalue").text(sTotal);

					// And update the slider (if we were called by preset, this will actually change the slider, if we're called by the slider nothing will happen.
					$("div#qsSlider div#QsControls div#ram").slider("value", sliderStep);
				}

				// Sets the number of GB USERS Storage. 
				this.setUSERS = function(sliderStep) {
	
					var units ='USER(s)';
		
					// And the Text box.
					var value = sliderStep;
					var sTotal = value + " " + units;
		
					$("div.values div#hddvalue").text(sTotal);

					// And update the slider (if we were called by preset, this will actually change the slider, if we're called by the slider nothing will happen.
					$("div#qsSlider div#QsControls div#hdd").slider("value", parseFloat(sliderStep) );
				}

   
				this.selectPreset = function(presetName) {
					var presetData = $(presetspec).attr(presetName);
					this.setSHAQS(presetData.cpu);
					this.setPLANTS(presetData.ram);
					this.setUSERS(presetData.hdd);
					this.updatePrice();
				};


				// Updates the price container with the current price and updates the "buynow" button CTA URL.  Also fires the check to see if 
				// the sliders are at a preset value, and updates the preset button state if it is.
     
				this.updatePrice = function() {
					var price = calculatePrice();
					$("div#QsPrice span#doller").text(price.doller);
					$("div#QsPrice span#cents").text("." + price.cents);

					$("div#QsPrice div#btn-buynow").on('click', function (e) {
						e.preventDefault();
						window.location = buyURL();
						}
					);

					checkValueForPreset();
				};


				// Work out the price.

				var calculatePrice = function() {
					var price = parseFloat(pricespec.baseprice);
					var cpu = parseFloat( $("div.values div#cpuvalue").text() );
					var ram = parseFloat( $("div.values div#ramvalue").text() );
					var hdd = parseFloat( $("div.values div#hddvalue").text() );
					var panel_is_nocp = parseInt( $("div#panelselector div#panel").slider("value") );
					var period_is_year = parseInt( $("div#periodselector div#period").slider("value") );

					price = price + (cpu / 100) + ram + hdd;

					// Check the period, if its a year then multiply by 12
					if (period_is_year) {
						price *= 12; 
					}
		
					// Discount on annually billing?
					// do that too.
					if (period_is_year) {
						price = price - ( price * o.discount );
						price = price = ( price / 12 );
					}
		
					// now split the price and return an object.
					var priceParts = price.toFixed(2).toString().split(".");
					return {
						"doller": priceParts[0],
						"cents":  priceParts[1],
						"price":  price
					}
				};
    
				// Let's work for buy now url values
				var buyURL = function() {
		
					// Getting PLANTS value numaric only
					var ramAmount = $("div.values div#ramvalue").text().replace(/[^0-9]/gi, '');
		
					// Calculation for PLANTS to convert GB to MB for > then 512MB
					if (ramAmount < 256) {
					ramAmount *= 1024;
					} else {
						ramAmount
					}
		
					// Getting SHAQS and USERS values numaric only 
					var cpuAmount = $("div.values div#cpuvalue").text().replace(/[^0-9]/gi, '');
					var hddSize = $("div.values div#hddvalue").text().replace(/[^0-9]/gi, '');
		
					// Returns the URL that will set the cart	

					// URL can use any CURL options // example is for whmcs cart/order from	
					var bterms = ( $("#qsSlider #period").slider("value") ) ? "annually" : "monthly" // Biling Terms Annually or Monthly
					var nocp = ( $("#qsSlider #panel").slider("value") ) ? o.cpYesID : o.cpNoID  // ids are only for example, please collect them from your whmcs Configuration options
		
					// &configoption[id]  are only for example, please collect them from your whmcs admin >> Configuration options
					var url = o.BuyNowLink
						+ o.cpuID  + cpuAmount 
						+ o.ramID  + ramAmount
						+ o.hddID  + hddSize
						+ o.cpID  + nocp
						+ "&billingcycle=" + bterms;
					return url;
				};

 
				// Checks the position of the sliders to see if they are at a preset. if they are, then sets that preset button selected. 
				var checkValueForPreset = function() {
					// Remove the classes first. 
					$("div#presets div.product .btn").removeClass('btn-primary');        
					// If one is a preset... make it selected.
					for (i in presetspec) {
						var presetData = presetspec[i];
						var sliderSHAQS  = $("div#QsControls div#cpu").slider("value");
						var sliderPLANTS  = $("div#QsControls div#ram").slider("value");
						var sliderUSERS  = $("div#QsControls div#hdd").slider("value");
						if ( presetData.cpu == sliderSHAQS
							&& presetData.ram == sliderPLANTS
							&& presetData.hdd == sliderUSERS ) {
							var presetClass = "preset" + i.toLowerCase();
							$("div#presets div.product .btn").removeClass('btn-primary');           
							$("div#presets div."+presetClass+" .btn").addClass('btn-primary');
						} 
					}
				};
			};
		});
			
			// maintain chainability
			return this;
		}
	});

	$.fn.extend({
		qsSlider: $.fn.qsSlider
	});
  
})(jQuery);
