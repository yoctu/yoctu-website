var info = {};
var modalRefer = null;

// TODO : faire un fichier dedier


function dayMonth(d) {
    dm = d.getMonth() + 1;
    return (dm < 10 ? '0' : '') + dm;
}

function getInfo() {
    let dt = $('#datepicker').datepicker('getDate');
    info = {
        "key": "5bc661-731cf7-64B54L-T5HF2R",
        "debug": false,
        "target": "upela-widget",
        "addressValitation":true,
        "onLoad":'onRateResult',
        "order": {
            "call_back": "http://" + window.location.hostname + "/api/upela",
            "token": false,
            "bootstrap": true,
            "shipment_date": dt.getFullYear() + '-' + dayMonth(dt) + '-' + dt.getDate(),
            "context": {},
            "shipment_type": $('input[name=formType]:checked').val(),
            "parcel_unit": parcel_unit,
            "ship_from": From,
            "ship_to":To,
            "parcels": [{
                "number": 1,
                "weight": parseFloat($('#form-weight').val()),
                "x": parseFloat($('#form-length').val()),
                "y": parseFloat($('#form-width').val()),
                "z": parseFloat($('#form-height').val())
            }],
            "reason": "None",
            "content": "NA",
            "labelFormat": "PDF"
        }
    };
}

var onRateResult = function () {
    if (username != "") $('#skoreway-widget').removeClass('hide');
    $('#filters').removeClass('hide');
};

var onShipResult = function () {
    $('#skoreway-widget').addClass('hide');
    $('#filters').addClass('hide');
};

jQuery(document).ready(function () {
    // init hide unusable function
    if (username === "") {
        $('.toShow').addClass('hide');
    }
    let ldap = new LdapTool();
    $("select[name='upela-order']").change(function () {
        var result = $('#widget-bootstrap').clone();
        $('#widget-bootstrap').find('[data-price]').sort(function (a, b) {
            if ($(b).data('price')) { 
             console.log($(b).data('price'));
             result.find('[data-price="'+$(b).data('price')+'"]').remove();
             result.append($(b));
            }
        });
        $('#widget-bootstrap').replaceWith(result);
    });

    $('body').on('click', '.useme', function (e) {
        let $this = $(this);
        let selectedAddress = $this.closest('tr').find('td.address').html();
        $(modalRefer.data('input')).val(selectedAddress);
        $('.modal').modal('hide')
    });

    $('.modal').on('show.bs.modal', function (e) {
        modalRefer = $(e.relatedTarget);
        $('#mytable tbody').html('');
        ldap.getList();
    });

    $('input[type=radio][name=formType]').on('change', function (e) {
        if ($(this).val() === 1) {
            $('#form-template-type').show();
        } else {
            $('#form-template-type').hide();
        }
    });

});
