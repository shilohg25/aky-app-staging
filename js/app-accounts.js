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

        let accountTableEventsBound = false;

    const ACCOUNT_ADMIN_ACTION_ALIASES = Object.freeze({
      listAccounts: ["list_accounts", "listaccounts"],
      createAccount: ["create_account", "createaccount"],
      updateAccount: ["update_account", "updateaccount"],
      resetPassword: ["reset_password", "resetpassword"],
      deleteAccount: ["delete_account", "deleteaccount"]
    });

    function toSnakeCase(value) {
      return String(value || "")
        .trim()
        .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
        .replace(/[\s-]+/g, "_")
        .toLowerCase();
    }

    function getAccountAdminActionCandidates(action) {
      const normalizedAction = String(action || "").trim();
      if (!normalizedAction) return [];

      const candidates = [
        normalizedAction,
        ...(ACCOUNT_ADMIN_ACTION_ALIASES[normalizedAction] || []),
        toSnakeCase(normalizedAction)
      ];

      return [...new Set(candidates.filter(Boolean))];
    }

    function isUnsupportedAccountAdminAction(body, response) {
      const message = String(body?.error || body?.message || "").toLowerCase();
      return response?.status === 400 && message.includes("unsupported action");
    }

    function ensureAccountsAccess() {
      if (typeof canManageAccounts !== "function" || !canManageAccounts()) {
        throw new Error("You do not have permission to manage accounts.");
      }
    }

    function getAccountById(accountId) {
      return state.accounts.find((account) => account.id === accountId) || null;
    }

    function getAccountStatus(account) {
      if (!account) return "-";
      if (account.deleted_at) return "Deleted";
      if (account.disabled_at) return "Disabled";
      if (account.is_active === false) return "Inactive";
      return "Active";
    }

    function resetAccountModalState() {
      state.editingAccountId = null;

      if (el.accountModalTitle) el.accountModalTitle.textContent = "Create Account";
      if (el.accountNameInput) el.accountNameInput.value = "";
      if (el.accountEmailInput) el.accountEmailInput.value = "";
      if (el.accountRoleInput) el.accountRoleInput.value = "user";
      if (el.accountPasswordInput) el.accountPasswordInput.value = "";
      if (el.accountMustChangePasswordInput) el.accountMustChangePasswordInput.checked = true;
      if (el.accountPasswordWrap) el.accountPasswordWrap.classList.remove("hidden");

      if (el.accountModalHelpBox) {
        el.accountModalHelpBox.textContent =
          "Owner creates the account and assigns the temporary password. The user changes it after first login.";
      }
    }

    function bindAccountTableEvents() {
      if (accountTableEventsBound || !el.accountsTableBody) return;

      el.accountsTableBody.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-account-action]");
        if (!button) return;

        const accountId = button.dataset.accountId || "";
        const action = button.dataset.accountAction || "";

        if (!accountId || !action) return;

        if (action === "edit") {
          openEditAccountModal(accountId);
          return;
        }

        if (action === "reset") {
          openResetPasswordModal(accountId);
          return;
        }

        if (action === "delete") {
          void deleteAccount(accountId);
        }
      });

      accountTableEventsBound = true;
    }

    async function refreshAccounts() {
  try {
    await loadAccounts();
    renderAccountsView();
  } catch (error) {
    state.accountsLoadError = String(
      error?.message || "Could not refresh accounts."
    );
    renderAccountsView();
    console.error("[AKY] Failed to refresh accounts.", error);
    alert(state.accountsLoadError);
  }
}

        function normalizeAccountsResponse(responseBody) {
      const possibleLists = [
        responseBody,
        responseBody?.accounts,
        responseBody?.data,
        responseBody?.profiles,
        responseBody?.items
      ];

      const rawAccounts = possibleLists.find(Array.isArray);

      if (!rawAccounts) {
        throw new Error("Account admin returned an invalid account list response.");
      }

      return rawAccounts.map((account) => ({
        ...account,
        email: account?.email ? String(account.email).trim().toLowerCase() : "",
        username: account?.username ? String(account.username).trim() : "",
        role: account?.role ? String(account.role).trim().toLowerCase() : "user"
      }));
    }

    async function loadAccounts() {
  ensureAccountsAccess();
  state.accountsLoadError = "";

  let responseBody;

  try {
    responseBody = await callAccountAdmin("listAccounts", {});
  } catch (error) {
    console.error("[AKY] Failed to load accounts via account-admin.", error);
    throw new Error(
      error?.message ||
        "Could not load accounts from the admin endpoint."
    );
  }

  const accounts = normalizeAccountsResponse(responseBody);

  state.accounts = accounts.sort((left, right) => {
    const leftCreated = left?.created_at ? new Date(left.created_at).getTime() : 0;
    const rightCreated = right?.created_at ? new Date(right.created_at).getTime() : 0;
    return rightCreated - leftCreated;
  });

  state.accountsLoadError = "";
  return state.accounts;
}

    function getFilteredAccounts() {
      const query = String(el.accountSearch?.value || "").trim().toLowerCase();
      const roleFilter = String(el.accountRoleFilter?.value || "").trim().toLowerCase();

      return state.accounts
        .filter((account) => {
          const matchesQuery =
            !query ||
            [account.username, account.email, account.role]
              .map((value) => String(value || "").toLowerCase())
              .some((value) => value.includes(query));

          const matchesRole =
            !roleFilter || String(account.role || "").toLowerCase() === roleFilter;

          return matchesQuery && matchesRole;
        })
        .sort((left, right) => {
          const leftCreated = left?.created_at ? new Date(left.created_at).getTime() : 0;
          const rightCreated = right?.created_at ? new Date(right.created_at).getTime() : 0;
          return rightCreated - leftCreated;
        });
    }

    function renderAccountsView() {
  if (!el.accountsTableBody) return;

  bindAccountTableEvents();
  el.accountsTableBody.innerHTML = "";

  if (state.accountsLoadError) {
    el.accountsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="muted">${escapeHtml(state.accountsLoadError)}</td>
      </tr>
    `;
    return;
  }

  const accounts = getFilteredAccounts();

  if (!accounts.length) {
    el.accountsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="muted">No accounts found.</td>
      </tr>
    `;
    return;
  }

  const rowsHtml = accounts
    .map((account) => {
      const isCurrentUser = account.id === state.currentProfile?.id;
      const accountName = account.username || account.email || "-";
      const createdAt = account.created_at ? formatDateTime(account.created_at) : "-";
      const mustChangePassword = account.must_change_password ? "Yes" : "No";
      const deleteDisabledAttr = isCurrentUser
        ? 'disabled title="You cannot delete your own account while logged in."'
        : "";

      return `
        <tr>
          <td>${escapeHtml(accountName)}</td>
          <td>${escapeHtml(account.email || "-")}</td>
          <td>${escapeHtml(capitalizeRole(account.role || "user"))}</td>
          <td>${escapeHtml(mustChangePassword)}</td>
          <td>${escapeHtml(getAccountStatus(account))}</td>
          <td>${escapeHtml(createdAt)}</td>
          <td>
            <div class="btn-row">
              <button class="btn btn-light" type="button" data-account-action="edit" data-account-id="${escapeHtml(account.id)}">Edit</button>
              <button class="btn btn-secondary" type="button" data-account-action="reset" data-account-id="${escapeHtml(account.id)}">Reset Password</button>
              <button class="btn btn-danger" type="button" data-account-action="delete" data-account-id="${escapeHtml(account.id)}" ${deleteDisabledAttr}>Delete</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  el.accountsTableBody.innerHTML = rowsHtml;
}

    function openCreateAccountModal() {
      try {
        ensureAccountsAccess();
        resetAccountModalState();
        openModal(el.accountModal);
      } catch (error) {
        console.error("[AKY] Failed to open create account modal.", error);
        alert(error?.message || "Could not open account form.");
      }
    }

    function openEditAccountModal(accountId) {
      try {
        ensureAccountsAccess();

        const account = getAccountById(accountId);
        if (!account) {
          alert("Account not found.");
          return;
        }

        state.editingAccountId = account.id;

        if (el.accountModalTitle) el.accountModalTitle.textContent = "Edit Account";
        if (el.accountNameInput) el.accountNameInput.value = account.username || "";
        if (el.accountEmailInput) el.accountEmailInput.value = account.email || "";
        if (el.accountRoleInput) el.accountRoleInput.value = account.role || "user";
        if (el.accountPasswordInput) el.accountPasswordInput.value = "";
        if (el.accountMustChangePasswordInput) {
          el.accountMustChangePasswordInput.checked = !!account.must_change_password;
        }
        if (el.accountPasswordWrap) el.accountPasswordWrap.classList.add("hidden");

        if (el.accountModalHelpBox) {
          el.accountModalHelpBox.textContent =
            "Update profile fields here. Use Reset Password to set a new temporary password.";
        }

        openModal(el.accountModal);
      } catch (error) {
        console.error("[AKY] Failed to open edit account modal.", error);
        alert(error?.message || "Could not open account form.");
      }
    }

    async function saveAccount() {
      try {
        ensureAccountsAccess();

        const username = String(el.accountNameInput?.value || "").trim();
        const email = String(el.accountEmailInput?.value || "").trim().toLowerCase();
        const role = String(el.accountRoleInput?.value || "user").trim();
        const mustChangePassword = !!el.accountMustChangePasswordInput?.checked;
        const editingAccountId = state.editingAccountId;

        if (!username) return alert("Full Name / Username is required.");
        if (!email) return alert("Email is required.");
        if (!role) return alert("Role is required.");

        if (editingAccountId) {
          const existingAccount = getAccountById(editingAccountId);
          if (!existingAccount) return alert("Account not found.");

          await callAccountAdmin("updateAccount", {
            id: editingAccountId,
            username,
            email,
            role,
            must_change_password: mustChangePassword
          });

          await addLog(
            "UPDATE",
            "ACCOUNT",
            `Updated account ${email}`,
            "",
            {
              username: existingAccount.username || null,
              email: existingAccount.email || null,
              role: existingAccount.role || null,
              must_change_password: !!existingAccount.must_change_password
            },
            {
              username,
              email,
              role,
              must_change_password: mustChangePassword
            }
          );
        } else {
          const password = String(el.accountPasswordInput?.value || "");
          const validationError = validatePassword(password);

          if (validationError) return alert(validationError);

          await callAccountAdmin("createAccount", {
            username,
            email,
            role,
            password,
            must_change_password: mustChangePassword
          });

          await addLog(
            "CREATE",
            "ACCOUNT",
            `Created account ${email}`,
            "",
            null,
            {
              username,
              email,
              role,
              must_change_password: mustChangePassword
            }
          );
        }

        await refreshAccounts();
        closeModal(el.accountModal);
        resetAccountModalState();
        alert(editingAccountId ? "Account updated successfully." : "Account created successfully.");
      } catch (error) {
        console.error("[AKY] Failed to save account.", error);
        alert(error?.message || "Could not save account.");
      }
    }

    function openResetPasswordModal(accountId) {
      try {
        ensureAccountsAccess();

        const account = getAccountById(accountId);
        if (!account) {
          alert("Account not found.");
          return;
        }

        state.selectedAccountForReset = account.id;

        if (el.resetPasswordInput) el.resetPasswordInput.value = "";
        if (el.resetMustChangePasswordInput) el.resetMustChangePasswordInput.checked = true;

        if (el.resetPasswordInfo) {
          const accountName = account.username || account.email || "User";
          el.resetPasswordInfo.textContent = `Reset password for ${accountName} (${account.email || "no email"}).`;
        }

        openModal(el.resetPasswordModal);
      } catch (error) {
        console.error("[AKY] Failed to open reset password modal.", error);
        alert(error?.message || "Could not open reset password form.");
      }
    }

    async function saveResetPassword() {
      try {
        ensureAccountsAccess();

        const accountId = state.selectedAccountForReset;
        const account = getAccountById(accountId);

        if (!accountId || !account) return alert("Select an account first.");

        const password = String(el.resetPasswordInput?.value || "");
        const validationError = validatePassword(password);

        if (validationError) return alert(validationError);

        const mustChangePassword = !!el.resetMustChangePasswordInput?.checked;

        await callAccountAdmin("resetPassword", {
          id: accountId,
          password,
          must_change_password: mustChangePassword
        });

        await addLog(
          "RESET_PASSWORD",
          "ACCOUNT",
          `Reset password for ${account.email || account.username || accountId}`,
          "",
          {
            must_change_password: !!account.must_change_password
          },
          {
            must_change_password: mustChangePassword
          }
        );

        await refreshAccounts();
        closeModal(el.resetPasswordModal);
        state.selectedAccountForReset = null;
        alert("Password reset successfully.");
      } catch (error) {
        console.error("[AKY] Failed to reset password.", error);
        alert(error?.message || "Could not reset password.");
      }
    }

    async function deleteAccount(accountId) {
      try {
        ensureAccountsAccess();

        const account = getAccountById(accountId);
        if (!account) {
          alert("Account not found.");
          return;
        }

        if (account.id === state.currentProfile?.id) {
          alert("You cannot delete your own account while logged in.");
          return;
        }

        const confirmed = window.confirm(
          `Delete account for ${account.email || account.username || "this user"}? This cannot be undone.`
        );

        if (!confirmed) return;

        await callAccountAdmin("deleteAccount", {
          id: account.id
        });

        await addLog(
          "DELETE",
          "ACCOUNT",
          `Deleted account ${account.email || account.username || account.id}`,
          "",
          {
            username: account.username || null,
            email: account.email || null,
            role: account.role || null,
            must_change_password: !!account.must_change_password
          },
          null
        );

        await refreshAccounts();
        alert("Account deleted successfully.");
      } catch (error) {
        console.error("[AKY] Failed to delete account.", error);
        alert(error?.message || "Could not delete account.");
      }
    }

            async function callAccountAdmin(action, payload = {}) {
      ensureAccountsAccess();

      if (!ACCOUNT_ADMIN_FUNCTION_URL) {
        throw new Error("Account admin endpoint is not configured.");
      }

      const requestedAction = String(action || "").trim();
      if (!requestedAction) {
        throw new Error("Account admin action is required.");
      }

      const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
      if (sessionError) {
        console.error("[AKY] Failed to get auth session for account admin call.", sessionError);
        throw new Error(sessionError.message || "Could not verify your session.");
      }

      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) {
        throw new Error("Your login session has expired. Please sign in again.");
      }

      const actionCandidates = getAccountAdminActionCandidates(requestedAction);
      let lastFailure = null;

      for (const candidateAction of actionCandidates) {
        const endpointUrl = new URL(ACCOUNT_ADMIN_FUNCTION_URL);
        endpointUrl.searchParams.set("action", candidateAction);

        const requestPayload =
          payload && typeof payload === "object" && !Array.isArray(payload)
            ? { action: candidateAction, ...payload }
            : { action: candidateAction };

        const response = await fetch(endpointUrl.toString(), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(requestPayload)
        });

        let body = null;
        try {
          body = await response.json();
        } catch (_error) {
          body = null;
        }

        if (response.ok) {
          if (body?.error) {
            throw new Error(body.error);
          }

          return body;
        }

        const message =
          body?.error ||
          body?.message ||
          `Account admin request failed (${response.status}).`;

        lastFailure = {
          action: candidateAction,
          message,
          endpoint: endpointUrl.toString(),
          responseStatus: response.status,
          body
        };

        if (isUnsupportedAccountAdminAction(body, response)) {
          continue;
        }

        console.error("[AKY] Account admin request failed.", {
          requestedAction,
          attemptedAction: candidateAction,
          payload,
          endpoint: endpointUrl.toString(),
          responseStatus: response.status,
          body
        });

        throw new Error(message);
      }

      console.error("[AKY] Account admin request failed.", {
        requestedAction,
        attemptedActions: actionCandidates,
        payload,
        lastFailure
      });

      throw new Error(
        lastFailure?.message ||
          `Unsupported account admin action: ${requestedAction}`
      );
    }

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
