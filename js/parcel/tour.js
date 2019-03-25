jQuery(document).ready(function () {
var tour = new Tour({
 storage: false,
 template: "<div class='popover tour'><div class='arrow'></div><h3 class='popover-title'></h3><div class='popover-content'></div><div class='popover-navigation'><button class='btn-xs btn-default' data-role='prev'>« Prev</button>&nbsp;<button class='btn-xs btn-default' data-role='next'>Next »</button>&nbsp;<button class='btn-xs btn-default' data-role='end'>End tour</button></div></div>",
  steps: [
  {
    element: "#connect-sign-in",
    title: "Login",
    content: "login with : demo / demo"
  },
  {
    element: "#parcel-img",
    title: "Type",
    content: "Select your transport type"
  }
]});

tour.init();

tour.start();

});
