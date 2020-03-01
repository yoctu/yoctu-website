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
var card = elements.create("card", {
    style: style
});

async function fetchProfile() {
    if (idp === "") return {};
    const result = await $.ajax({
        "url": "/account/" + idp,
        "type": "GET"
    });
    return result;
}

function refresh(menuType) {
    let menuList = ["nodered", "profile", "welcome"];
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
            fetchNode();
            break;
        case menuList[1]:
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
          url: '/api/customer/' + idc,
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
          url: '/api/user/' + user.sub,
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
        if (Object.keys(profile).length > 0) {
            $("#profile-yes").removeClass("d-none");
            if (profile.owner === user.sub) {
                $("#transfertprofile").removeClass("d-none");
                $("#destroyprofile").removeClass("d-none");
                $("#editprofile").removeClass("d-none");
            } else $("#leaveprofile").removeClass("d-none");
        } else $("#profile-no").removeClass("d-none");
        $("#profile").removeClass("d-none");
    }, 1000)
}

function displaynode(nodeProfile) {
  let table = '<button class="btn btn-primary"> New </button><br><br><table class="table"><thead><th>Name</th><th>Owner</th><th>Server</th><th>Port</th><th>Connect</th><th></th></thead><tbody>';
    for (let s in nodeProfile) {
      for (let n in nodeProfile[s].nodes) {
        table += '<tr><td>' + nodeProfile[s].nodes[n].name + ' </td><td></td><td>' + nodeProfile[s].server + '</td><td>' + nodeProfile[s].nodes[n].port + ' </td><td><a href="http://' + nodeProfile[s].server + ':' + nodeProfile[s].nodes[n].port + '" target="_blank"> connect </a></td><td></td></tr>';
      }
    }
    table += '</tbody></table>';
    $("#nodered").html(table);
    setTimeout(function () {
        $("#loader-container").addClass("d-none");
        $(".card-node").removeClass("d-none");
        $("#nodered").removeClass("d-none");
    }, 500);
}

async function fetchProfileUser() {
    if (Object.keys(profile).length < 1) profile = await fetchProfile();
    displayprofile(profile);
}

async function fetchNode() {
    profile = await fetchProfile();
    displaynode(profile.nodes);
}

$(document).ready(function () {

    $("#submitpay").on("click", function () {
        if ($("#card-name").val() && $("#card-email").val()) {
            $("#profile-no").addClass("d-none");
            $("createCustomer").addClass("d-none");
            $("#loader-container").removeClass("d-none");
            stripe.createPaymentMethod('card', card, {
                billing_details: {
                  email: $("#card-email").val()
                }
              }).then(function(result) {
                $.ajax({
                    url: '/api/customer',
                    type: 'POST',
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify({ email: $("#card-email").val(), name: $("#card-name").val(), payment_method: result.paymentMethod.id }),
                    success: function (responseC) {
                        idc = responseC.id;
                        $.ajax({
                            url: '/api/account/' + user.sub,
                            type: 'POST',
                            success: function (responseA) {
                                profile = responseA;
                                idp = responseA.id;
                                $.ajax({
                                    url: '/api/user/join/' + user.sub + '/' + idc + '/' + idp,
                                    type: 'PATCH',
                                    contentType: "application/json",
                                    success: function (responseU) {
                                        $("#loader-container").addClass("d-none");
                                        fetchProfileUser();
                                    }
                                });
                            }
                        });
                    }
                });
              });
        }
    });

    $("#createprofile").on("click", function () {
        let output = '';
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
                url: '/api/user/join/' + user.sub + '/' + $("#companycode").val() + '/' + $("#profilecode").val(),
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
                url: '/api/user/leave/' + user.sub + '/' + idc + '/' + idp,
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
