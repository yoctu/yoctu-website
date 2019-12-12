/*var urlParams = new URLSearchParams(window.location.search);
if (!urlParams.has('code')) window.location.replace("/login");
else $("#all").removeClass("d-none");*/

var id = "13e8b636f819b299a1260466bf000ed9";
var profile = {};

async function fetchProfile() {
    const result = await $.ajax({
        "url": "/account/" + id,
        "type": "GET"
    });
    return result;
}

function refresh(menuType) {
    let menuList = ["solr", "nodered", "kafka", "couchdb", "welcome"];
    let cpt = 0;
    for (menu in menuList) {
        $("#" + menuList[menu]).addClass("d-none");
        $("#li_" + menuList[menu]).removeClass("active");
    }
    $("#" + menuType).removeClass("d-none");
    $("#li_" + menuType).addClass("active");
    $("#loader-container").removeClass("d-none");
    switch (menuType) {
        case menuList[0]:
            fetchSolr();
            break;
        case menuList[1]:
            fetchNode();
            break;
        case menuList[2]:
            fetchKafka();
            break;
        case menuList[3]:
            fetchCoudhDB();
            break;
        default:
            break;
    }
}

function displaykafka(kafkaProfile) {
    $("#kafka").find(".well-kafka").remove();
    $(".costkafka").addClass("d-none");
    let costKafka = 0.00;
    for (s in kafkaProfile) {
        let well = $(".template-well-kafka").clone();
        well.appendTo("#kafka");
        well.removeClass("template-well-kafka").addClass("well-kafka");
        well.find(".url").html("</div><div>Brokers: <div>");
        for (u in kafkaProfile[s].url) {
            well.find(".url").append('<div class="text-center">' + kafkaProfile[s].url[u] + '</div>');
        }
        well.find(".user").html('User: <div class="text-center">' + kafkaProfile[s].user + '</div>');
        well.find(".type").html('Type: <div class="text-center">' + kafkaProfile[s].type + '</div>');
        well.find(".topics").html("<div>Topics: <div>");
        for (c in kafkaProfile[s].topics) {
            well.find(".Topics").append('<div class="text-center">' + c + '</div>');
            if (kafkaProfile[s].type === "shared") costKafka += profile.price.shared.kafka;
            else costKafka += profile.price.dedicated.kafka;
        }
        well.find(".ui").html();
    }
    $("#kafkacost").html(costKafka.toFixed(2));
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        $(".costkafka").removeClass("d-none");
        $(".well-kafka").removeClass("d-none");
    }, 1000)
}

function displaysolr(solrProfile) {
    $("#solr").find(".well-solr").remove();
    $(".costsolr").addClass("d-none");
    let costSolr = 0.00;
    for (s in solrProfile) {
        let well = $(".template-well-solr").clone();
        well.appendTo("#solr");
        well.removeClass("template-well-solr").addClass("well-solr");
        well.find(".url").html("</div><div>Servers: <div>");
        for (u in solrProfile[s].url) {
            well.find(".url").append('<div class="text-center">' + solrProfile[s].url[u] + '</div>');
        }
        well.find(".user").html('User: <div class="text-center">' + solrProfile[s].user + '</div>');
        well.find(".type").html('Type: <div class="text-center">' + solrProfile[s].type + '</div>');
        well.find(".collections").html("<div>Collections: <div>");
        for (c in solrProfile[s].collections) {
            well.find(".Collections").append('<div class="text-center">' + c + '</div>');
            if (solrProfile[s].type === "shared") costSolr += profile.price.shared.solr;
            else costSolr += profile.price.dedicated.kafka;
        }
        well.find(".ui").html();
    }
    $("#solrcost").html(costSolr.toFixed(2));
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        $(".costsolr").removeClass("d-none");
        $(".well-solr").removeClass("d-none");
    }, 1000)
}

async function fetchSolr() {
    profile = await fetchProfile();
    displaysolr(profile.solr)
}

async function fetchNode() {
    profile = await fetchProfile();
    displaynode(profile.nodered)
}

async function fetchKafka() {
    profile = await fetchProfile();
    displaykafka(profile.kafka)
}

async function fetchCoudhDB() {
    profile = await fetchProfile();
    displaycouchdb(profile.couchdb)
}

