(function () {
  function showStartupError(message) {
    const safeMessage = String(message || "App startup failed.");
    window.__AKY_STARTUP_ERROR__ = safeMessage;
    console.error(safeMessage);

    window.addEventListener(
      "DOMContentLoaded",
      () => {
        const loginScreen = document.getElementById("loginScreen");
        const appShell = document.getElementById("appShell");
        const loginMessage = document.getElementById("loginMessage");

        if (loginScreen) loginScreen.classList.remove("hidden");
        if (appShell) appShell.classList.add("hidden");
        if (loginMessage) loginMessage.textContent = safeMessage;
      },
      { once: true }
    );
  }

  function failClosed(message, error) {
    const fullMessage = `[Config] ${message}`;
    window.supabaseClient = null;
    window.ACCOUNT_ADMIN_FUNCTION_URL = "";
    console.error(fullMessage, error || "");
    showStartupError(fullMessage);
    return null;
  }

  function requireNonEmptyString(name, value) {
    const text = String(value || "").trim();
    if (!text) {
      throw new Error(`Missing or invalid required config: ${name}`);
    }
    return text;
  }

  function requireUrl(name, value) {
    const text = requireNonEmptyString(name, value);

    try {
      const url = new URL(text);
      return url.toString().replace(/\/$/, "");
    } catch (_error) {
      throw new Error(`Missing or invalid required config: ${name}`);
    }
  }

  let config;

  try {
    const runtime = window.APP_CONFIG || {};

    const supabaseUrl = requireUrl("supabaseUrl", runtime.supabaseUrl);
    const supabaseAnonKey = requireNonEmptyString("supabaseAnonKey", runtime.supabaseAnonKey);
    const edgeFunctionBaseUrl = requireUrl("edgeFunctionBaseUrl", runtime.edgeFunctionBaseUrl);
    const appEnv = requireNonEmptyString("appEnv", runtime.appEnv);

    config = Object.freeze({
      SUPABASE_URL: supabaseUrl,
      SUPABASE_ANON_KEY: supabaseAnonKey,
      EDGE_FUNCTION_BASE_URL: edgeFunctionBaseUrl,
      APP_ENV: appEnv,

      supabaseUrl,
      supabaseAnonKey,
      edgeFunctionBaseUrl,
      appEnv
    });

    window.APP_CONFIG = config;
    window.ACCOUNT_ADMIN_FUNCTION_URL = `${config.EDGE_FUNCTION_BASE_URL}/account-admin`;
  } catch (error) {
    failClosed(error?.message || "Runtime configuration validation failed.", error);
    return;
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    failClosed("Supabase could not load. Check your internet connection, then refresh the page.");
    return;
  }

  try {
    window.supabaseClient = window.supabase.createClient(
      config.SUPABASE_URL,
      config.SUPABASE_ANON_KEY
    );
  } catch (error) {
    failClosed(
      error?.message || "Supabase failed to start. Check your runtime configuration, then refresh the page.",
      error
    );
  }
})();
