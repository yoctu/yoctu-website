var configPricing = {
	PriceBaseS :	'0',
	PriceBaseM :	'10',
	PriceBaseL :	'50',
	PriceBaseXL :	'100',
	PriceSHAQS :	'0.01',
	PricePLANTS :	'2.00',
	PriceUSERS :	'1.00',
	MaxSHAQS	: '5000',
	MaxPLANTS	: '50',
	MaxUSERS	: '500',
	discount	: '0.25',
}
var presetspec = {
	s: {
		shaqs: "200",
		plants: "2",
		users: "5"
	},
	m: {
		shaqs: "500",
		plants: "3",
		users: "10"
	},
	l: {
		shaqs: "1000",
		plants: "5",
		users: "50"
	},
	xl: {
		shaqs: "3000",
		plants: "10",
		users: "100"
	}
};

$(document).ready(function () {
	$('#qsSlider').qsSlider(configPricing);
});
