var From = {
    company: '',
    name: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    address3: '',
    country_code: '',
    postcode: '',
    city: '',
    pro: 0
};


var To = {
    company: '',
    name: '',
    phone: '',
    email: '',
    address1: '',
    address2: '',
    address3: '',
    country_code: '',
    postcode: '',
    city: '',
    pro: 0
};

function initMap() {
    var fromAddr = document.getElementById('form-from');
    var toAddr = document.getElementById('form-to');
    var autocompleteFrom = new google.maps.places.Autocomplete(fromAddr);
    var autocompleteTo = new google.maps.places.Autocomplete(toAddr);

    autocompleteTo.addListener('place_changed', function () {
        var placeTo = autocompleteTo.getPlace();
        if (!placeTo.geometry) {
            return;
        }

        var addressTo = '';
        if (placeTo.address_components) {
            addressTo = [
                (placeTo.address_components[0] && placeTo.address_components[0].short_name || ''),
                (placeTo.address_components[1] && placeTo.address_components[1].short_name || ''),
                (placeTo.address_components[2] && placeTo.address_components[2].short_name || '')
            ].join(' ');

            parseGoogleAdresse(placeTo, To);
        }
    });


    autocompleteFrom.addListener('place_changed', function () {
        var placeFrom = autocompleteFrom.getPlace();
        if (!placeFrom.geometry) {
            return;
        }

        var addressFrom = '';
        if (placeFrom.address_components) {
            addressFrom = [
                (placeFrom.address_components[0] && placeFrom.address_components[0].short_name || ''),
                (placeFrom.address_components[1] && placeFrom.address_components[1].short_name || ''),
                (placeFrom.address_components[2] && placeFrom.address_components[2].short_name || '')
            ].join(' ');
            parseGoogleAdresse(placeFrom, From);
        }
    });
}

var LdapTool = function () {
};
LdapTool.prototype.getList = function () {
    if (username === "") return this;
    $.ajax({
        url: '/addresses',
        dataType: 'json'
    }).done(function (addresses) {
        addresses = addresses.response.docs;
        for (var address in addresses) {
            $('#mytable').append(
                '<tr>' +
                '<td>' +
                '<input type="button" class="btn btn-sm btn-default useme" value="select"/></td>' +
                '<td>' + addresses[address].firstname + '</td>' +
                '<td>' + addresses[address].lastname + '</td>' +
                '<td class="address">' + addresses[address].addresse + '</td>' +
                '</tr>'
            );
        }
    });
    this.name = name;
    return this;
};

var parseGoogleAdresse = function (googleAdresse, target) {
    for (var i = 0; i < googleAdresse.length; i++) {
        switch (googleAdresse.address_components[i].type[0]) {
            case 'postal_code':
                target.postcode = googleAdresse.address_components[i].short_name;
                break;
            case 'route':
                target.address1 = googleAdresse.address_components[i].short_name;
                break;
            case 'locality':
                break;
            case '"country"':
                target.country_code = googleAdresse.address_components[i].short_name;
                break;
            default:
        }
    }
};

