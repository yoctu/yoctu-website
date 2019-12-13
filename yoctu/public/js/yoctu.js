var stripe = Stripe('pk_test_ofHh5O1lHNxqQlhSbWqbYJxi00mW11Bsnv');
var elements = stripe.elements();

var userDesc = {};
var custDesc = {};

var style = {
    base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
            color: "#aab7c4"
        }
    },
    invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
    }
};

async function fetchProfile() {
    if (idp === "") return {};
    const result = await $.ajax({
        "url": "/account/" + idp,
        "type": "GET"
    });
    return result;
}

function refresh(menuType) {
    let menuList = ["solr", "nodered", "kafka", "couchdb", "welcome", "profile"];
    let cpt = 0;
    for (menu in menuList) {
        if ($("#" + menuList[menu])) {
            $("#" + menuList[menu]).addClass("d-none");
            $("#li_" + menuList[menu]).removeClass("active");
        }
    }
    if ($("#li_" + menuType)) $("#li_" + menuType).addClass("active");
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
            fetchCouchDB();
            break;
        case menuList[5]:
            fetchProfileUser();
            break;
        default:
            break;
    }
}

function displayprofile(profile) {
    $("#profile-yes").addClass("d-none");
    $("#profile-no").addClass("d-none");
    $("#profile-no-btn").removeClass("d-none");
    if ((Object.keys(profile).length > 0) && (Object.keys(userDesc).length === 0) && (Object.keys(custDesc).length === 0)) {
      $.ajax({
          url: '/customer/' + idc,
          success: function (responseC) {
              custDesc = responseC;
              let outputC = '<div><b>Company : </b></div>';
              outputC += '<div>Name : ' + custDesc.name + '</div>';
              outputC += '<div>Code : ' + custDesc.id + '</div>';
              outputC += '<div>Email : ' + custDesc.email + '</div>';
              outputC += '<div>Phone : ' + custDesc.phone + '</div>';
              $("#customer_desc").html(outputC);
          },
      });
      $.ajax({
          url: '/user/' + user.sub,
          success: function (responseU) {
              userDesc = responseU;
              let outputU = '<div><b>Profile : </b></div>';
              outputU += '<div>Name : ' + userDesc.name + '</div>';
              outputU += '<div>Code : ' + idp + '</div>';
              outputU += '<div>Email : ' + userDesc.email + '</div>';
              $("#user_desc").html(outputU);
          },
      });
    }
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        if (Object.keys(profile).length > 0) $("#profile-yes").removeClass("d-none");
        else $("#profile-no").removeClass("d-none");
        $("#profile").removeClass("d-none");
    }, 1000)
}

function displaynode(nodeProfile) {
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        $(".costnode").removeClass("d-none");
        $(".card-node").removeClass("d-none");
        $("#node").removeClass("d-none");
    }, 500);
}

function displaycouchdb(couchdbProfile) {
    $("#couchdb").find(".card-couchdb").remove();
    $(".costcouchdb").addClass("d-none");
    let costCouchdb = 0.00;
    for (s in couchdbProfile) {
        let well = $(".template-card-couchdb").clone();
        well.appendTo("#couchdb");
        well.removeClass("template-card-couchdb").addClass("card-couchdb");
        well.find(".url").html("</div><div>Servers: <div>");
        for (u in couchdbProfile[s].url) {
            well.find(".url").append('<div class="text-center">' + couchdbProfile[s].url[u] + '</div>');
        }
        well.find(".user").html('User: <div class="text-center">' + couchdbProfile[s].user + '</div>');
        well.find(".type").html('Type: <div class="text-center">' + couchdbProfile[s].type + '</div>');
        well.find(".dbs").html("<div>Databases: <div>");
        for (c in couchdbProfile[s].topics) {
            well.find(".dbs").append('<div class="text-center">' + c + '</div>');
            if (couchdbProfile[s].type === "shared") costCouchdb += profile.price.shared.couchdb;
            else costCouchdb += profile.price.dedicated.couchdb;
        }
        well.find(".ui").html();
    }
    $("#couchdbcost").html(costCouchdb.toFixed(2));
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        $(".costcouchdb").removeClass("d-none");
        $(".card-couchdb").removeClass("d-none");
        $("#couchdb").removeClass("d-none");
    }, 500);

}

function displaykafka(kafkaProfile) {
    $("#kafka").find(".card-kafka").remove();
    $(".costkafka").addClass("d-none");
    let costKafka = 0.00;
    for (s in kafkaProfile) {
        let well = $(".template-card-kafka").clone();
        well.appendTo("#kafka");
        well.removeClass("template-card-kafka").addClass("card-kafka");
        well.find(".url").html("</div><div>Brokers: <div>");
        for (u in kafkaProfile[s].url) {
            well.find(".url").append('<div class="text-center">' + kafkaProfile[s].url[u] + '</div>');
        }
        well.find(".user").html('User: <div class="text-center">' + kafkaProfile[s].user + '</div>');
        well.find(".type").html('Type: <div class="text-center">' + kafkaProfile[s].type + '</div>');
        well.find(".topics").html("<div>Topics: <div>");
        for (c in kafkaProfile[s].topics) {
            well.find(".topics").append('<div class="text-center">' + c + '</div>');
            if (kafkaProfile[s].type === "shared") costKafka += profile.price.shared.kafka;
            else costKafka += profile.price.dedicated.kafka;
        }
        well.find(".ui").html();
    }
    $("#kafkacost").html(costKafka.toFixed(2));
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        $(".costkafka").removeClass("d-none");
        $(".card-kafka").removeClass("d-none");
        $("#kafka").removeClass("d-none");
    }, 500);
}

