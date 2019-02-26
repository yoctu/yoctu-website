var start = 0;
var rows = 10;
var order = [[0, 'asc']];
var query = [ "*", "*" ];

var renderFunction = function ( data, type, row, meta ) { return JSON.stringify(data); };

jQuery(document).ready(function($) {

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
            xhr.setRequestHeader("Authorization", "Basic " + btoa('user:password'));
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

   $('#clearFilter').on( 'click', function (e) {
	$(':input[type=text]').val('');
   });

});