$("#deleteCollection").on("click", function () {
    $("#confirm-modal-yes").unbind();
    $("#confirm-modal-yes").on("click", function () {
        let collection = $("#createname").val();
        $("#QuestionModal").find(".modal-body").html("Deleting collection...");
        $.ajax({
            url: '/collection/' + id + '/' + collection,
            type: 'DELETE',
            success: function (response) {
                fetchSolr();
                $("#QuestionModal").modal("d-none");
            },
        });
    });
    let output = '<div class="form-group"><label>Collection : </label><select id="createname" class="form-control">';
    for (s in profile.solr)
        for (c in profile.solr[s].collections)
            output += '<option>' + c + '</option>';
    output += '</select></div>';
    $("#QuestionModal").find(".modal-body").html(output);
    $("#QuestionModal").find(".modal-title").html("Delete Collection");
    $("#QuestionModal").modal("show");
});

$("#createCollection").on("click", function () {
    $("#confirm-modal-yes").unbind();
    $("#confirm-modal-yes").on("click", function () {
        //var fd = new FormData();
        //var files = $('#file')[0].files[0];
        //fd.append('file', files);
        let collection = $("#createname").val();
        $("#QuestionModal").find(".modal-body").html("Creating collection...");
        $.ajax({
            url: '/collection/' + id + '/' + collection,
            type: 'POST',
            //   data: fd,
            //   contentType: false,
            //   processData: false,
            success: function (response) {
                fetchSolr();
                $("#QuestionModal").modal("d-none");
            },
            statusCode: {
                406: function (response) {
                    $("#QuestionModal").modal("d-none");
                    $("#InformationModalBody").html("Collection already Exists !");
                    $("#InformationModal").modal("show");
                },
            }
        });
    });
    $("#QuestionModal").find(".modal-body").html('<div class="form-group"><label>Name : </label><input id="createname" class="form-control"></input></div>');
    $("#QuestionModal").find(".modal-body").append('<div class="form-group"><label>Type : </label><select id="createtype" class="form-control"><option>Shared</option></select></div>');
    /*$("#QuestionModal").find(".modal-body").append('<div class="form-group"><label>Config Set : </label>\
    <form method="post" action="" enctype="multipart/form-data" id="myform">\
    <div><input type="file" id="file" name="file" /></div></form> ');*/
    $("#QuestionModal").find(".modal-title").html("Create Collection");
    $("#QuestionModal").modal("show");
});

$("#deleteTopic").on("click", function () {
    $("#confirm-modal-yes").unbind();
    $("#confirm-modal-yes").on("click", function () {
        $.ajax({
            url: '/topic/' + id + '/' + $("#createname").val(),
            type: 'DELETE',
            success: function (response) {
                fetchKafka();
                $("#QuestionModal").modal("d-none");
            },
        });
    });
    let output = '<div class="form-group"><label>Topic : </label><select id="createname" class="form-control">';
    for (s in profile.kafka)
        for (c in profile.kafka[s].topics)
            output += '<option>' + c + '</option>';
    output += '</select></div>';
    $("#QuestionModal").find(".modal-body").html(output);
    $("#QuestionModal").find(".modal-title").html("Delete Topic");
    $("#QuestionModal").modal("show");
});

$("#createTopic").on("click", function () {
    $("#confirm-modal-yes").unbind();
    $("#confirm-modal-yes").on("click", function () {
        $.ajax({
            url: '/topic/' + id + '/' + $("#createname").val(),
            type: 'POST',
            success: function (response) {
                fetchKafka();
                $("#QuestionModal").modal("d-none");
            },
        });
    });
    $("#QuestionModal").find(".modal-body").html('<div class="form-group"><label>Name : </label><input id="createname" class="form-control"></input></div>');
    $("#QuestionModal").find(".modal-body").append('<div class="form-group"><label>Type : </label><select id="createtype" class="form-control"><option>Shared</option></select></div>');
    $("#QuestionModal").find(".modal-body").append('<div class="form-group"><label>Partitions : </label><select id="createpartition" class="form-control"><option>1</option></select></div>');
    $("#QuestionModal").find(".modal-title").html("Create Topic");
    $("#QuestionModal").modal("show");
});

$(document).ready(function () {
    /*$.ajax({
        "url": "/account/" + id,
        "type": "GET",
        "success": function (data) {
            profile = data;
            $("#companyname").text(profile.company.name);
            $("#topics").text(Object.keys(profile.kafka[0].topics).length);
            $("#collections").text(Object.keys(profile.solr[0].collections).length);
            $("#cost").text((Object.keys(profile.kafka[0].topics).length * profile.price.shared.kafka + Object.keys(profile.solr[0].collections).length * profile.price.shared.solr).toFixed(2));
        }
    });*/
});
