var user = {};
var profile = {};
var company = {};
var idp = "";
var idc = "";

const router = {
  "/": () => showContent("all"),
  "/profile": () =>
    requireAuth(() => showContent("content-profile"), "/profile"),
  "/login": () => login()
};

const eachElement = (selector, fn) => {
  for (let e of document.querySelectorAll(selector)) {
    fn(e);
  }
};

const showContentFromUrl = (url) => {
  if (router[url]) {
    router[url]();
    return true;
  }
  return false;
};

const isRouteLink = (element) =>
  element.tagName === "A" && element.classList.contains("route-link");

const showContent = (id) => {
  eachElement(".page", (p) => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

const updateUI = async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated();
    if (isAuthenticated) {
      user = await auth0.getUser();
      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-name", (e) => (e.innerText = user.name));
      eachElement(".user-email", (e) => (e.innerText = user.email));
      var d = new Date();
      d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
      document.cookie = "user=" + JSON.stringify(user) + ";expires=" + d.toUTCString() + ";path=/";
      document.getElementById("all").classList.remove("d-none");
      if (user["https://shaq.yoctu.solutions/profile"]) {
        idp = user["https://shaq.yoctu.solutions/profile"];
        $.ajax({
          "url": "/account/" + idp,
          "type": "GET",
          "success": function (data) {
            profile = data;
            setTimeout(function() {
              $("#topics").text(Object.keys(profile.kafka[0].topics).length);
              $("#collections").text(Object.keys(profile.solr[0].collections).length);
              $("#cost").text((Object.keys(profile.kafka[0].topics).length * profile.price.shared.kafka + Object.keys(profile.solr[0].collections).length * profile.price.shared.solr).toFixed(2));
            });
          }
        });
      }
      if (user["https://shaq.yoctu.solutions/company"]) {
        idc = user["https://shaq.yoctu.solutions/company"];
      }
    } else window.location.replace("/login");
  } catch (err) {
    return;
  }
};

window.onpopstate = (e) => {
  if (e.state && e.state.url && router[e.state.url]) {
    showContentFromUrl(e.state.url);
  }
};
