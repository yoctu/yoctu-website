$(document).ready(function () {
	$('#qsSlider').qsSlider({
		PriceBase :	'1',
		PriceSHAQS :	'0.01',
		PricePLANTS :	'1.00',
		PriceUSERS :	'1.00',
		MaxSHAQS	: '5000',
		MaxPLANTS	: '50',
		MaxUSERS	: '500',
		BuyNowLink : '#',
		cpuID : '&configoption[199]=',
		ramID : '&configoption[194]=',
		hddID : '&configoption[193]=',
		cpID : '&configoption[196]=',
		cPanelPrice : '10',
		cpYesID : '905',
		cpNoID : '904',
		discount	: '0.25',
		defaultPreset : 'XS',
		TipsXS	: 'XS',
		TipsS	: 'S',
		TipsM	: 'M',
		TipsL	: 'L',
		TipsXL	: 'XL'
	});

});
