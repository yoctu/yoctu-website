var configPricing = {
	PriceSHAQS :	'0.01',
	PriceUSERS :	'1.10',
	MaxSHAQS	: '5000',
	MaxUSERS	: '500',
	discount	: '0.25',
}
var presetspec = {
	default: {
		shaqs: "200",
		users: "5"
	}
};

$(document).ready(function () {
	$('#qsSlider').qsSlider(configPricing);
});
