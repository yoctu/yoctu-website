var start = 0;
var rows = 10;
var order = [[0, 'asc']];
var query = [ "*", "*" ];

var renderFunction = function ( data, type, row, meta ) { return JSON.stringify(data); };

var urlParams = new URLSearchParams(location.search);
urlEntity = 0;
if (urlParams.has('entity')) {
    urlEntity = urlParams.get('entity');
}

jQuery(document).ready(function($) {

    var user = entities[urlEntity]["user"];
    var password = entities[urlEntity]["password"];
    var host = entities[urlEntity]["host"];
    var columns = entities[urlEntity]["data"];
	
    var row ='<div><table width="100%"><tr><td align="center" width="20%"><button class="dt-solr-button" id="clearFilter">clear</button>';
    row += '<td align="center" width="60%"><select id="solrhost">';
    for (var entity in entities) {
        if (entity == urlEntity) {
            row += '<option value="'+entity+'" selected>' + entities[entity].label  + '</option>';
        } else {
            row += '<option value="'+entity+'">' + entities[entity].label + "</option>";
        }
    }
    row += '</select></td><td align="20%" width="20%"><button class="dt-solr-button" id="toggleFilter">show</button></td>';
    row += '</tr></table></div>';

    row += '<div align="center" id="solr-filter-buttons" style="display: none;">';
    for (var column in columns) {
        row += '<button class="dt-solr-button toggle-vis" data-column="'+column+'">' + columns[column].name  + "</button>";
    }
    row += '</div><br></tr></table>';
    row += '<table id="solrDT" class="display" width="100%"><thead><tr>';
    for (var column in columns) {
        row += "<th>" + columns[column].name  + "</th>";
}
    row += '</tr></thead><tfoot><tr>';
    for (var column in columns) {
        row += "<th>" + columns[column].name  + "</th>";
    }
    row += '</tr></tfoot></table>';
    $('#solr-div').html(row);
	
    $('#solrDT').dataTable( {
       "processing":true,
       "pagingType":"numbers",
       "responsive": true,
       "serverSide":true,
	"order": order,
	"pageLength": rows,
     "ajax": function ( data, callback, settings ) {
       $.ajax( {
         "url": host + "/select?q="+query[0]+":"+query[1]+"&wt=json&rows=" + rows + "&start=" + start + "&sort="+columns[order[0][0]].data+"%20"+order[0][1],
         "dataType": "jsonp",
         "jsonp":"json.wrf",
	"beforeSend": function(xhr){
            xhr.setRequestHeader("Authorization", "Basic " + btoa(user+':'+password));
         },
         "success": function ( json ) {
           var o = {
             recordsTotal: json.response.numFound,
             recordsFiltered: json.response.numFound,
             data: json.response.docs
           };        
           callback(o);
         }
       } );
     },
	"columns" : columns
   });

   $('#solrDT thead tr th').each( function (i) {
        var title = $(this).text();
	if (columns[$(this)[0].cellIndex].filterable) {	
            $(this).append( '<br><input type="text" --data-column="'+i+'" placeholder="Search '+title+'" />' );
            $( 'input', this ).on( 'keyup', function (k) {
		if (k.keyCode == 13) {
		    let value = this.value;
                    $(':input[type=text]').val('');
                    this.value = value;
                    if ( $('#solrDT').DataTable().column(i).search() !== value ) {
		        query[0] = columns[i].data;
		        if (value) {
		            query[1] = "*" + value + "*";
		        } else {
			    query[1] = "*";
		        }
                        $('#solrDT').DataTable()
                            .column(i)
                            .search( value )
                            .draw();
                    }
		}
            } );
	}
    } );

  $( 'input').on( 'click', function (e) {
	e.preventDefault();
	e.stopPropagation();
});

   $('#solrDT').on( 'page.dt', function () {
   	start = rows * $('#solrDT').DataTable().page.info().page;
   } );

   $('#solrDT').on( 'length.dt', function (e, settings, len) {
        rows = len;
   } );
   
   $('.toggle-vis').on( 'click', function (e) {
	e.preventDefault();
	var column = $('#solrDT').DataTable().column( $(this).attr('data-column') );
	$(this).toggleClass('highlight');
	column.visible( ! column.visible() );
   } );

   $( "#solrhost" ).change(function() {
	host = entities[$( "#solrhost option:selected" ).val()].host;
	window.location.replace('?entity='+$( "#solrhost option:selected" ).val());
   });

   $('#toggleFilter').on( 'click', function (e) {
        $('#solr-filter-buttons').toggle();
   });

   $('#clearFilter').on( 'click', function (e) {
	$(':input[type=text]').val('');
   });

});
