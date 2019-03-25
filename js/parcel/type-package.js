var parcel_unit = "fr";
var divide_unit = 10;

var envelope = {"ISO":{"A10":{"fr":[26,37],"points":[74,105],"us":[1,1.5]},"A1":{"fr":[594,841],"points":[1684,2384],"us":[23.4,33.1]},"A0":{"fr":[841,1189],"points":[2384,3370],"us":[33.1,46.8]},"A3":{"fr":[297,420],"points":[842,1191],"us":[11.7,16.5]},"A2":{"fr":[420,594],"points":[1191,1684],"us":[16.5,23.4]},"A5":{"fr":[148,210],"points":[420,595],"us":[5.8,8.3]},"A4":{"fr":[210,297],"points":[595,842],"us":[8.3,11.7]},"A7":{"fr":[74,105],"points":[210,298],"us":[2.9,4.1]},"A6":{"fr":[105,148],"points":[298,420],"us":[4.1,5.8]},"A9":{"fr":[37,52],"points":[105,147],"us":[1.5,2]},"A8":{"fr":[52,74],"points":[147,210],"us":[2,2.9]},"B10":{"fr":[44,31],"points":[125,88],"us":[1.7,1.2]},"B1+":{"fr":[1020,720],"points":[2891,2041],"us":[40.2,28.3]},"B4":{"fr":[353,250],"points":[1001,709],"us":[13.9,9.8]},"B5":{"fr":[250,176],"points":[709,499],"us":[9.8,6.9]},"B6":{"fr":[176,125],"points":[499,354],"us":[6.9,4.9]},"B7":{"fr":[125,88],"points":[354,249],"us":[4.9,3.5]},"B0":{"fr":[1414,1000],"points":[4008,2835],"us":[55.7,39.4]},"B1":{"fr":[1000,707],"points":[2835,2004],"us":[39.4,27.8]},"B2":{"fr":[707,500],"points":[2004,1417],"us":[27.8,19.7]},"B3":{"fr":[500,353],"points":[1417,1001],"us":[19.7,13.9]},"B2+":{"fr":[720,520],"points":[2041,1474],"us":[28.3,20.5]},"B8":{"fr":[88,62],"points":[249,176],"us":[3.5,2.4]},"B9":{"fr":[62,44],"points":[176,125],"us":[2.4,1.7]},"C10":{"fr":[40,28],"points":[113,79],"us":[1.6,1.1]},"C9":{"fr":[57,40],"points":[162,113],"us":[2.2,1.6]},"C8":{"fr":[81,57],"points":[230,162],"us":[3.2,2.2]},"C3":{"fr":[458,324],"points":[1298,918],"us":[18,12.8]},"C2":{"fr":[648,458],"points":[1837,1298],"us":[25.5,18]},"C1":{"fr":[917,648],"points":[2599,1837],"us":[36.1,25.5]},"C0":{"fr":[1297,917],"points":[3677,2599],"us":[51.5,36.1]},"C7":{"fr":[114,81],"points":[323,230],"us":[4.5,3.2]},"C6":{"fr":[162,114],"points":[459,323],"us":[6.4,4.5]},"C5":{"fr":[229,162],"points":[649,459],"us":[9,6.4]},"C4":{"fr":[324,229],"points":[918,649],"us":[12.8,9]}},"North American sizes":{"Legal":{"fr":[216,356],"points":[612,1009],"us":[8.5,14]},"Junior Legal":{"fr":[127,203],"points":[360,575],"us":[5,8]},"Government-Letter":{},"Letter":{"fr":[216,279],"points":[612,791],"us":[8.5,11]},"Tabloid":{"fr":[279,432],"points":[791,1225],"us":[11,17]},"Ledger":{"fr":[432,279],"points":[1225,791],"us":[17,11]}},"ANSI paper sizes":{"ANSI C":{"fr":[432,559],"points":[1225,1585],"us":[17,22]},"ANSI A (letter)":{"fr":[216,279],"points":[612,791],"us":[8.5,11]},"ANSI B (ledger & tabloid)":{"fr":[279,432],"points":[791,1225],"us":[11,17]},"ANSI E":{"fr":[864,1118],"points":[2449,3169],"us":[34,44]},"ANSI D":{"fr":[559,864],"points":[1585,2449],"us":[22,34]}}};

function toggleUnit () {
    if (parcel_unit === "fr") {
        parcel_unit = "us";
        divide_unit = 1;
        $('#unitType').text("Metric");
        $('#form-weight').attr("placeholder", "Weight in lbs...");
        $('#form-height').attr("placeholder", "Height in inches...");
        $('#form-width').attr("placeholder", "Width in inches...");
        $('#form-length').attr("placeholder", "Length in inches...");
    } else {
        parcel_unit = "fr";
        divide_unit = 10;
        $('#unitType').text("Imperial");
        $('#form-weight').attr("placeholder", "Weight in kg...");
        $('#form-height').attr("placeholder", "Height in cm...");
        $('#form-width').attr("placeholder", "Width in cm...");
        $('#form-length').attr("placeholder", "Length in cm...");
    }
    if ($('#form-template-type').val() !== 'MyPackaging') {
        $('#form-width').val(parseFloat(envelope["ISO"][$('#form-template-type').val()][parcel_unit][0]) / divide_unit);
        $('#form-length').val(parseFloat(envelope["ISO"][$('#form-template-type').val()][parcel_unit][1]) / divide_unit);
    }
}

$(document).ready(function(){

        $('#form-type-display').text($('input[name="formType"]').attr('data-text'));
        $('#form-template-type').append($("<option></option>").attr("value",'MyPackaging').text('MyPackaging'));
        for (var options in envelope["ISO"]) {
            $('#form-template-type').append($("<option></option>").attr("value",options).text(options));
        }

        $("input[name='formType']").click(function(){
            var radioValue = $("input[name='formType']:checked").val();
            if(radioValue){
                if (radioValue === "1") {
                    for (var options in envelope["ISO"]) {
                        $('#form-template-type').append($("<option></option>").attr("value",options).text(options));
                    }
                }
            }
        });

        $("select[name='form-template-type']").change(function(){
            var unit = 'fr';
            if (parcel_unit !== 'fr' ) unit = "us";

            if ($(this).val() !== 'MyPackaging') {
                $('#form-weight').val('0.1');
                $('#form-height').val('0.1');
                $('#form-width').val(parseFloat(envelope["ISO"][$(this).val()][parcel_unit][0]) / divide_unit);
                $('#form-length').val(parseFloat(envelope["ISO"][$(this).val()][parcel_unit][1]) / divide_unit);
            } else {
                $('#form-weight').val('');
                $('#form-height').val('');
                $('#form-width').val('');
                $('#form-length').val('');
            }
        });
        
    });
