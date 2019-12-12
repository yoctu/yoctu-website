var user;

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
      var d = new Date();
      d.setTime(d.getTime() + (1*24*60*60*1000));
      document.cookie = "auth0=" + JSON.stringigy(user) + ";expires=" + d.toUTCString() + ";path=/";
      document.getElementById("all").classList.remove("hide");
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
