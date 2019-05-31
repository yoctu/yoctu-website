$(document).ready(function () {
	$('#qsSlider').qsSlider({
		PriceBase :	'45.12',
		PriceCPU :	'15.00',
		PriceRAM :	'20.48',
		PriceHDD :	'5.00',
		MaxCPU	: '16',
		MaxRAM	: '14',
		MaxHDD	: '50',
		BuyNowLink : '#',
		cpuID : '&configoption[199]=',
		ramID : '&configoption[194]=',
		hddID : '&configoption[193]=',
		cpID : '&configoption[196]=',
		cPanelPrice : '10',
		cpYesID : '905',
		cpNoID : '904',
		discount	: '0.25',
		defaultPreset : 's',
		TipsXS	: 'XS',
		TipsS	: 'S',
		TipsM	: 'M',
		TipsL	: 'L',
		TipsXL	: 'XL'
	});

});
