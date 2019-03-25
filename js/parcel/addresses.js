var From = {
    company:'' ,
    name:'',
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
    company:'' ,
    name:'',
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

        autocompleteTo.addListener('place_changed', function() {
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

            To.city = placeTo.address_components[2].short_name;
            filtered_array = placeTo.address_components.filter(function(address_component){
                return address_component.types.includes("postal_code");
            });
            To.postcode = filtered_array[0].short_name;
            filtered_array = placeTo.address_components.filter(function(address_component){
                return address_component.types.includes("country");
            });
            To.country_code = filtered_array[0].short_name;
            To.address1 = placeTo.address_components[0].short_name + ' ' + placeTo.address_components[1].short_name;
            fillForm(To,'to');
          }
        });


        autocompleteFrom.addListener('place_changed', function() {
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

            From.city = placeFrom.address_components[2].short_name;
            filtered_array = placeFrom.address_components.filter(function(address_component){
                return address_component.types.includes("postal_code");
            });
            From.postcode = filtered_array[0].short_name;
            filtered_array = placeFrom.address_components.filter(function(address_component){
                return address_component.types.includes("country");
            });
            From.country_code = filtered_array[0].short_name;
            From.address1 = placeFrom.address_components[0].short_name + ' ' + placeFrom.address_components[1].short_name;
              fillForm(From,'from');
          }
        });

      }

var LdapTool = function () {};
LdapTool.prototype.getList = function() {
    if (username === "") return this;
    $.ajax({
        url:'/addresses',
        dataType: 'json'
    }).done(function(addresses) {
        addresses = addresses.response.docs;
        for (var address in addresses) {
                $('#mytable').append(
                    '<tr>'+
                    '<td>'+
                    '<input type="button" class="btn btn-sm btn-default useme" value="select"/></td>'+
                    '<td>'+addresses[address].firstname+'</td>'+
                    '<td>'+addresses[address].lastname+'</td>'+
                    '<td class="address">'+addresses[address].addresse+'</td>'+
                    '</tr>'
                );
        }
    });
    this.name = name;
    return this;
};
