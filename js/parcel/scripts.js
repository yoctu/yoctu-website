jQuery(document).ready(function() {
    $(function () {
	$("#datepicker").datepicker({ 
        	autoclose: true, 
		todayHighlight: true,
	}).datepicker('update', new Date(Date.now() + 72 * 60 * 60 * 1000));
    });

    $('.registration-form fieldset:first-child').fadeIn('slow');

    $('input, select').on('focus', function() {
	$(this).removeClass('input-error');
    });

    $('.registration-form .btn-next').on('click', function() {
	var parent_fieldset = $(this).parents('fieldset');
	var next_step = true;

        $("input").removeClass('input-error');
        $("select").removeClass('input-error');

        parent_fieldset.find('input').each(function() {
	    if( $(this).val() == "" && $(this).prop('required')) {
		$(this).addClass('input-error');
		next_step = false;
	    }
	    if( this.id === 'form-from' && From.city === ''){
                $(this).addClass('input-error');
                next_step = false;
            }
	    if( this.id === 'form-to' &&  To.city === ''){
                $(this).addClass('input-error');
                next_step = false;
            }
	});

	if( next_step ) {
	    parent_fieldset.fadeOut(400, function() {
		$(this).next().fadeIn();
	    });
	}
                
        if ($(this).attr("id") == "launchUpelaNext") {
            getInfo();
            initWidget(info,onRateResult,onShipResult);
            }
    });

    $('.registration-form .btn-previous').on('click', function() {
	$(this).parents('fieldset').fadeOut(400, function() {
            $(this).prev().fadeIn();
	});
    });

    if (username) {
     	$('.login').hide();
        $('.logout').html(username+' <i class="fa fa-sign-out ">');
     	$('.logout').show();
    } else {
        $('.login').html(' <i class="fa fa-sign-in">');
        $('.login').show();
        $('.logout').hide();
    }

});
