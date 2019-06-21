var configPricing = {
	PriceBase :	1,
	PriceSHAQS :	0.10,
	PriceUSERS :	1.10,
	PriceRATING: 0.05,
	PriceNOTIF: 0.01,
	PriceARCHIVE1W: 0,
	PriceARCHIVE1M: 0.01,
	PriceARCHIVE1Y: 0.05,
	PriceARCHIVE5Y: 0.10,
	PriceBRAND: 1.00,
	MaxSHAQS	: 5000,
	MaxUSERS	: 500,
	MaxPLANTS	: 50,
	MaxARCHIVE	: 4,
	discount	: 0.25,
}
var presetspec = {
		shaqs: 200,
		users: 5,
		plants: 1,
		archive: 0
};

$(document).ready(function () {
	$('#qsSlider').qsSlider(configPricing);
});
