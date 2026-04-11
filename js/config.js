(function () {
  const config = {
    SUPABASE_URL: "https://hghssblwbezmyrrfthri.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable_IL6vSMDa-G1kpWCMR0KKXA_9NtUYIMr"
  };

  window.APP_CONFIG = config;
  window.ACCOUNT_ADMIN_FUNCTION_URL = `${config.SUPABASE_URL}/functions/v1/account-admin`;

  function showStartupError(message) {
    const safeMessage = String(message || "App startup failed.");
    window.__AKY_STARTUP_ERROR__ = safeMessage;
    console.error(safeMessage);

    window.addEventListener("DOMContentLoaded", () => {
      const loginScreen = document.getElementById("loginScreen");
      const appShell = document.getElementById("appShell");
      const loginMessage = document.getElementById("loginMessage");

      if (loginScreen) loginScreen.classList.remove("hidden");
      if (appShell) appShell.classList.add("hidden");
      if (loginMessage) loginMessage.textContent = safeMessage;
    }, { once: true });
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    window.supabaseClient = null;
    showStartupError("Supabase could not load. Check your internet connection, then refresh the page.");
    return;
  }

  try {
    window.supabaseClient = window.supabase.createClient(
      config.SUPABASE_URL,
      config.SUPABASE_ANON_KEY
    );
  } catch (error) {
    window.supabaseClient = null;
    showStartupError(error?.message || "Supabase failed to start. Check your configuration, then refresh the page.");
  }
})();
