var configPricing = {
	PriceBase :	1,
	PriceSHAQS :	0.10,
	PriceUSERS :	1.10,
	PriceRATING: 0.05,
	PriceNOTIF: 0.01,
	PriceBRAND: 1.00,
	MaxSHAQS	: 5000,
	MaxUSERS	: 500,
	discount	: 0.25,
}
var presetspec = {
		shaqs: "200",
		users: "5"
};

$(document).ready(function () {
	$('#qsSlider').qsSlider(configPricing);
});
