function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

jQuery(document).ready(function () {

$('#skoreway-shaq').on('click', function() {
    let dt = $('#datepicker').datepicker('getDate');
    var id = uuidv4();
    var key = uuidv4().substring(0,8);
    var data = { deContact: [ To.company, To.name, To.email, To.phone ], deDate: dt.getFullYear() + '-' + dayMonth(dt) + '-' + dt.getDate() + 'T' + dt.getHours() + ':' + dt.getMinutes() + ':00.000Z', dePlace: [ To.address1, To.postcode, To.city, "France", To.country_code], dimension: [ parseFloat($('#form-length').val()), parseFloat($('#form-width').val()), parseFloat($('#form-height').val()), parseFloat($('#form-weight').val())], distance: "500", id: id, key: key, name: key, notes: "Nothing", puContact: [ From.company, From.name, From.email, From.phone ], puDate: "NOW+2HOUR", puPlace: [ From.address1, From.postcode, From.city, "France", From.country_code ], reported_at: "NOW", source: [ usercode ], sourceName: [ usercode + " Demo" ], stackable: "No", status: "running", target: ["RE10000","RE10001","10HAR"], targetName: ["Simonin Inc.", "Houin Transport.","Taxi Henrion"], type: "auction", valid_from: "NOW+1HOUR", valid_until: "NOW+1DAY", vehicule: "LAMBDA" };
    $.ajax( {
        url: 'https://shaq.dev.skoreway.com/api/shaq/'+usercode,
        dataType: "json",
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        method: "POST",
        data: JSON.stringify([ data ]),
        beforeSend: function(xhr){
            xhr.setRequestHeader("Authorization", "Basic ZGVtbzpkZW1v");
        },
        complete: function (shaq) {
            window.open("https://shaq.dev.skoreway.com/"+usercode+"/display/"+key,'_blank');
        }
    });
});

});