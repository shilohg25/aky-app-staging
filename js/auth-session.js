(function () {
  "use strict";

  let manager = null;

  function initAuthSession(deps) {
    if (manager && manager.api) {
      return manager.api;
    }

    deps = deps || {};

    const supabaseClient = deps.supabaseClient;
    if (
      !supabaseClient ||
      !supabaseClient.auth ||
      typeof supabaseClient.auth.onAuthStateChange !== "function"
    ) {
      console.error("[AKY] Auth session module could not initialize because Supabase auth is unavailable.");
      return null;
    }

    let subscription = null;
    let refreshPromise = null;
    let suppressNextSignedOutEvent = false;

    function clearAuthState() {
      if (typeof deps.clearAuthState === "function") {
        deps.clearAuthState();
      }
    }

    function redirectToLogin(message) {
      if (typeof deps.redirectToLogin === "function") {
        deps.redirectToLogin(message || "");
      }
    }

    function handleSessionLoss(options) {
      const settings = options || {};
      clearAuthState();
      redirectToLogin(settings.message || "");
    }

    async function forceSignOut(message) {
      suppressNextSignedOutEvent = true;

      try {
        await supabaseClient.auth.signOut();
      } catch (error) {
        console.warn("[AKY] Supabase signOut failed during centralized auth cleanup.", error);
      } finally {
        handleSessionLoss({ message: message || "" });

        setTimeout(() => {
          suppressNextSignedOutEvent = false;
        }, 0);
      }
    }

    async function refreshProfileFromSession(eventName, session) {
      if (!session?.user?.id) {
        handleSessionLoss();
        return null;
      }

      if (
        typeof deps.shouldRefreshProfile === "function" &&
        deps.shouldRefreshProfile(eventName, session) === false
      ) {
        return null;
      }

      if (refreshPromise) {
        return refreshPromise;
      }

      refreshPromise = (async () => {
        try {
          if (typeof deps.getProfile !== "function") {
            return null;
          }

          const profile = await deps.getProfile(session.user.id);

          if (!profile) {
            await forceSignOut("Profile not found for this account.");
            return null;
          }

          if (typeof deps.applyAuthenticatedProfile === "function") {
            deps.applyAuthenticatedProfile(profile, {
              source: "auth-state-change",
              eventName,
              openChangePassword: true
            });
          }

          return profile;
        } finally {
          refreshPromise = null;
        }
      })();

      return refreshPromise;
    }

    const authStateResult = supabaseClient.auth.onAuthStateChange((eventName, session) => {
      if (eventName === "INITIAL_SESSION") {
        return;
      }

      if (!session || eventName === "SIGNED_OUT") {
        if (eventName === "SIGNED_OUT" && suppressNextSignedOutEvent) {
          return;
        }

        handleSessionLoss();
        return;
      }

      if (
        eventName === "SIGNED_IN" ||
        eventName === "TOKEN_REFRESHED" ||
        eventName === "USER_UPDATED"
      ) {
        void refreshProfileFromSession(eventName, session);
      }
    });

    subscription = authStateResult?.data?.subscription || null;

    manager = {
      api: Object.freeze({
        handleSessionLoss,
        signOut: forceSignOut,
        refreshProfileFromSession,
        dispose() {
          if (subscription && typeof subscription.unsubscribe === "function") {
            subscription.unsubscribe();
          }

          subscription = null;
          refreshPromise = null;
          manager = null;
        }
      })
    };

    return manager.api;
  }

  window.AKY_AUTH_SESSION = Object.freeze({
    initAuthSession
  });
})();