function displaysolr(solrProfile) {
    $("#solr").find(".card-solr").remove();
    $(".costsolr").addClass("d-none");
    let costSolr = 0.00;
    for (s in solrProfile) {
        let well = $(".template-card-solr").clone();
        well.appendTo("#solr");
        well.removeClass("template-card-solr").addClass("card-solr");
        well.find(".url").html("</div><div>Servers: <div>");
        for (u in solrProfile[s].url) {
            well.find(".url").append('<div class="text-center">' + solrProfile[s].url[u] + '</div>');
        }
        well.find(".user").html('User: <div class="text-center">' + solrProfile[s].user + '</div>');
        well.find(".type").html('Type: <div class="text-center">' + solrProfile[s].type + '</div>');
        well.find(".collections").html("<div>Collections: <div>");
        for (c in solrProfile[s].collections) {
            well.find(".collections").append('<div class="text-center">' + c + '</div>');
            if (solrProfile[s].type === "shared") costSolr += profile.price.shared.solr;
            else costSolr += profile.price.dedicated.kafka;
        }
        well.find(".ui").html();
    }
    $("#solrcost").html(costSolr.toFixed(2));
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        $(".costsolr").removeClass("d-none");
        $(".card-solr").removeClass("d-none");
        $("#solr").removeClass("d-none");
    }, 500)
}

async function fetchProfileUser() {
    if (Object.keys(profile).length < 1) profile = await fetchProfile();
    displayprofile(profile);
}

async function fetchSolr() {
    profile = await fetchProfile();
    displaysolr(profile.solr);
}

async function fetchNode() {
    profile = await fetchProfile();
    displaynode(profile.nodered);
}

async function fetchKafka() {
    profile = await fetchProfile();
    displaykafka(profile.kafka);
}

async function fetchCouchDB() {
    profile = await fetchProfile();
    displaycouchdb(profile.couchdb);
}

$("#deleteCollection").on("click", function () {
    $("#confirm-modal-yes").unbind();
    $("#confirm-modal-yes").on("click", function () {
        let collection = $("#createname").val();
        $("#QuestionModal").find(".modal-body").html("Deleting collection...");
        $.ajax({
            url: '/collection/' + idp + '/' + collection,
            type: 'DELETE',
            success: function (response) {
                fetchSolr();
                $("#QuestionModal").modal("hide");
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
            url: '/collection/' + idp + '/' + collection,
            type: 'POST',
            //   data: fd,
            //   contentType: false,
            //   processData: false,
            success: function (response) {
                fetchSolr();
                $("#QuestionModal").modal("hide");
            },
            statusCode: {
                406: function (response) {
                    $("#QuestionModal").modal("hide");
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
            url: '/topic/' + idp + '/' + $("#createname").val(),
            type: 'DELETE',
            success: function (response) {
                fetchKafka();
                $("#QuestionModal").modal("hide");
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
            url: '/topic/' + idp + '/' + $("#createname").val(),
            type: 'POST',
            success: function (response) {
                fetchKafka();
                $("#QuestionModal").modal("hide");
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

    $("#submitpay").on("click", function () {
        if ($("#card-name").val() && $("#card-email").val()) {
            stripe.createPaymentMethod('card', cardElement, {
                billing_details: {
                  email: $("#card-email").val()
                },
              }).then(function(result) {
                console.log(result.paymentMethod);
                $.ajax({
                    url: '/customer',
                    type: 'POST',
                    data: { email: $("#card-email").val(), payment_method: result.paymentMethod.id },
                    success: function (response) {
                        console.log(response);
                        fetchProfileUser();
                    }
                });
              });
        }
    }

    $("#createprofile").on("click", function () {
        let output = '';
        var card = elements.create("card", {
            style: style
        });
        card.mount("#payCard");
        $("#createCustomer").removeClass("d-none");
        $("#profile-no-btn").addClass("d-none");
        card.addEventListener('change', function (event) {
            var displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
    });

    $("#addprofile").on("click", function () {
        $("#confirm-modal-yes").unbind();
        $("#confirm-modal-yes").on("click", function () {
            $.ajax({
                url: '/user/join/' + user.sub + '/' + $("#companycode").val() + '/' + $("#profilecode").val(),
                type: 'PATCH',
                contentType: "application/json",
                success: function (response) {
                    $("#QuestionModal").modal("hide");
                    idc = $("#companycode").val();
                    idp = $("#profilecode").val();
                    fetchProfileUser();
                },
            });
        });
        let output = '<div class="form-group"><label>Profile Code : </label><input id="profilecode" class="form-control"></input></div>\
        <div class="form-group"><label>Company Code : </label><input id="companycode" class="form-control"></input></div>';
        $("#QuestionModal").find(".modal-body").html(output);
        $("#QuestionModal").find(".modal-title").html("Add Profile");
        $("#QuestionModal").modal("show");
    });

    $("#leaveprofile").on("click", function () {
        $("#confirm-modal-yes").unbind();
        $("#confirm-modal-yes").on("click", function () {
            $.ajax({
                url: '/user/leave/' + user.sub + '/' + idc + '/' + idp,
                type: 'PATCH',
                contentType: "application/json",
                success: function (response) {
                    $("#QuestionModal").modal("hide");
                    profile = {};
                    company = {};
                    idp = "";
                    idc = "";
                    custDesc = {};
                    fetchProfileUser();
                },
            });
        });
        let output = '<div class="form-group">Do you really ant to leave ?</div>';
        $("#QuestionModal").find(".modal-body").html(output);
        $("#QuestionModal").find(".modal-title").html("Leave");
        $("#QuestionModal").modal("show");
    });
});
