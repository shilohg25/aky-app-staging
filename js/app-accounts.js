(function () {
  "use strict";

  function initAppAccounts(deps) {
    const {
      supabaseClient,
      ACCOUNT_ADMIN_FUNCTION_URL,
      state,
      el,
      canManageAccounts,
      validatePassword,
      addLog,
      closeModal,
      openModal,
      escapeHtml,
      capitalizeRole,
      formatDateTime
    } = deps || {};

    // Paste these exact deleted function blocks here, unchanged, in this order:
    // 1. refreshAccounts
    // 2. loadAccounts
    // 3. getFilteredAccounts
    // 4. renderAccountsView
    // 5. openCreateAccountModal
    // 6. openEditAccountModal
    // 7. saveAccount
    // 8. openResetPasswordModal
    // 9. saveResetPassword
    // 10. deleteAccount
    // 11. callAccountAdmin

    return {
      refreshAccounts,
      loadAccounts,
      getFilteredAccounts,
      renderAccountsView,
      openCreateAccountModal,
      openEditAccountModal,
      saveAccount,
      openResetPasswordModal,
      saveResetPassword,
      deleteAccount,
      callAccountAdmin
    };
  }

  window.AKY_APP_ACCOUNTS = Object.freeze({
    initAppAccounts
  });
})();
