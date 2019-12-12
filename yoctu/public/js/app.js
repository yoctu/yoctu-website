let auth0 = null;

const login = async (targetUrl) => {
  try {
    const options = {
      redirect_uri: window.location.origin
    };
    if (targetUrl) {
      options.appState = { targetUrl };
    }
    await auth0.loginWithRedirect(options);
  } catch (err) {
    console.log("Log in failed", err);
  }
};

const logout = () => {
  try {
    auth0.logout({
      returnTo: window.location.origin
    });
  } catch (err) {
    console.log("Log out failed", err);
  }
};

const fetchAuthConfig = () => fetch("/yoctu/auth_config.json");

const configureClient = async () => {
  const response = await fetchAuthConfig();
  const config = await response.json();

  auth0 = await createAuth0Client({
    domain: config.domain,
    client_id: config.clientId
  });
};

const requireAuth = async (fn, targetUrl) => {
  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    return fn();
  }

  return login(targetUrl);
};

window.onload = async () => {
  await configureClient();
  if (!showContentFromUrl(window.location.pathname)) {
    showContentFromUrl("/");
    window.history.replaceState({ url: "/" }, {}, "/");
  }

  const isAuthenticated = await auth0.isAuthenticated();

  if (isAuthenticated) {
    window.history.replaceState({}, document.title, window.location.pathname);
    updateUI();
    return;
  }

  const query = window.location.search;
  const shouldParseResult = query.includes("code=") && query.includes("state=");

  if (shouldParseResult) {
    try {
      const result = await auth0.handleRedirectCallback();
      if (result.appState && result.appState.targetUrl) {
        showContentFromUrl(result.appState.targetUrl);
      }
    } catch (err) {
      console.log("Error parsing redirect:", err);
    }
    window.history.replaceState({}, document.title, "/");
  }
  updateUI();
};
