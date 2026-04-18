(function () {
  "use strict";
  const {
  supabaseClient,
  ACCOUNT_ADMIN_FUNCTION_URL,
  ROLE_PERMISSIONS,
  state,
  AKY_DOCUMENT_UTILS,
  AKY_DOM_ELEMENTS,
  AKY_AI_DOCUMENT_ASSIST,
  AKY_CUSTOMER_DOCUMENT_VAULT,
  AKY_STATE_INDEXES
} = window;

  const el = AKY_DOM_ELEMENTS.mapElements();

  function createNoopModuleFunction(moduleName, functionName) {
    return function missingModuleFunction() {
      console.error(`[AKY] ${moduleName}.${functionName} is unavailable in this build.`);
      return undefined;
    };
  }

  function initOptionalModule(moduleName, initFn, depsFactory, functionNames) {
    const fallback = {};

    for (const functionName of functionNames) {
      fallback[functionName] = createNoopModuleFunction(moduleName, functionName);
    }

    if (typeof initFn !== "function") {
      console.error(`[AKY] ${moduleName}.init is missing.`);
      return fallback;
    }

    try {
      const result = initFn(depsFactory()) || {};
      return Object.fromEntries(
        functionNames.map((functionName) => [
          functionName,
          typeof result[functionName] === "function" ? result[functionName] : fallback[functionName]
        ])
      );
    } catch (error) {
      console.error(`[AKY] ${moduleName}.init failed.`, error);
      return fallback;
    }
  }

  function bindCoreEvents() {
    const submitLogin = (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      login();
    };

    el.loginBtn?.addEventListener("click", login);
    el.loginUsername?.addEventListener("keydown", submitLogin);
    el.loginPassword?.addEventListener("keydown", submitLogin);
    el.logoutBtn?.addEventListener("click", logout);
    el.openChangePasswordBtn?.addEventListener("click", () => openChangePasswordModal(false));
    el.saveOwnPasswordBtn?.addEventListener("click", () => runWithBusyState(el.saveOwnPasswordBtn, "Saving...", saveOwnPassword));
    el.closeChangePasswordModalBtn?.addEventListener("click", () => {
      if (el.changePasswordModal?.dataset.force === "1") return;
      closeModal(el.changePasswordModal);
    });
  }

  const {
    populateReportCustomerFilter,
    getReportRows,
    renderReportsView,
    clearReportFilters,
    renderPaymentReceivedReportView,
    clearPaymentReportFilters,
    downloadPaymentReportCsv,
    printPaymentReceivedReport,
    downloadTbvReportCsv,
    printTbvReport,
    downloadReportCsv,
    printReport
  } = initOptionalModule(
    "AKY_APP_REPORTS",
    window.AKY_APP_REPORTS?.initAppReports,
    () => ({
      state,
      el,
      buildCustomerFilterOptionsHtml,
      getActiveInvoices,
      isOperationallyCollectedPayment,
      getPaymentCollectionReceipt,
      statusPill,
      openReportInvoiceDetails,
      openReportPaymentDetails,
      getChequeStatus,
      formatDateTime,
      getPaymentDetailsObject,
      getInvoiceReferenceLabel,
      getAllocationAmount,
      getPaymentTypeLabel,
      formatPeso,
      csvSafe,
      downloadTextFile,
      todayStr,
      openPrintWindow,
      getFilteredTbvRows,
      escapeHtml
    }),
    [
      "populateReportCustomerFilter",
      "getReportRows",
      "renderReportsView",
      "clearReportFilters",
      "renderPaymentReceivedReportView",
      "clearPaymentReportFilters",
      "downloadPaymentReportCsv",
      "printPaymentReceivedReport",
      "downloadTbvReportCsv",
      "printTbvReport",
      "downloadReportCsv",
      "printReport"
    ]
  );

  const {
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
  } = initOptionalModule(
    "AKY_APP_ACCOUNTS",
    window.AKY_APP_ACCOUNTS?.initAppAccounts,
    () => ({
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
    }),
    [
      "refreshAccounts",
      "loadAccounts",
      "getFilteredAccounts",
      "renderAccountsView",
      "openCreateAccountModal",
      "openEditAccountModal",
      "saveAccount",
      "openResetPasswordModal",
      "saveResetPassword",
      "deleteAccount",
      "callAccountAdmin"
    ]
  );

  const {
    viewInvoice,
    viewPayment
  } = initOptionalModule(
    "AKY_APP_DETAIL_VIEWERS",
    window.AKY_APP_DETAIL_VIEWERS?.initAppDetailViewers,
    () => ({
      supabaseClient,
      state,
      el,
      getSelectedCustomer,
      canEditInvoiceRecord,
      canRequestTbv,
      openInvoiceModalForEdit,
      openTbvModal,
      openModal,
      closeModal,
      getPaymentDetailsObject,
      getChequeStatus,
      getInvoiceReferenceLabel,
      getPaymentTypeLabel,
      getPaymentCollectionReceipt,
      getAllocationAmount,
      formatPeso,
      formatNumber,
      formatDateTime,
      escapeHtml
    }),
    ["viewInvoice", "viewPayment"]
  );

  let bindEvents = bindCoreEvents;

  try {
    const eventApi = window.AKY_APP_EVENTS?.initAppEvents?.({
      el,
      login,
      openChangePasswordModal,
      runWithBusyState,
      saveOwnPassword,
      closeModal,
      logout,
      setView,
      openAddCustomerModal,
      renderCustomerList,
      renderCustomerDiscountFields,
      addContactRow,
      saveCustomer,
      openInvoiceModalForCreate,
      renderInvoiceDiscountControls,
      updateInvoiceTotal,
      addLineItemRow,
      saveInvoice,
      openPaymentTypeModal,
      openPayByInvoiceStep,
      openPartialPaymentStep,
      proceedSelectedInvoices,
      renderPartialBalanceInfo,
      proceedPartialPayment,
      renderPaymentMethodFields,
      renderPaymentReviewBox,
      renderWithholdingTaxUi,
      savePayment,
      renderExecutiveView,
      renderReportsView,
      clearReportFilters,
      downloadReportCsv,
      printReport,
      renderPaymentReceivedReportView,
      clearPaymentReportFilters,
      downloadPaymentReportCsv,
      printPaymentReceivedReport,
      renderTbvRequestsTable,
      downloadTbvReportCsv,
      printTbvReport,
      saveTbvRequest,
      decideTbv,
      openSoaModal,
      renderSoaPaymentRangeVisibility,
      autofillSoaPaymentRange,
      generateSoa,
      openEditCustomerModal,
      deleteSelectedCustomer,
      renderAccountsView,
      refreshAccounts,
      openCreateAccountModal,
      saveAccount,
      saveResetPassword,
      toggleLogSort
    });

    if (typeof eventApi?.bindEvents === "function") {
      bindEvents = eventApi.bindEvents;
    } else {
      console.error("[AKY] AKY_APP_EVENTS.bindEvents is unavailable in this build. Falling back to core auth bindings.");
    }
  } catch (error) {
    console.error("[AKY] AKY_APP_EVENTS.initAppEvents failed. Falling back to core auth bindings.", error);
  }

  window.addEventListener("load", () => {
    bindEvents();
    bootstrap();
  });

    async function bootstrap() {
    if (!ensureSupabaseClientReady()) return;

    try {
      const { data, error } = await supabaseClient.auth.getSession();
      if (error || !data.session?.user) {
        showLogin();
        return;
      }

            const profile = await getProfile(data.session.user.id);
      if (!profile) {
        await supabaseClient.auth.signOut();
        state.currentProfile = null;
        showLogin();
        el.loginMessage.textContent = "Profile not found for this account.";
        return;
      }

      state.currentProfile = profile;
      await showApp();

      if (profile.must_change_password) {
        openChangePasswordModal(true);
      }
    } catch (error) {
      console.error(error);
      showLogin();
      el.loginMessage.textContent = error?.message || getStartupErrorMessage();
    }
  }

  async function getProfile(userId) {
    const { data, error } = await supabaseClient.from("profiles").select("*").eq("id", userId).single();
    if (error) return null;
    return data;
  }

  function showLogin() {
    el.loginScreen.classList.remove("hidden");
    el.appShell.classList.add("hidden");
  }

    function renderLazyView(view) {
    if (view === "executive" && canViewExecutive()) {
      renderExecutiveView();
      return;
    }

    if (view === "notifications" && canViewNotifications()) {
      renderNotificationsView();
      return;
    }

    if (view === "cheque-register") {
      renderChequeRegisterView();
      return;
    }

    if (view === "reports") {
      renderReportsView();
      return;
    }

    if (view === "logs" && canViewLogs()) {
      renderLogs();
      return;
    }

        if (view === "accounts" && canManageAccounts()) {
      renderAccountsView();
      if (!state.accounts.length) {
        void refreshAccounts();
      }
    }
  }

    async function showApp() {
    el.loginScreen.classList.add("hidden");
    el.appShell.classList.remove("hidden");
    renderCurrentUser();
    await loadAllData();

    renderCustomerList();
    renderCurrentCustomerDashboard();
    setView(state.currentView);
  }

  function getCurrentUser() {
    return state.currentProfile;
  }

    function getCurrentRole() {
    return state.currentProfile?.role || "user";
  }

  function getRoleConfig() {
    const role = getCurrentRole();
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.user;
  }

  function hasRole(...allowedRoles) {
    return allowedRoles.includes(getCurrentRole());
  }

  function canCreateCustomer() { return getRoleConfig().createCustomer; }
  function canEditCustomer() { return getRoleConfig().editCustomer; }
  function canDeleteCustomer() { return getRoleConfig().deleteCustomer; }
  function canCreateInvoice() { return getRoleConfig().createInvoice; }
  function canEditInvoice() { return getRoleConfig().editInvoice; }
  function canCreatePayment() { return getRoleConfig().createPayment; }
  function canViewExecutive() { return getRoleConfig().viewExecutive; }
  function canViewNotifications() { return getRoleConfig().viewNotifications; }
  function canViewLogs() { return getRoleConfig().viewLogs; }
  function canRequestTbv() { return getRoleConfig().requestTbv; }
  function canApproveTbv() { return getRoleConfig().approveTbv; }
    function canGenerateSoa() { return getRoleConfig().generateSoa; }
  function canManageAccounts() { return getRoleConfig().manageAccounts; }
  function canViewChequeRegister() { return getRoleConfig().viewChequeRegister !== false; }
  function canClearCheque() { return !!getRoleConfig().clearCheque; }
  function canBounceCheque() { return !!getRoleConfig().bounceCheque; }
  function canReplaceBouncedCheque() { return !!getRoleConfig().replaceBouncedCheque; }
  function canAuthorizeCustomerDiscount() { return hasRole("owner"); }
  function canUseAiAssist() { return hasRole("owner"); }
  function canUploadCustomerDocuments() { return !hasRole("co-owner"); }
  function canDeleteCustomerDocuments() { return hasRole("owner", "admin"); }

  function isDiscountAuthorizedCustomer(customer) {
    return !!customer?.discount_authorized;
  }

  function renderCustomerDiscountFields() {
    const ownerCanConfigure = canAuthorizeCustomerDiscount();
    const isEnabled = ownerCanConfigure && !!el.customerDiscountAuthorizedInput?.checked;

    el.customerDiscountSettingsWrap?.classList.toggle("hidden", !ownerCanConfigure);
    el.customerDiscountConfigFields?.classList.toggle("hidden", !isEnabled);

    if (!isEnabled) {
      if (el.customerDiscountMaxAmountInput) el.customerDiscountMaxAmountInput.value = "";
      if (el.customerDiscountNoteInput) el.customerDiscountNoteInput.value = "";
    }
  }
    function editNoteRequired() { return getRoleConfig().noteRequiredOnEdit; }

  function getStartupErrorMessage() {
    return window.__AKY_STARTUP_ERROR__ || "Could not connect to the server. Check your internet connection, then refresh the page.";
  }

  function ensureSupabaseClientReady() {
    if (supabaseClient) return true;

    showLogin();
    if (el.loginMessage) {
      el.loginMessage.textContent = getStartupErrorMessage();
    }
    return false;
  }
    function canEditInvoiceRecord(invoice) {
    if (!invoice) return false;
    if (!canEditInvoice()) return false;

    const role = state.currentProfile?.role || "";
    const paidAmount = Number(invoice.paidAmount || invoice.paid_amount || 0);

    if (role === "admin" && paidAmount > 0) return false;
    return true;
  }
  function isVoidedInvoice(invoice) {
    return !!invoice?.is_voided;
  }

  function getActiveInvoices() {
    return state.invoices.filter((invoice) => !isVoidedInvoice(invoice));
  }

  function getInvoiceReferenceLabel(invoice) {
    if (!invoice) return "Deleted Invoice";
    if (isVoidedInvoice(invoice)) {
      return invoice.invoice_number ? `Voided Invoice #${invoice.invoice_number}` : "Voided Invoice";
    }
    return invoice.invoice_number || "Invoice";
  }
    async function login() {
    if (!ensureSupabaseClientReady()) return;
    if (el.loginBtn.dataset.busy === "1") return;

    const email = el.loginUsername.value.trim();
    const password = el.loginPassword.value;

    if (!email || !password) {
      el.loginMessage.textContent = "Please enter your email and password.";
      return;
    }

    el.loginBtn.dataset.busy = "1";
    el.loginBtn.disabled = true;
    const originalLoginText = el.loginBtn.textContent || "Login";
    el.loginBtn.textContent = "Logging in...";
    el.loginMessage.textContent = "";

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        el.loginMessage.textContent = error.message;
        return;
      }

            const profile = await getProfile(data.user.id);
      if (!profile) {
        await supabaseClient.auth.signOut();
        state.currentProfile = null;
        showLogin();
        el.loginMessage.textContent = "Profile not found for this account.";
        return;
      }

      state.currentProfile = profile;
      el.loginPassword.value = "";
      await showApp();

      if (profile.must_change_password) {
        openChangePasswordModal(true);
      }
        } catch (error) {
      console.error(error);
      showLogin();
      el.loginMessage.textContent = error?.message || getStartupErrorMessage();
    } finally {
      el.loginBtn.dataset.busy = "0";
      el.loginBtn.disabled = false;
      el.loginBtn.textContent = originalLoginText;
    }
  }

  async function logout() {
    await supabaseClient.auth.signOut();
    state.currentProfile = null;
    state.selectedCustomerId = null;
    showLogin();
  }

  function openChangePasswordModal(force) {
  el.changePasswordTitle.textContent = force ? "Change Temporary Password" : "Change Password";
  el.newOwnPassword.value = "";
  el.confirmOwnPassword.value = "";
  el.changePasswordModal.dataset.force = force ? "1" : "0";
  openModal(el.changePasswordModal);
}

  function validatePassword(password) {
    if (password.length < 10) return "Password must be at least 10 characters.";
    if (!/[A-Z]/.test(password)) return "Password needs at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password needs at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password needs at least one number.";
    if (!/[^A-Za-z0-9]/.test(password)) return "Password needs at least one special character.";
    return "";
  }

  async function saveOwnPassword() {
  const password = el.newOwnPassword.value;
  const confirm = el.confirmOwnPassword.value;
  const validationError = validatePassword(password);

  if (validationError) return alert(validationError);
  if (password !== confirm) return alert("Passwords do not match.");

  const { data: sessionData, error: sessionError } = await supabaseClient.auth.getSession();
  if (sessionError) return alert(sessionError.message);

  let activeSession = sessionData.session || null;

  if (!activeSession) {
    const { data: refreshData, error: refreshError } = await supabaseClient.auth.refreshSession();

    if (refreshError) {
      console.error(refreshError);
    }

    activeSession = refreshData?.session || null;
  }

  if (!activeSession) {
    await supabaseClient.auth.signOut();
    state.currentProfile = null;
    state.selectedCustomerId = null;
    el.changePasswordModal.dataset.force = "0";
    closeModal(el.changePasswordModal);
    showLogin();
    el.loginMessage.textContent = "Your login session is missing. Please log in again using the temporary password, then change it immediately.";
    return;
  }

  const { error: authError } = await supabaseClient.auth.updateUser({ password });
  if (authError) return alert(authError.message);

  const { error: profileError } = await supabaseClient
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", state.currentProfile.id);

  if (profileError) return alert(profileError.message);

  state.currentProfile.must_change_password = false;
  el.changePasswordModal.dataset.force = "0";
  closeModal(el.changePasswordModal);
  renderCurrentUser();
  alert("Password changed successfully.");
}

    async function loadAllData() {
    if (!ensureSupabaseClientReady()) {
      throw new Error(getStartupErrorMessage());
    }

    try {
      const [customersRes, contactsRes, invoicesRes, invoiceItemsRes, paymentsRes, allocationsRes, logsRes, tbvsRes] = await Promise.all([
        supabaseClient.from("customers").select("*").order("name", { ascending: true }),
        supabaseClient.from("customer_contacts").select("*").order("created_at", { ascending: true }),
        supabaseClient.from("invoices").select("*").order("invoice_date", { ascending: false }),
        supabaseClient.from("invoice_items").select("*").order("created_at", { ascending: true }),
        supabaseClient.from("payments").select("*").order("payment_date", { ascending: false }),
        supabaseClient.from("payment_allocations").select("*"),
        supabaseClient.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(500),
        supabaseClient.from("invoice_void_requests").select("*").order("created_at", { ascending: false })
      ]);

      if (customersRes.error) throw new Error(customersRes.error.message);
      if (contactsRes.error) throw new Error(contactsRes.error.message);
      if (invoicesRes.error) throw new Error(invoicesRes.error.message);
      if (invoiceItemsRes.error) throw new Error(invoiceItemsRes.error.message);
      if (paymentsRes.error) throw new Error(paymentsRes.error.message);
      if (allocationsRes.error) throw new Error(allocationsRes.error.message);
      if (logsRes.error) throw new Error(logsRes.error.message);
      if (tbvsRes.error) throw new Error(tbvsRes.error.message);

      state.customers = customersRes.data || [];
      state.contacts = contactsRes.data || [];
      state.invoices = invoicesRes.data || [];
      state.invoiceItems = invoiceItemsRes.data || [];
      state.payments = paymentsRes.data || [];
      state.allocations = allocationsRes.data || [];
      state.logs = logsRes.data || [];
      state.tbvs = tbvsRes.data || [];

      hydrateData();
      populateReportCustomerFilter();
    } catch (error) {
      console.error(error);
      throw new Error(error?.message || "Could not load data from the server.");
    }
  }

    function hydrateData() {
    const customerMap = new Map(
      state.customers.map((customer) => [
        customer.id,
        { ...customer, contacts: [], invoices: [], payments: [] }
      ])
    );

    state.contacts.forEach((contact) => {
      const customer = customerMap.get(contact.customer_id);
      if (customer) customer.contacts.push(contact);
    });

    const invoiceItemMap = new Map();
    state.invoiceItems.forEach((item) => {
      if (!invoiceItemMap.has(item.invoice_id)) {
        invoiceItemMap.set(item.invoice_id, []);
      }
      invoiceItemMap.get(item.invoice_id).push(item);
    });

    const paymentAllocMap = new Map();
    state.allocations.forEach((alloc) => {
      if (!paymentAllocMap.has(alloc.payment_id)) {
        paymentAllocMap.set(alloc.payment_id, []);
      }
      paymentAllocMap.get(alloc.payment_id).push(alloc);
    });

    state.invoices = state.invoices.map((invoice) => {
      const items = invoiceItemMap.get(invoice.id) || [];
      return {
        ...invoice,
        items,
        total: Number(invoice.total_amount || 0),
        paidAmount: Number(invoice.paid_amount || 0),
        balance: Number(invoice.balance_amount || 0),
        status: getPrimaryStatus(
          Number(invoice.balance_amount || 0),
          Number(invoice.total_amount || 0)
        )
      };
    });

    state.payments = state.payments.map((payment) => ({
      ...payment,
      allocations: paymentAllocMap.get(payment.id) || []
    }));

    state.invoices.forEach((invoice) => {
      const customer = customerMap.get(invoice.customer_id);
      if (customer && !isVoidedInvoice(invoice)) {
        customer.invoices.push(invoice);
      }
    });

    state.payments.forEach((payment) => {
      const customer = customerMap.get(payment.customer_id);
      if (customer) {
        customer.payments.push(payment);
      }
    });

    state.customers = Array.from(customerMap.values());

    rebuildStateIndexes();

    if (state.selectedCustomerId && !getCustomerById(state.selectedCustomerId)) {
      state.selectedCustomerId = null;
    }
  }

  function rebuildStateIndexes() {
    state.indexes = AKY_STATE_INDEXES?.createStateIndexes?.(state) || null;
  }

  function getCustomerById(customerId) {
    if (!customerId) return null;
    return (
      state.indexes?.customersById?.get(customerId) ||
      state.customers.find((customer) => customer.id === customerId) ||
      null
    );
  }

  function getInvoiceById(invoiceId) {
    if (!invoiceId) return null;
    return (
      state.indexes?.invoicesById?.get(invoiceId) ||
      state.invoices.find((invoice) => invoice.id === invoiceId) ||
      null
    );
  }

  function getPaymentById(paymentId) {
    if (!paymentId) return null;
    return (
      state.indexes?.paymentsById?.get(paymentId) ||
      state.payments.find((payment) => payment.id === paymentId) ||
      null
    );
  }

  function getPendingTbvByInvoiceId(invoiceId) {
    if (!invoiceId) return null;
    return (
      state.indexes?.pendingTbvByInvoiceId?.get(invoiceId) ||
      state.tbvs.find(
        (tbv) => tbv.invoice_id === invoiceId && tbv.status === "PENDING"
      ) ||
      null
    );
  }

  function renderCurrentUser() {
    const user = getCurrentUser();
    if (!user) return;

    el.currentUserInfo.innerHTML = `
      <strong>${escapeHtml(user.username || user.email || "User")}</strong><br>
      Role: <strong>${escapeHtml(capitalizeRole(user.role))}</strong>
    `;

    document.querySelectorAll(".executive-access").forEach((node) => node.classList.toggle("hidden", !canViewExecutive()));
    document.querySelectorAll(".notification-access").forEach((node) => node.classList.toggle("hidden", !canViewNotifications()));
    document.querySelectorAll(".log-access").forEach((node) => node.classList.toggle("hidden", !canViewLogs()));
    document.querySelectorAll(".customer-edit-access").forEach((node) => node.classList.toggle("hidden", !canEditCustomer()));
    document.querySelectorAll(".invoice-create-access").forEach((node) => node.classList.toggle("hidden", !canCreateInvoice()));
    document.querySelectorAll(".payment-create-access").forEach((node) => node.classList.toggle("hidden", !canCreatePayment()));
    document.querySelectorAll(".owner-access").forEach((node) => node.classList.toggle("hidden", !canManageAccounts() && !canDeleteCustomer()));

        el.navAccounts.classList.toggle("hidden", !canManageAccounts());
    el.navChequeRegister.classList.toggle("hidden", !canViewChequeRegister());
    el.openCustomerModalBtn.classList.toggle("hidden", !canCreateCustomer());
    el.createSOABtn.classList.toggle("hidden", !canGenerateSoa());
  }

    function setView(view) {
    state.currentView = view;

    [
      el.customersView,
      el.executiveView,
      el.notificationsView,
      el.chequeRegisterView,
      el.reportsView,
      el.logView,
      el.accountsView
    ].forEach((v) => v.classList.add("hidden"));

    [
      el.navCustomers,
      el.navExecutive,
      el.navNotifications,
      el.navChequeRegister,
      el.navReports,
      el.navLogs,
      el.navAccounts
    ].forEach((b) => b.classList.remove("active"));

    if (view === "customers") {
      el.customersView.classList.remove("hidden");
      el.navCustomers.classList.add("active");
      return;
    }

    if (view === "executive" && canViewExecutive()) {
      renderLazyView("executive");
      el.executiveView.classList.remove("hidden");
      el.navExecutive.classList.add("active");
      return;
    }

    if (view === "notifications" && canViewNotifications()) {
      renderLazyView("notifications");
      el.notificationsView.classList.remove("hidden");
      el.navNotifications.classList.add("active");
      return;
    }

        if (view === "cheque-register" && canViewChequeRegister()) {
      renderLazyView("cheque-register");
      el.chequeRegisterView.classList.remove("hidden");
      el.navChequeRegister.classList.add("active");
      return;
    }

    if (view === "reports") {
      renderLazyView("reports");
      el.reportsView.classList.remove("hidden");
      el.navReports.classList.add("active");
      return;
    }

    if (view === "logs" && canViewLogs()) {
      renderLazyView("logs");
      el.logView.classList.remove("hidden");
      el.navLogs.classList.add("active");
      return;
    }

    if (view === "accounts" && canManageAccounts()) {
      renderLazyView("accounts");
      el.accountsView.classList.remove("hidden");
      el.navAccounts.classList.add("active");
      return;
    }

    el.customersView.classList.remove("hidden");
    el.navCustomers.classList.add("active");
    state.currentView = "customers";
  }

    function renderCustomerList() {
    const term = (el.customerSearch.value || "").trim().toLowerCase();
    const list = state.customers
      .filter((c) => c.name.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name));

    el.customerList.innerHTML = "";

    if (!list.length) {
      el.customerList.innerHTML = `<div class="muted">No matching customers.</div>`;
      return;
    }

    list.forEach((customer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "customer-item" + (customer.id === state.selectedCustomerId ? " active" : "");
      button.innerHTML = `
        <span class="customer-item-inner">
          <span>${escapeHtml(customer.name)}</span>
          ${isDiscountAuthorizedCustomer(customer)
            ? `<span class="customer-discount-star" title="Discount Authorized">★</span>`
            : ""}
        </span>
      `;
      button.addEventListener("click", () => {
        state.selectedCustomerId = customer.id;
        renderCustomerList();
        renderCurrentCustomerDashboard();
        setView("customers");
      });
      el.customerList.appendChild(button);
    });
  }

  function getSelectedCustomer() {
    return state.customers.find((c) => c.id === state.selectedCustomerId) || null;
  }

  function renderCurrentCustomerDashboard() {
    const customer = getSelectedCustomer();
    if (!customer) {
  el.welcomePanel.classList.remove("hidden");
  el.customerDashboard.classList.add("hidden");

  if (typeof syncDocumentVaultCustomer === "function") {
    syncDocumentVaultCustomer();
  }

  return;
}

    el.welcomePanel.classList.add("hidden");
    el.customerDashboard.classList.remove("hidden");
        el.customerTitle.innerHTML = `
      ${escapeHtml(customer.name)}
      ${isDiscountAuthorizedCustomer(customer)
        ? `<span class="customer-discount-star" title="Discount Authorized">★</span>`
        : ""}
    `;

    el.customerMeta.innerHTML = `
      Primary Phone: ${escapeHtml(customer.phone || "-")}
      ${customer.email ? ` | Email: ${escapeHtml(customer.email)}` : ""}
      ${isDiscountAuthorizedCustomer(customer)
        ? `<br><span class="discount-chip">Discount Cap: ${escapeHtml(formatPeso(customer.discount_max_amount || 0))}</span>${
            customer.discount_note
              ? ` <span class="muted">Rule: ${escapeHtml(customer.discount_note)}</span>`
              : ""
          }`
        : ""}
    `;

    renderCustomerContacts(customer);
    renderCustomerSummary(customer);
    renderInvoiceTable(customer);
    renderPaymentTable(customer);
    renderAlertBox(customer);

    el.editCustomerBtn.classList.toggle("hidden", !canEditCustomer());
el.deleteCustomerBtn.classList.toggle("hidden", !canDeleteCustomer());
el.createInvoiceBtn.classList.toggle("hidden", !canCreateInvoice());
el.makePaymentBtn.classList.toggle("hidden", !canCreatePayment());
el.createSOABtn.classList.toggle("hidden", !canGenerateSoa());

if (typeof syncDocumentVaultCustomer === "function") {
  syncDocumentVaultCustomer();
}

if (typeof loadCustomerDocuments === "function") {
  loadCustomerDocuments();
}
}

function renderCustomerContacts(customer) {
  const primary = {
    contact_name: customer.name,
    phone: customer.phone,
    email: customer.email
  };

  const additionalContacts = customer.contacts || [];

  const additionalHtml = additionalContacts.length
    ? additionalContacts.map((contact, index) => `
        <div class="contact-card">
          <strong>Additional Contact ${index + 1}</strong><br>
          Name: ${escapeHtml(contact.contact_name || "-")}<br>
          Phone: ${escapeHtml(contact.phone || "-")}<br>
          Email: ${escapeHtml(contact.email || "-")}
        </div>
      `).join("")
    : `<div class="muted">No additional contacts.</div>`;

  el.customerContacts.innerHTML = `
    <div class="contacts-split">
      <div class="contact-column">
        <div class="contact-column-title">Primary Contact</div>
        <div class="contact-card primary-contact-card">
          <strong>Primary Contact</strong><br>
          Name: ${escapeHtml(primary.contact_name || "-")}<br>
          Phone: ${escapeHtml(primary.phone || "-")}<br>
          Email: ${escapeHtml(primary.email || "-")}
        </div>
      </div>

      <div class="contact-column">
        <div class="contact-column-title">Additional Contacts</div>
        <div class="contact-grid">
          ${additionalHtml}
        </div>
      </div>
    </div>
  `;
}

  function renderCustomerSummary(customer) {
    const totalInvoiced = customer.invoices.reduce((sum, x) => sum + Number(x.total || 0), 0);
    const totalCollected = getOperationalCollectedAmount(customer.id);
    const totalOutstanding = customer.invoices.reduce((sum, x) => sum + Number(x.balance || 0), 0);
    const overdueCount = customer.invoices.filter((x) => x.balance > 0 && getDaysOpen(x.invoice_date) > 90).length;

    el.sumInvoiced.textContent = formatPeso(totalInvoiced);
    el.sumCollected.textContent = formatPeso(totalCollected);
    el.sumOutstanding.textContent = formatPeso(totalOutstanding);
    el.sumOverdue.textContent = String(overdueCount);
  }
  function buildOldestFirstAllocations(customer, amount) {
    const openInvoices = (customer?.invoices || [])
      .filter((inv) => Number(inv.balance || 0) > 0)
      .slice()
      .sort((a, b) => {
        const dateCompare = String(a.invoice_date || "").localeCompare(String(b.invoice_date || ""));
        if (dateCompare !== 0) return dateCompare;
        return String(a.invoice_number || "").localeCompare(String(b.invoice_number || ""));
      });

    let remaining = round2(amount);
    const allocations = [];

    for (const invoice of openInvoices) {
      if (remaining <= 0) break;

      const invoiceBalance = round2(Number(invoice.balance || 0));
      const appliedAmount = round2(Math.min(invoiceBalance, remaining));

      if (appliedAmount > 0) {
        allocations.push({
          invoiceId: invoice.id,
          invoiceNumber: invoice.invoice_number,
          invoiceDate: invoice.invoice_date,
          amount: appliedAmount,
          remainingAfter: round2(invoiceBalance - appliedAmount)
        });

        remaining = round2(remaining - appliedAmount);
      }
    }

    return {
      allocations,
      remaining
    };
  }
    function getChequeStatus(payment) {
    const details = payment?.details || {};

    if (details.bouncedAt || details.bounceReason) return "Bounced";
    if (payment.cleared === true) return "Cleared";
    return "Pending";
  }

    function canManageChequeRegister() {
    return canClearCheque() || canBounceCheque() || canReplaceBouncedCheque();
  }

  function ensureChequeActionAllowed(canRun, deniedMessage) {
    if (canRun()) return true;
    alert(deniedMessage);
    return false;
  }

  function getChequeRegisterEntries() {
    return state.payments
      .filter((payment) => payment.method === "Cheque")
      .map((payment) => {
        const details = payment.details || {};
        const customer = state.customers.find((c) => c.id === payment.customer_id);

        const appliedTo = (payment.allocations || []).map((alloc) => {
          const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
          return `${getInvoiceReferenceLabel(invoice)} (${formatPeso(getAllocationAmount(alloc))})`;
        }).join(", ");

        return {
          payment,
          details,
          customer,
          status: getChequeStatus(payment),
          appliedTo
        };
      })
      .sort((a, b) => String(b.payment.payment_date || "").localeCompare(String(a.payment.payment_date || "")));
  }
  function getAllocationAmount(alloc) {
    return Number(alloc?.allocated_amount ?? alloc?.amount ?? 0);
  }

    function getPostDatedChequeEntries(customerId = null) {
    return state.payments
      .filter((payment) => {
        const details = getPaymentDetailsObject(payment);

        if (customerId && payment.customer_id !== customerId) return false;
        if (payment.method !== "Cheque") return false;
        if (!details.isPostDated || !details.chequeDate) return false;

        // Only true pending post-dated cheques belong in follow-up panels.
        return getChequeStatus(payment) === "Pending";
      })
      .map((payment) => {
        const details = getPaymentDetailsObject(payment);
        const customer = state.customers.find((c) => c.id === payment.customer_id);

        const allocations = (payment.allocations || []).map((alloc) => {
          const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
          const allocatedAmount = round2(getAllocationAmount(alloc));
          const invoiceBalance = round2(Number(invoice?.balance || 0));

          // Only show the still-exposed amount tied to this cheque allocation.
          const remainingExposure = round2(Math.min(invoiceBalance, allocatedAmount));

          return {
            invoice,
            allocatedAmount,
            remainingExposure
          };
        });

        const invoiceNumbers = allocations.map((x) => getInvoiceReferenceLabel(x.invoice));
        const openBalance = round2(
          allocations.reduce((sum, x) => sum + Number(x.remainingExposure || 0), 0)
        );

        return {
          payment,
          details,
          customer,
          allocations,
          invoiceNumbers,
          openBalance
        };
      })
      .filter((entry) => entry.openBalance > 0)
      .sort((a, b) => String(a.details.chequeDate || "").localeCompare(String(b.details.chequeDate || "")));
  }

  function renderAlertBox(customer) {
    const alerts = [];

    customer.invoices
      .filter((x) => x.balance > 0 && getDaysOpen(x.invoice_date) > 90)
      .forEach((x) => alerts.push(`Overdue 90+ days: ${x.invoice_number} (${formatPeso(x.balance)})`));

    customer.invoices.forEach((x) => {
      const tbv = state.tbvs.find((t) => t.invoice_id === x.id && t.status === "PENDING");
      if (tbv) alerts.push(`TBV pending: ${x.invoice_number}`);
    });

    getPostDatedChequeEntries(customer.id)
      .filter((entry) => entry.openBalance > 0)
      .forEach((entry) => {
        alerts.push(`Pending post-dated cheque: ${formatPeso(entry.openBalance)} due on ${entry.details.chequeDate}`);
      });

    if (!alerts.length) {
      el.overdueAlertBox.classList.add("hidden");
      el.overdueAlertBox.innerHTML = "";
      return;
    }

    el.overdueAlertBox.classList.remove("hidden");
    el.overdueAlertBox.innerHTML = alerts.map((a) => `<div>${escapeHtml(a)}</div>`).join("");
  }

    function openAddCustomerModal() {
    if (!canCreateCustomer()) return;
    state.editingCustomerId = null;
    el.customerModalTitle.textContent = "Add Customer";
    el.customerEditNoteWrap.classList.add("hidden");
    el.customerEditRequiredNote.value = "";
    el.customerFormName.value = "";
    el.customerFormPhone.value = "";
    el.customerFormEmail.value = "";

    if (el.customerDiscountAuthorizedInput) el.customerDiscountAuthorizedInput.checked = false;
    if (el.customerDiscountMaxAmountInput) el.customerDiscountMaxAmountInput.value = "";
    if (el.customerDiscountNoteInput) el.customerDiscountNoteInput.value = "";
    renderCustomerDiscountFields();

    el.additionalContacts.innerHTML = "";
    addContactRow();
    openModal(el.customerModal);
  }

    function openEditCustomerModal() {
    if (!canEditCustomer()) return;
    const customer = getSelectedCustomer();
    if (!customer) return;

    state.editingCustomerId = customer.id;
    el.customerModalTitle.textContent = "Edit Customer";
    el.customerEditNoteWrap.classList.remove("hidden");
    el.customerEditRequiredNote.value = "";
    el.customerFormName.value = customer.name || "";
    el.customerFormPhone.value = customer.phone || "";
    el.customerFormEmail.value = customer.email || "";

    if (el.customerDiscountAuthorizedInput) {
      el.customerDiscountAuthorizedInput.checked = !!customer.discount_authorized;
    }
    if (el.customerDiscountMaxAmountInput) {
      el.customerDiscountMaxAmountInput.value = customer.discount_max_amount ?? "";
    }
    if (el.customerDiscountNoteInput) {
      el.customerDiscountNoteInput.value = customer.discount_note || "";
    }
    renderCustomerDiscountFields();

    el.additionalContacts.innerHTML = "";
    (customer.contacts.length ? customer.contacts : [{}]).forEach((c) => addContactRow(c));
    openModal(el.customerModal);
  }

  function addContactRow(contact = {}) {
    const row = document.createElement("div");
    row.className = "form-grid two-col contact-card";
    row.innerHTML = `
      <div class="field"><label>Contact Name</label><input type="text" class="contact-name" value="${escapeAttr(contact.contact_name || "")}"></div>
      <div class="field"><label>Contact Phone</label><input type="text" class="contact-phone" value="${escapeAttr(contact.phone || "")}"></div>
      <div class="field"><label>Contact Email</label><input type="email" class="contact-email" value="${escapeAttr(contact.email || "")}"></div>
      <div class="field" style="display:flex;align-items:end;"><button type="button" class="btn btn-danger wide-btn remove-contact-btn">Remove Contact</button></div>
    `;
    row.querySelector(".remove-contact-btn").addEventListener("click", () => row.remove());
    el.additionalContacts.appendChild(row);
  }

    async function saveCustomer() {
  const name = el.customerFormName.value.trim();
  const phone = el.customerFormPhone.value.trim();
  const email = el.customerFormEmail.value.trim();

  if (!name) return alert("Customer name is required.");
  if (!phone) return alert("Phone number is required.");

  const contacts = [...el.additionalContacts.querySelectorAll(".contact-card")]
    .map((card) => ({
      contact_name: card.querySelector(".contact-name")?.value.trim() || "",
      phone: card.querySelector(".contact-phone")?.value.trim() || "",
      email: card.querySelector(".contact-email")?.value.trim() || ""
    }))
    .filter((c) => c.contact_name || c.phone || c.email);

  const ownerCanConfigureDiscount = canAuthorizeCustomerDiscount();
  const existingCustomer = state.editingCustomerId
    ? state.customers.find((c) => c.id === state.editingCustomerId)
    : null;

  let discountAuthorized = false;
  let discountMaxAmount = null;
  let discountNote = null;

  if (ownerCanConfigureDiscount) {
    discountAuthorized = !!el.customerDiscountAuthorizedInput.checked;

    if (discountAuthorized) {
      discountMaxAmount = round2(num(el.customerDiscountMaxAmountInput.value));
      if (discountMaxAmount <= 0) {
        return alert("Max discount per invoice is required and must be greater than 0.");
      }

      discountNote = el.customerDiscountNoteInput.value.trim() || null;
    }
  }

  if (state.editingCustomerId) {
    if (!canEditCustomer()) return;

    const note = el.customerEditRequiredNote.value.trim();
    if (editNoteRequired() && !note) return alert("Edit note is required for admin edits.");

    const { data, error } = await supabaseClient.rpc("save_customer_with_contacts", {
      p_customer_id: state.editingCustomerId,
      p_name: name,
      p_phone: phone,
      p_email: email || null,
      p_contacts: contacts,
      p_discount_authorized: discountAuthorized,
      p_discount_max_amount: discountAuthorized ? discountMaxAmount : null,
      p_discount_note: discountAuthorized ? discountNote : null
    });

    if (error) return alert(error.message);

    await addLog("Edit", "Customer", existingCustomer?.name || name, note, existingCustomer || null, data || null);
  } else {
    if (!canCreateCustomer()) return;

    const { data, error } = await supabaseClient.rpc("save_customer_with_contacts", {
      p_customer_id: null,
      p_name: name,
      p_phone: phone,
      p_email: email || null,
      p_contacts: contacts,
      p_discount_authorized: discountAuthorized,
      p_discount_max_amount: discountAuthorized ? discountMaxAmount : null,
      p_discount_note: discountAuthorized ? discountNote : null
    });

    if (error) return alert(error.message);

    state.selectedCustomerId = data.id;
    await addLog("Create", "Customer", name, "", null, data || null);
  }

  closeModal(el.customerModal);
  state.editingCustomerId = null;
  await refreshSelectedCustomerOnly();
  alert("Customer saved successfully.");
}

  async function deleteSelectedCustomer() {
  if (!canDeleteCustomer()) return;
  const customer = getSelectedCustomer();
  if (!customer) return alert("Please select a customer first.");

  const confirmed = window.confirm(`Delete customer "${customer.name}"? This cannot be undone.`);
  if (!confirmed) return;

  const { error } = await supabaseClient.rpc("delete_customer_safe", {
    p_customer_id: customer.id
  });

  if (error) return alert(error.message);

  await addLog("Delete", "Customer", customer.name, "Deleted by owner", customer, null);
  state.selectedCustomerId = null;
  await refreshAndRenderAll();
  alert("Customer deleted successfully.");
}

    function openInvoiceModalForCreate() {
    if (!canCreateInvoice()) return;
    const customer = getSelectedCustomer();
    if (!customer) return alert("Please select a customer first.");

    state.editingInvoiceId = null;
    el.invoiceModalTitle.textContent = "Create Invoice";
    el.editNoteWrap.classList.add("hidden");
    el.editRequiredNote.value = "";
    clearInvoiceForm();
    resetInvoiceDiscountInputs();
    el.invoiceDate.value = todayStr();
    renderInvoiceDiscountControls();
    addLineItemRow();
    updateInvoiceTotal();
    openModal(el.invoiceModal);
  }

    function openInvoiceModalForEdit(invoiceId) {
    if (!canEditInvoice()) return;
    const customer = getSelectedCustomer();
    if (!customer) return;

    const invoice = customer.invoices.find((x) => x.id === invoiceId);
    if (!invoice) return;

    state.editingInvoiceId = invoice.id;
    el.invoiceModalTitle.textContent = "Edit Invoice";
    el.editNoteWrap.classList.remove("hidden");
    el.editRequiredNote.value = "";
    clearInvoiceForm();

    el.invoiceNumber.value = invoice.invoice_number || "";
    el.invoiceDate.value = invoice.invoice_date || "";
    el.poNumber.value = invoice.po_number || "";
    el.referenceInfo.value = invoice.reference_info || "";

    if (canUseInvoiceDiscount(customer)) {
      const existingMode = invoice.discount_mode || "none";
      const hasDiscount = Number(invoice.discount_total_amount || 0) > 0;

      el.invoiceDiscountEnabled.checked = existingMode !== "none" || hasDiscount;
      el.invoiceDiscountMode.value =
        existingMode === "fixed" ? "fixed" : "per_qty";
      el.invoiceDiscountFixedAmount.value = invoice.invoice_discount_amount ?? "";
      el.invoiceDiscountReason.value = invoice.discount_reason || "";
    } else {
      resetInvoiceDiscountInputs();
    }

    renderInvoiceDiscountControls();

        (invoice.items.length ? invoice.items : [{}]).forEach((item) =>
      addLineItemRow({
        product: item.product_name,
        qty: item.qty,
        price: item.unit_price,
        discountPerQty: item.discount_per_qty || 0
      })
    );

    updateInvoiceTotal();
    openModal(el.invoiceModal);
  }

    function clearInvoiceForm() {
  el.invoiceNumber.value = "";
  el.invoiceDate.value = "";
  el.poNumber.value = "";
  el.referenceInfo.value = "";
  el.lineItemsContainer.innerHTML = "";
  el.invoiceTotalAmount.textContent = formatPeso(0);
  clearInvoiceDocumentDraft(false);

  const breakdownBox = document.getElementById("invoiceDiscountBreakdown");
  if (breakdownBox) {
    breakdownBox.innerHTML = "";
  }
}
  function canUseInvoiceDiscount(customer) {
    return !!customer?.discount_authorized;
  }

  function resetInvoiceDiscountInputs() {
    if (el.invoiceDiscountEnabled) el.invoiceDiscountEnabled.checked = false;
    if (el.invoiceDiscountMode) el.invoiceDiscountMode.value = "per_qty";
    if (el.invoiceDiscountFixedAmount) el.invoiceDiscountFixedAmount.value = "";
    if (el.invoiceDiscountReason) el.invoiceDiscountReason.value = "";
  }

    function getInvoiceEditorState() {
    const customer = getSelectedCustomer();
    const discountAuthorized = !!customer?.discount_authorized;
    const discountEnabled = discountAuthorized && !!el.invoiceDiscountEnabled?.checked;
    const discountMode = discountEnabled
      ? (el.invoiceDiscountMode?.value === "fixed" ? "fixed" : "per_qty")
      : "none";

    const capAmount = round2(Number(customer?.discount_max_amount || 0));
    const rawFixedDiscount = round2(num(el.invoiceDiscountFixedAmount?.value));

    const parsedRows = [...el.lineItemsContainer.querySelectorAll(".line-item")].map((row) => {
      const product_name = row.querySelector(".line-product")?.value.trim() || "";
      const qty = num(row.querySelector(".line-qty")?.value);
      const unit_price = num(row.querySelector(".line-price")?.value);
      const rawDiscountPerQty = round2(num(row.querySelector(".line-discount-per-qty")?.value));

      const line_subtotal = round2(qty * unit_price);
      const discount_per_qty =
        discountEnabled && discountMode === "per_qty" ? rawDiscountPerQty : 0;

      const line_discount_total = round2(
        Math.min(line_subtotal, qty * discount_per_qty)
      );

      const line_total = round2(Math.max(0, line_subtotal - line_discount_total));

      return {
        row,
        product_name,
        qty,
        unit_price,
        discount_per_qty,
        line_subtotal,
        line_discount_total,
        line_total
      };
    });

    const items = parsedRows.filter((item) =>
      item.product_name || item.qty || item.unit_price || item.discount_per_qty
    );

    const subtotalAmount = round2(items.reduce((sum, item) => sum + item.line_subtotal, 0));
    const lineDiscountTotal = round2(items.reduce((sum, item) => sum + item.line_discount_total, 0));

    const maxFixedAllowed = round2(Math.max(0, subtotalAmount - lineDiscountTotal));
    const invoiceDiscountAmount =
      discountEnabled && discountMode === "fixed"
        ? round2(Math.min(rawFixedDiscount, maxFixedAllowed))
        : 0;

    const discountTotalAmount = round2(lineDiscountTotal + invoiceDiscountAmount);
    const totalAmount = round2(Math.max(0, subtotalAmount - discountTotalAmount));
    const discountReason = discountEnabled ? (el.invoiceDiscountReason?.value.trim() || "") : "";

    return {
      customer,
      discountAuthorized,
      discountEnabled,
      discountMode,
      parsedRows,
      items,
      subtotalAmount,
      lineDiscountTotal,
      invoiceDiscountAmount,
      discountTotalAmount,
      totalAmount,
      capAmount,
      discountReason,
      exceedsCap: discountEnabled && discountTotalAmount > capAmount,
      isDiscountApplied: discountEnabled && discountTotalAmount > 0
    };
  }

  function renderInvoiceDiscountControls() {
    const customer = getSelectedCustomer();
    const discountAuthorized = canUseInvoiceDiscount(customer);

    el.invoiceDiscountWrap?.classList.toggle("hidden", !discountAuthorized);

    if (!discountAuthorized) {
      resetInvoiceDiscountInputs();
    }

    const discountEnabled = discountAuthorized && !!el.invoiceDiscountEnabled?.checked;
    const mode = discountEnabled
      ? (el.invoiceDiscountMode?.value === "fixed" ? "fixed" : "per_qty")
      : "none";

    el.invoiceDiscountControls?.classList.toggle("hidden", !discountEnabled);
    el.invoiceDiscountFixedWrap?.classList.toggle("hidden", !(discountEnabled && mode === "fixed"));

    updateInvoiceTotal();
  }

        function addLineItemRow(item = {}) {
    const row = document.createElement("div");
    row.className = "line-item";
    row.innerHTML = `
      <input type="text" class="line-product" placeholder="Product name" value="${escapeAttr(item.product || "")}">
      <input type="number" class="line-qty" placeholder="Qty" min="0" step="0.01" value="${item.qty ?? ""}">
      <input type="number" class="line-price" placeholder="Price" min="0" step="0.01" value="${item.price ?? ""}">
      <input type="number" class="line-discount-per-qty" placeholder="0.00" min="0" step="0.01" value="${item.discountPerQty ?? 0}">
      <div class="line-total-box">₱0</div>
      <button type="button" class="delete-line-btn">&times;</button>
    `;

    const recalc = () => updateInvoiceTotal();

    row.querySelector(".line-qty").addEventListener("input", recalc);
    row.querySelector(".line-price").addEventListener("input", recalc);
    row.querySelector(".line-discount-per-qty").addEventListener("input", recalc);

    row.querySelector(".delete-line-btn").addEventListener("click", () => {
      row.remove();
      if (!el.lineItemsContainer.children.length) addLineItemRow();
      updateInvoiceTotal();
    });

    el.lineItemsContainer.appendChild(row);
    updateInvoiceTotal();
  }
  
        function updateInvoiceTotal() {
    const editorState = getInvoiceEditorState();

    const usePerQtyDiscount =
      editorState.discountAuthorized &&
      editorState.discountEnabled &&
      editorState.discountMode === "per_qty";

    editorState.parsedRows.forEach((item) => {
      const discountInput = item.row.querySelector(".line-discount-per-qty");
      const totalBox = item.row.querySelector(".line-total-box");

      if (discountInput) {
        discountInput.disabled = !usePerQtyDiscount;
        if (!usePerQtyDiscount) {
          discountInput.value = "0";
        }
      }

      if (totalBox) {
        totalBox.textContent = formatPeso(item.line_total);
      }
    });

    if (
      el.invoiceDiscountFixedAmount &&
      editorState.discountEnabled &&
      editorState.discountMode === "fixed"
    ) {
      el.invoiceDiscountFixedAmount.value = editorState.invoiceDiscountAmount || "";
    }

    if (el.invoiceDiscountSummary) {
      const capStatus = editorState.exceedsCap
        ? `<span style="color:#c73636;"><strong>Over cap by ${formatPeso(editorState.discountTotalAmount - editorState.capAmount)}</strong></span>`
        : `<strong>Within cap</strong>`;

      el.invoiceDiscountSummary.innerHTML = `
        Subtotal: <strong>${formatPeso(editorState.subtotalAmount)}</strong><br>
        Discount: <strong>${formatPeso(editorState.discountTotalAmount)}</strong><br>
        Final Total: <strong>${formatPeso(editorState.totalAmount)}</strong><br>
        Customer Discount Cap: <strong>${formatPeso(editorState.capAmount)}</strong> | ${capStatus}
      `;
    }

    el.invoiceTotalAmount.textContent = formatPeso(editorState.totalAmount);
  }
  function normalizeInvoiceNumberForKey(value) {
    return String(value || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  }

    const invoiceDocumentState = {
  file: null,
  previewUrl: "",
  source: "upload"
};
function applyInvoiceDocumentLayout() {
  const fileInput = document.getElementById("invoiceDocumentFileInput");
  const notesInput = document.getElementById("invoiceDocumentNotes");
  const previewWrap = document.getElementById("invoiceDocumentPreviewWrap");
  const previewImg = document.getElementById("invoiceDocumentPreviewImg");
  const clearBtn = document.getElementById("clearInvoiceDocumentBtn");
  const statusBox = document.getElementById("invoiceDocumentStatus");

  if (!fileInput || !previewWrap || !previewImg || !clearBtn || !statusBox) return;

  const panel =
    fileInput.closest(".panel") ||
    fileInput.closest(".soft-panel") ||
    fileInput.parentElement;

  if (!panel) return;

  const fileField = fileInput.closest(".field") || fileInput.parentElement;
  const notesField = notesInput?.closest(".field");

  if (notesField) {
    notesField.classList.add("hidden");
  }

  let layout = document.getElementById("invoiceDocumentLayoutRow");
  let leftCol = document.getElementById("invoiceDocumentLeftCol");
  let rightCol = document.getElementById("invoiceDocumentRightCol");
  let clearWrap = document.getElementById("invoiceDocumentClearWrap");

  if (!layout) {
    layout = document.createElement("div");
    layout.id = "invoiceDocumentLayoutRow";
    layout.style.display = "flex";
    layout.style.gap = "18px";
    layout.style.alignItems = "flex-start";
    layout.style.marginTop = "12px";
    layout.style.flexWrap = "wrap";

    leftCol = document.createElement("div");
    leftCol.id = "invoiceDocumentLeftCol";
    leftCol.style.flex = "1 1 340px";
    leftCol.style.minWidth = "320px";

    rightCol = document.createElement("div");
    rightCol.id = "invoiceDocumentRightCol";
    rightCol.style.flex = "0 0 360px";
    rightCol.style.maxWidth = "360px";
    rightCol.style.width = "100%";

    layout.appendChild(leftCol);
    layout.appendChild(rightCol);
    panel.appendChild(layout);
  }

  if (fileField && fileField.parentElement !== leftCol) {
    leftCol.appendChild(fileField);
  }

  if (!clearWrap) {
    clearWrap = document.createElement("div");
    clearWrap.id = "invoiceDocumentClearWrap";
    clearWrap.style.marginTop = "12px";
    leftCol.appendChild(clearWrap);
  }

  if (clearBtn.parentElement !== clearWrap) {
    clearWrap.appendChild(clearBtn);
  }

  if (statusBox.parentElement !== leftCol) {
    leftCol.appendChild(statusBox);
  }

  if (previewWrap.parentElement !== rightCol) {
    rightCol.appendChild(previewWrap);
  }

  if (fileField) {
    fileField.style.maxWidth = "100%";
  }

  statusBox.style.marginTop = "12px";
  statusBox.style.maxWidth = "100%";

  previewWrap.style.display = previewWrap.classList.contains("hidden") ? "none" : "block";
  previewWrap.style.width = "100%";
  previewWrap.style.maxWidth = "360px";
  previewWrap.style.marginTop = "0";

  previewImg.style.width = "100%";
  previewImg.style.maxWidth = "360px";
  previewImg.style.maxHeight = "520px";
  previewImg.style.objectFit = "contain";
  previewImg.style.borderRadius = "12px";
}
function initInvoiceDocumentFlow() {
  const fileInput = document.getElementById("invoiceDocumentFileInput");
  const clearBtn = document.getElementById("clearInvoiceDocumentBtn");

  if (!fileInput || !clearBtn) return;

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      applyInvoiceDocumentFile(file);
    } catch (error) {
      setInvoiceDocumentStatus(error.message || "Could not use that file.", true);
      fileInput.value = "";
    }
  });

  clearBtn.addEventListener("click", () => {
    clearInvoiceDocumentDraft(true);
  });

  setInvoiceDocumentStatus(
    "Optional. Upload an image. It will be saved to Document Vault using the invoice number after the invoice is saved.",
    false
  );
}

function applyInvoiceDocumentFile(file) {
  const previewWrap = document.getElementById("invoiceDocumentPreviewWrap");
  const previewImg = document.getElementById("invoiceDocumentPreviewImg");

  AKY_DOCUMENT_UTILS.applyPreviewFile(invoiceDocumentState, {
    file,
    previewWrap,
    previewImg,
    source: "upload"
  });

  setInvoiceDocumentStatus(
    "Image ready. When you click Save Invoice, this image will also be saved into Document Vault.",
    false
  );
}

function clearInvoiceDocumentDraft(resetStatus = false) {
  const fileInput = document.getElementById("invoiceDocumentFileInput");
  const notesInput = document.getElementById("invoiceDocumentNotes");
  const previewWrap = document.getElementById("invoiceDocumentPreviewWrap");
  const previewImg = document.getElementById("invoiceDocumentPreviewImg");

  AKY_DOCUMENT_UTILS.resetPreviewState(invoiceDocumentState, {
    fileInput,
    previewWrap,
    previewImg,
    source: "upload",
    onReset: () => {
      if (notesInput) notesInput.value = "";
    }
  });

  if (resetStatus) {
    setInvoiceDocumentStatus(
      "Optional. Upload an image. It will be saved to Document Vault using the invoice number after the invoice is saved.",
      false
    );
  }
}

function setInvoiceDocumentStatus(message, isError) {
  const statusBox = document.getElementById("invoiceDocumentStatus");
  AKY_DOCUMENT_UTILS.setStatusMessage(statusBox, message, isError);
}

function invoiceDocumentSafeFileName(fileName) {
  return AKY_DOCUMENT_UTILS.safeStorageFileName(fileName, "invoice-document.png");
}

async function saveInvoiceDocumentToVault({ customerId, invoiceId, invoiceNumber, notes }) {
  if (!invoiceDocumentState.file) return false;

  const { data: authData, error: authError } = await supabaseClient.auth.getUser();
  if (authError || !authData?.user?.id) {
    throw new Error("Could not identify the signed-in user for the invoice document.");
  }

  const invoiceNumberKey = normalizeInvoiceNumberForKey(invoiceNumber) || `invoice-${Date.now()}`;
  const safeOriginalName = invoiceDocumentSafeFileName(invoiceDocumentState.file.name);
  const storagePath = `${customerId}/${new Date().toISOString().slice(0, 10)}/invoice-${invoiceNumberKey}-${Date.now()}-${safeOriginalName}`;

  const { error: uploadError } = await supabaseClient.storage
    .from("customer-documents")
    .upload(storagePath, invoiceDocumentState.file, {
      cacheControl: "3600",
      upsert: false,
      contentType: invoiceDocumentState.file.type || "image/png"
    });

  if (uploadError) {
    throw new Error(uploadError.message || "Invoice document upload failed.");
  }

  const { error: insertError } = await supabaseClient
    .from("customer_documents")
    .insert({
      customer_id: customerId,
      invoice_id: invoiceId,
      payment_id: null,
      origin_screen: "invoice_modal",
      category: "invoice",
      title: invoiceNumber,
      reference_code: invoiceNumber,
      notes: notes || null,
      file_name: invoiceDocumentState.file.name,
      mime_type: invoiceDocumentState.file.type || "image/png",
      file_size: invoiceDocumentState.file.size,
      storage_path: storagePath,
      source: invoiceDocumentState.source,
      uploaded_by: authData.user.id
    });

  if (insertError) {
    await supabaseClient.storage.from("customer-documents").remove([storagePath]);
    throw new Error(insertError.message || "Invoice document record could not be saved.");
  }

  clearInvoiceDocumentDraft(true);
  return true;
}

initInvoiceDocumentFlow();

async function saveInvoice() {
  const customer = getSelectedCustomer();
  if (!customer) return;

  const invoiceNumber = el.invoiceNumber.value.trim();
  const invoiceDate = el.invoiceDate.value;
  const poNumber = el.poNumber.value.trim();
  const referenceInfo = el.referenceInfo.value.trim();
  const invoiceDocumentNotes = document.getElementById("invoiceDocumentNotes")?.value.trim() || null;

  if (!invoiceNumber) return alert("Invoice number is required.");
  if (!invoiceDate) return alert("Invoice date is required.");

  const invoiceNumberKey = normalizeInvoiceNumberForKey(invoiceNumber);
  if (!invoiceNumberKey) {
    return alert("Invoice number is invalid.");
  }

  const editorState = getInvoiceEditorState();

  if (!editorState.items.length) {
    return alert("Add at least one line item.");
  }

  if (editorState.exceedsCap) {
    return alert(
      `Discount exceeds this customer's authorized cap.\n\n` +
      `Cap: ${formatPeso(editorState.capAmount)}\n` +
      `Applied Discount: ${formatPeso(editorState.discountTotalAmount)}`
    );
  }

  const items = editorState.items.map((item) => ({
    product_name: item.product_name,
    qty: item.qty,
    unit_price: item.unit_price,
    line_subtotal: item.line_subtotal,
    discount_per_qty: item.discount_per_qty,
    line_discount_total: item.line_discount_total,
    line_total: item.line_total
  }));

  let savedInvoiceId = state.editingInvoiceId || null;
  let documentMessage = "";

  if (state.editingInvoiceId) {
    if (!canEditInvoice()) return;

    const editNote = el.editRequiredNote.value.trim();
    if (editNoteRequired() && !editNote) return alert("Edit note is required for admin edits.");

    const oldInvoice = state.invoices.find((x) => x.id === state.editingInvoiceId);
    if (!oldInvoice) return alert("Invoice not found.");

    if (!canEditInvoiceRecord(oldInvoice)) {
      return alert("Admin cannot edit partially paid or paid invoices.");
    }

    const { data, error } = await supabaseClient.rpc("save_invoice_with_items", {
      p_invoice_id: state.editingInvoiceId,
      p_customer_id: customer.id,
      p_invoice_number: invoiceNumber,
      p_invoice_number_key: invoiceNumberKey,
      p_invoice_date: invoiceDate,
      p_po_number: poNumber || null,
      p_reference_info: referenceInfo || null,
      p_items: items,
      p_subtotal_amount: editorState.subtotalAmount,
      p_line_discount_total: editorState.lineDiscountTotal,
      p_invoice_discount_amount: editorState.invoiceDiscountAmount,
      p_discount_total_amount: editorState.discountTotalAmount,
      p_discount_mode: editorState.discountEnabled ? editorState.discountMode : "none",
      p_discount_reason: editorState.discountEnabled ? (editorState.discountReason || null) : null,
      p_total_amount: editorState.totalAmount
    });

    if (error) return alert(error.message);

    await addLog("Edit", "Invoice", invoiceNumber, editNote, oldInvoice, data || null);
    savedInvoiceId = state.editingInvoiceId;
  } else {
    if (!canCreateInvoice()) return;

    const { data, error } = await supabaseClient.rpc("save_invoice_with_items", {
      p_invoice_id: null,
      p_customer_id: customer.id,
      p_invoice_number: invoiceNumber,
      p_invoice_number_key: invoiceNumberKey,
      p_invoice_date: invoiceDate,
      p_po_number: poNumber || null,
      p_reference_info: referenceInfo || null,
      p_items: items,
      p_subtotal_amount: editorState.subtotalAmount,
      p_line_discount_total: editorState.lineDiscountTotal,
      p_invoice_discount_amount: editorState.invoiceDiscountAmount,
      p_discount_total_amount: editorState.discountTotalAmount,
      p_discount_mode: editorState.discountEnabled ? editorState.discountMode : "none",
      p_discount_reason: editorState.discountEnabled ? (editorState.discountReason || null) : null,
      p_total_amount: editorState.totalAmount
    });

    if (error) return alert(error.message);

    await addLog("Create", "Invoice", invoiceNumber, "", null, data || null);
    savedInvoiceId = data.id;
  }

  if (invoiceDocumentState.file && savedInvoiceId) {
    try {
      const docSaved = await saveInvoiceDocumentToVault({
        customerId: customer.id,
        invoiceId: savedInvoiceId,
        invoiceNumber,
        notes: invoiceDocumentNotes
      });

      if (docSaved) {
        documentMessage = "\nInvoice document was also saved to Document Vault.";
      }
    } catch (error) {
      documentMessage =
        `\nInvoice was saved, but the document was not saved to Document Vault.\nReason: ${error.message || "Unknown error"}`;
    }
  }

  closeModal(el.invoiceModal);
  state.editingInvoiceId = null;
  await refreshSelectedCustomerOnly();

  if (typeof window.AKY_loadCustomerDocuments === "function") {
    await window.AKY_loadCustomerDocuments();
  }

  alert(`Invoice saved successfully.${documentMessage}`);
}
  function selectCustomerContext(customerId) {
  if (!customerId) return null;

  const customer = state.customers.find((item) => item.id === customerId) || null;
  if (!customer) return null;

  if (state.selectedCustomerId !== customer.id) {
    state.selectedCustomerId = customer.id;
    renderCustomerList();
    renderCurrentCustomerDashboard();
  }

  return customer;
}

  function openReportInvoiceDetails(customerId, invoiceId) {
  const customer = selectCustomerContext(customerId);
  if (!customer || !invoiceId) return;

  const invoice = customer.invoices.find((item) => item.id === invoiceId);
  if (!invoice) return;

  viewInvoice(invoice.id);
}

  function openReportPaymentDetails(customerId, paymentId) {
  const customer = selectCustomerContext(customerId);
  if (!customer || !paymentId) return;

  const payment = customer.payments.find((item) => item.id === paymentId);
  if (!payment) return;

  viewPayment(payment.id);
}

  function renderInvoiceTable(customer) {
  el.invoiceTableBody.innerHTML = "";

  if (!customer.invoices.length) {
    el.invoiceTableBody.innerHTML = `<tr><td colspan="10" class="muted">No invoices yet.</td></tr>`;
    return;
  }

  customer.invoices
    .slice()
    .sort((a, b) => String(b.invoice_date).localeCompare(String(a.invoice_date)))
    .forEach((invoice) => {
      const tbv = state.tbvs.find((t) => t.invoice_id === invoice.id && t.status === "PENDING");
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="clickable">${escapeHtml(invoice.invoice_number)}</td>
        <td>${escapeHtml(invoice.invoice_date)}</td>
        <td>${escapeHtml(invoice.po_number || "-")}</td>
        <td>${escapeHtml(invoice.reference_info || "-")}</td>
        <td>${formatPeso(invoice.total)}</td>
        <td>${formatPeso(invoice.paidAmount)}</td>
        <td>${formatPeso(invoice.balance)}</td>
        <td>${statusPill(invoice.status)}</td>
        <td>${tbv ? `<span class="notice-pill notice-postdated">PENDING</span>` : "-"}</td>
        <td class="muted">Click invoice #</td>
      `;

      tr.querySelector(".clickable").addEventListener("click", () => viewInvoice(invoice.id));
      el.invoiceTableBody.appendChild(tr);
    });
}

  function openPaymentTypeModal() {
    const customer = getSelectedCustomer();
    if (!customer) return alert("Please select a customer first.");
    if (!canCreatePayment()) return;
    const openInvoices = customer.invoices.filter((inv) => inv.balance > 0);
    if (!openInvoices.length) return alert("This customer has no open invoices.");
    state.paymentDraft = null;
    openModal(el.paymentTypeModal);
  }

  function openPayByInvoiceStep() {
    const customer = getSelectedCustomer();
    if (!customer) return;
    closeModal(el.paymentTypeModal);
    el.invoiceSelectionList.innerHTML = "";
    el.selectedInvoicesTotal.textContent = formatPeso(0);
    customer.invoices.filter((inv) => inv.balance > 0).forEach((invoice) => {
      const label = document.createElement("label");
      label.className = "selection-item";
      label.innerHTML = `
          <input type="checkbox" data-id="${invoice.id}">
          <div>
            <strong>${escapeHtml(invoice.invoice_number)}</strong>
            <small>Date: ${escapeHtml(invoice.invoice_date)} | Status: ${escapeHtml(invoice.status)} | Balance: ${formatPeso(invoice.balance)}</small>
          </div>
          <div><strong>${formatPeso(invoice.balance)}</strong></div>
      `;
      label.querySelector("input").addEventListener("change", updateSelectedInvoicesTotal);
      el.invoiceSelectionList.appendChild(label);
    });
    openModal(el.invoiceSelectionModal);
  }

  function updateSelectedInvoicesTotal() {
    const customer = getSelectedCustomer();
    if (!customer) return;
    const ids = [...el.invoiceSelectionList.querySelectorAll("input[type='checkbox']:checked")].map((cb) => cb.dataset.id);
    const total = customer.invoices.filter((inv) => ids.includes(inv.id)).reduce((sum, inv) => sum + inv.balance, 0);
    el.selectedInvoicesTotal.textContent = formatPeso(total);
  }

  function proceedSelectedInvoices() {
    const customer = getSelectedCustomer();
    if (!customer) return;
    const ids = [...el.invoiceSelectionList.querySelectorAll("input[type='checkbox']:checked")].map((cb) => cb.dataset.id);
    if (!ids.length) return alert("Select at least one invoice.");
    const selectedInvoices = customer.invoices.filter((inv) => ids.includes(inv.id));
    state.paymentDraft = { mode: "full", amount: selectedInvoices.reduce((sum, inv) => sum + inv.balance, 0), allocations: selectedInvoices.map((inv) => ({ invoiceId: inv.id, amount: inv.balance })) };
    closeModal(el.invoiceSelectionModal);
    openPaymentMethodStep();
  }

    function openPartialPaymentStep() {
    const customer = getSelectedCustomer();
    if (!customer) return;

    const openInvoices = customer.invoices.filter((inv) => Number(inv.balance || 0) > 0);
    if (!openInvoices.length) return alert("This customer has no open invoices.");

    closeModal(el.paymentTypeModal);
    el.partialInvoiceSelect.innerHTML = `Auto-allocation uses oldest open invoices first. Open invoices: <strong>${openInvoices.length}</strong>`;
    el.partialAmountInput.value = "";
    el.partialBalanceInfo.innerHTML = "Enter a payment amount to preview how it will be allocated.";
    openModal(el.partialPaymentModal);
  }

  function renderPartialBalanceInfo() {
    const customer = getSelectedCustomer();
    if (!customer) return;

    const openInvoices = customer.invoices.filter((inv) => Number(inv.balance || 0) > 0);
    if (!openInvoices.length) {
      el.partialBalanceInfo.innerHTML = "No open invoices available.";
      return;
    }

    const totalOpenBalance = round2(openInvoices.reduce((sum, inv) => sum + Number(inv.balance || 0), 0));
    const amount = num(el.partialAmountInput.value);

    if (amount <= 0) {
      el.partialBalanceInfo.innerHTML = `Total open balance: <strong>${formatPeso(totalOpenBalance)}</strong>. Enter a payment amount to preview allocation.`;
      return;
    }

    if (amount > totalOpenBalance) {
      el.partialBalanceInfo.innerHTML = `Entered amount <strong>${formatPeso(amount)}</strong> is more than the customer's total open balance of <strong>${formatPeso(totalOpenBalance)}</strong>.`;
      return;
    }

    const result = buildOldestFirstAllocations(customer, amount);

    const allocationLines = result.allocations.map((alloc) => `
      <div>
        ${escapeHtml(alloc.invoiceNumber)} (${escapeHtml(alloc.invoiceDate || "-")}) :
        <strong>${formatPeso(alloc.amount)}</strong>
        | Remaining on invoice: <strong>${formatPeso(alloc.remainingAfter)}</strong>
      </div>
    `).join("");

    el.partialBalanceInfo.innerHTML = `
      <div><strong>Total open balance:</strong> ${formatPeso(totalOpenBalance)}</div>
      <div><strong>Payment amount:</strong> ${formatPeso(amount)}</div>
      <div style="margin-top:10px;"><strong>Auto-allocation preview:</strong></div>
      <div style="margin-top:8px;">${allocationLines || "No allocations generated."}</div>
    `;
  }

  function proceedPartialPayment() {
    const customer = getSelectedCustomer();
    if (!customer) return;

    const openInvoices = customer.invoices.filter((inv) => Number(inv.balance || 0) > 0);
    if (!openInvoices.length) return alert("This customer has no open invoices.");

    const totalOpenBalance = round2(openInvoices.reduce((sum, inv) => sum + Number(inv.balance || 0), 0));
    const amount = num(el.partialAmountInput.value);

    if (amount <= 0) return alert("Enter a valid payment amount.");
    if (amount > totalOpenBalance) return alert("Payment amount cannot be more than the customer's total open balance.");

    const result = buildOldestFirstAllocations(customer, amount);
    if (!result.allocations.length) return alert("No allocations were generated.");

    state.paymentDraft = {
      mode: "allocate",
      amount,
      allocations: result.allocations.map((alloc) => ({
        invoiceId: alloc.invoiceId,
        amount: alloc.amount
      }))
    };

    closeModal(el.partialPaymentModal);
    openPaymentMethodStep();
  }

      const DEFAULT_WITHHOLDING_TAX_RATE = 0.01;
  const DEFAULT_WITHHOLDING_VAT_RATE = 0.12;

  function getCurrentWithholdingTaxRate() {
    return DEFAULT_WITHHOLDING_TAX_RATE;
  }

  function getCurrentWithholdingVatRate() {
    return DEFAULT_WITHHOLDING_VAT_RATE;
  }

  function computeWithholdingTaxBreakdown(
    grossAmount,
    taxRate = getCurrentWithholdingTaxRate(),
    vatRate = getCurrentWithholdingVatRate()
  ) {
    const safeGross = round2(num(grossAmount));
    const safeTaxRate = Math.max(0, num(taxRate));
    const safeVatRate = Math.max(0, num(vatRate));

    if (safeGross <= 0 || safeTaxRate <= 0) {
      return {
        grossAmount: safeGross,
        taxRate: safeTaxRate,
        vatRate: safeVatRate,
        taxableBaseAmount: 0,
        withholdingTaxAmount: 0,
        netReceivedAmount: safeGross
      };
    }

    const taxableBaseAmount = round2(safeGross / (1 + safeVatRate));
    const withholdingTaxAmount = round2(taxableBaseAmount * safeTaxRate);
    const netReceivedAmount = round2(Math.max(0, safeGross - withholdingTaxAmount));

    return {
      grossAmount: safeGross,
      taxRate: safeTaxRate,
      vatRate: safeVatRate,
      taxableBaseAmount,
      withholdingTaxAmount,
      netReceivedAmount
    };
  }

  function renderWithholdingTaxUi() {
    const rate = getCurrentWithholdingTaxRate();
    const vatRate = getCurrentWithholdingVatRate();
    const breakdown = computeWithholdingTaxBreakdown(state.paymentDraft?.amount || 0, rate, vatRate);
    const applied = !!el.withholdingTaxAppliedInput?.checked;

    if (el.withholdingTaxRateLabel) {
      el.withholdingTaxRateLabel.textContent = `${round2(rate * 100)}%`;
    }

    if (el.withholdingTaxPreviewBox) {
      if (!state.paymentDraft) {
        el.withholdingTaxPreviewBox.innerHTML = `No payment draft loaded.`;
      } else if (!applied) {
        el.withholdingTaxPreviewBox.innerHTML = `
          Current rate: <strong>${round2(rate * 100)}%</strong><br>
          Formula ready: <strong>Gross / ${round2(1 + vatRate)} × ${round2(rate * 100)}%</strong><br>
          Gross Amount: <strong>${formatPeso(breakdown.grossAmount)}</strong><br>
          If applied now, Withholding Tax would be: <strong>${formatPeso(breakdown.withholdingTaxAmount)}</strong><br>
          Net Received would be: <strong>${formatPeso(breakdown.netReceivedAmount)}</strong>
        `;
      } else {
        el.withholdingTaxPreviewBox.innerHTML = `
          Current rate: <strong>${round2(rate * 100)}%</strong><br>
          Formula used: <strong>${formatPeso(breakdown.grossAmount)} / ${round2(1 + vatRate)} × ${round2(rate * 100)}%</strong><br>
          Tax Base: <strong>${formatPeso(breakdown.taxableBaseAmount)}</strong><br>
          Withholding Tax: <strong>${formatPeso(breakdown.withholdingTaxAmount)}</strong><br>
          Net Received: <strong>${formatPeso(breakdown.netReceivedAmount)}</strong>
        `;
      }
    }

    renderPaymentReviewBox();
  }

    function getPaymentCollectionReceipt(paymentOrDetails) {
    const details = paymentOrDetails && Object.prototype.hasOwnProperty.call(paymentOrDetails, "details")
      ? getPaymentDetailsObject(paymentOrDetails)
      : (paymentOrDetails || {});

    return String(details.collectionReceipt || "").trim();
  }

  function renderPaymentReviewBox() {
    if (!state.paymentDraft) {
      el.paymentReviewBox.innerHTML = "No payment draft prepared.";
      return;
    }

    const customer = getSelectedCustomer();
    const lines = state.paymentDraft.allocations.map((alloc) => {
      const invoice = customer?.invoices.find((inv) => inv.id === alloc.invoiceId);
      return `${invoice ? invoice.invoice_number : "Invoice"}: ${formatPeso(alloc.amount)}`;
    });

    const paymentTypeLabel =
      state.paymentDraft.mode === "full"
        ? "Pay by Invoice"
        : state.paymentDraft.mode === "replacement"
          ? "Replacement Payment"
          : "Allocate Payment";

    const replacementInfo =
      state.paymentDraft.mode === "replacement"
        ? `<br>Replaces Bounced Cheque: <strong>${escapeHtml(state.paymentDraft.replacementOfChequeNumber || "-")}</strong>`
        : "";

        const method = el.paymentMethodSelect.value || "Not selected yet";
    const collectionReceipt = el.collectionReceiptInput?.value.trim() || "Not provided";
    const withholdingApplied = !!el.withholdingTaxAppliedInput?.checked;
    const breakdown = computeWithholdingTaxBreakdown(state.paymentDraft.amount);

    const taxHtml = withholdingApplied
      ? `
        <br>Gross Amount: <strong>${formatPeso(breakdown.grossAmount)}</strong>
        <br>Withholding Tax (${round2(breakdown.taxRate * 100)}%): <strong>${formatPeso(breakdown.withholdingTaxAmount)}</strong>
        <br>Net Received: <strong>${formatPeso(breakdown.netReceivedAmount)}</strong>
      `
      : `
        <br>Gross Amount: <strong>${formatPeso(breakdown.grossAmount)}</strong>
        <br>Withholding Tax: <strong>Not Applied</strong>
      `;

        el.paymentReviewBox.innerHTML = `
      Payment Type: <strong>${paymentTypeLabel}</strong><br>
      Method: <strong>${escapeHtml(method)}</strong><br>
      Collection Receipt (CR): <strong>${escapeHtml(collectionReceipt)}</strong><br>
      Applied To: ${escapeHtml(lines.join(" | "))}${replacementInfo}
      ${taxHtml}
    `;
  }

    const paymentDocumentState = {
    file: null,
    previewUrl: "",
    source: "upload"
  };

  function initPaymentDocumentFlow() {
    const fileInput = document.getElementById("paymentDocumentFileInput");
    const clearBtn = document.getElementById("clearPaymentDocumentBtn");

    if (!fileInput || !clearBtn) return;

    fileInput.addEventListener("change", (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        applyPaymentDocumentFile(file);
      } catch (error) {
        setPaymentDocumentStatus(error.message || "Could not use that file.", true);
        fileInput.value = "";
      }
    });

    clearBtn.addEventListener("click", () => {
      clearPaymentDocumentDraft(true);
    });

    setPaymentDocumentStatus(
      "Optional. Upload one payment proof image. It will be saved to Document Vault after the payment is saved.",
      false
    );
  }

  function applyPaymentDocumentFile(file) {
    const previewWrap = document.getElementById("paymentDocumentPreviewWrap");
    const previewImg = document.getElementById("paymentDocumentPreviewImg");

    AKY_DOCUMENT_UTILS.applyPreviewFile(paymentDocumentState, {
      file,
      previewWrap,
      previewImg,
      source: "upload"
    });

    setPaymentDocumentStatus(
      "Image ready. When you click Finish Payment, this image will also be saved to Document Vault.",
      false
    );
  }

  function clearPaymentDocumentDraft(resetStatus = false) {
    const fileInput = document.getElementById("paymentDocumentFileInput");
    const previewWrap = document.getElementById("paymentDocumentPreviewWrap");
    const previewImg = document.getElementById("paymentDocumentPreviewImg");

    AKY_DOCUMENT_UTILS.resetPreviewState(paymentDocumentState, {
      fileInput,
      previewWrap,
      previewImg,
      source: "upload"
    });

    if (resetStatus) {
      setPaymentDocumentStatus(
        "Optional. Upload one payment proof image. It will be saved to Document Vault after the payment is saved.",
        false
      );
    }
  }

  function setPaymentDocumentStatus(message, isError) {
    const statusBox = document.getElementById("paymentDocumentStatus");
    AKY_DOCUMENT_UTILS.setStatusMessage(statusBox, message, isError);
  }

  function paymentDocumentSafeFileName(fileName) {
    return AKY_DOCUMENT_UTILS.safeStorageFileName(fileName, "payment-proof.png");
  }

  function buildPaymentDocumentMeta(payment, details, method) {
    const rawReference =
      details?.chequeNumber ||
      details?.referenceNumber ||
      details?.bankAccountNumber ||
      payment?.id ||
      "payment";

    const referenceCode = String(rawReference).trim() || "payment";
    const title =
      method === "Cheque"
        ? `Cheque ${referenceCode}`
        : method === "Online"
          ? `Online ${referenceCode}`
          : `Cash Payment ${payment?.payment_date || todayStr()}`;

    return {
      referenceCode,
      title
    };
  }

  async function savePaymentDocumentToVault({ customer, payment, details, method }) {
    if (!paymentDocumentState.file) return false;

    const { data: authData, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !authData?.user?.id) {
      throw new Error("Could not identify the signed-in user for the payment document.");
    }

    const safeOriginalName = paymentDocumentSafeFileName(paymentDocumentState.file.name);
    const storagePath = `${customer.id}/${new Date().toISOString().slice(0, 10)}/payment-${payment.id}-${Date.now()}-${safeOriginalName}`;
    const { referenceCode, title } = buildPaymentDocumentMeta(payment, details, method);

    const { error: uploadError } = await supabaseClient.storage
      .from("customer-documents")
      .upload(storagePath, paymentDocumentState.file, {
        cacheControl: "3600",
        upsert: false,
        contentType: paymentDocumentState.file.type || "image/png"
      });

    if (uploadError) {
      throw new Error(uploadError.message || "Payment document upload failed.");
    }

    const { data: insertedDoc, error: insertError } = await supabaseClient
      .from("customer_documents")
      .insert({
        customer_id: customer.id,
        invoice_id: null,
        payment_id: payment.id,
        origin_screen: "payment_modal",
        category: "payment_proof",
        title,
        reference_code: referenceCode,
        notes: null,
        file_name: paymentDocumentState.file.name,
        mime_type: paymentDocumentState.file.type || "image/png",
        file_size: paymentDocumentState.file.size,
        storage_path: storagePath,
        source: paymentDocumentState.source,
        uploaded_by: authData.user.id
      })
      .select("id")
      .single();

    if (insertError || !insertedDoc?.id) {
      await supabaseClient.storage.from("customer-documents").remove([storagePath]);
      throw new Error(insertError?.message || "Payment document record could not be saved.");
    }

    if (typeof loadCustomerDocuments === "function") {
      await loadCustomerDocuments();
    }

    clearPaymentDocumentDraft(true);
    return true;
  }

  initPaymentDocumentFlow();

    function openPaymentMethodStep() {
    if (!state.paymentDraft) return;

    el.paymentMethodSelect.value = "";
    if (el.collectionReceiptInput) el.collectionReceiptInput.value = "";
    el.chequeNumberInput.value = "";
    el.chequeDateInput.value = todayStr();
    el.chequePostDatedInput.checked = false;
    el.onlineReferenceInput.value = "";
    el.onlinePlatformInput.value = "";
    el.cashBankAccountInput.value = "";
    if (el.withholdingTaxAppliedInput) el.withholdingTaxAppliedInput.checked = false;
    clearPaymentDocumentDraft(true);

    renderPaymentMethodFields();
    renderWithholdingTaxUi();
    openModal(el.paymentMethodModal);
  }

  function renderPaymentMethodFields() {
    const method = el.paymentMethodSelect.value;
    el.chequeNumberWrap.classList.toggle("hidden", method !== "Cheque");
    el.chequeDateWrap.classList.toggle("hidden", method !== "Cheque");
    el.chequePostDatedWrap.classList.toggle("hidden", method !== "Cheque");
    el.onlineReferenceWrap.classList.toggle("hidden", method !== "Online");
    el.onlinePlatformWrap.classList.toggle("hidden", method !== "Online");
    el.cashBankAccountWrap.classList.toggle("hidden", method !== "Cash");
    renderPaymentReviewBox();
  }

  async function savePayment() {
    const customer = getSelectedCustomer();
    if (!customer || !state.paymentDraft) return;
    if (!canCreatePayment()) return;

    const method = el.paymentMethodSelect.value;
    if (!method) return alert("Select a payment method.");

    const isReplacementPayment = state.paymentDraft.mode === "replacement";
    const amount = round2(state.paymentDraft.amount);
    const withholdingApplied = !!el.withholdingTaxAppliedInput?.checked;
    const withholdingBreakdown = computeWithholdingTaxBreakdown(amount);

        const details = {
      collectionReceipt: el.collectionReceiptInput?.value.trim() || null,
      grossReceivedAmount: amount,
      withholdingTaxApplied: withholdingApplied,
      withholdingTaxRate: withholdingApplied ? withholdingBreakdown.taxRate : 0,
      withholdingTaxVatRate: withholdingApplied ? withholdingBreakdown.vatRate : 0,
      withholdingTaxBaseAmount: withholdingApplied ? withholdingBreakdown.taxableBaseAmount : 0,
      withholdingTaxAmount: withholdingApplied ? withholdingBreakdown.withholdingTaxAmount : 0,
      netReceivedAmount: withholdingApplied ? withholdingBreakdown.netReceivedAmount : amount,
      withholdingTaxFormula: withholdingApplied ? "gross / (1 + vat_rate) × tax_rate" : null
    };

    let cleared = true;

    if (method === "Cash") {
      details.bankAccountNumber = el.cashBankAccountInput.value.trim();
      if (!details.bankAccountNumber) return alert("Deposit bank account number is required.");
    }

    if (method === "Online") {
      details.referenceNumber = el.onlineReferenceInput.value.trim();
      details.platformName = el.onlinePlatformInput.value.trim();
      if (!details.referenceNumber) return alert("Online reference number is required.");
      if (!details.platformName) return alert("Platform / bank name is required.");
    }

    if (method === "Cheque") {
      details.chequeNumber = el.chequeNumberInput.value.trim();
      details.chequeDate = el.chequeDateInput.value;
      details.isPostDated = el.chequePostDatedInput.checked;

      if (!details.chequeNumber) return alert("Cheque number is required.");
      if (!details.chequeDate) return alert("Cheque date is required.");

      cleared = false;
    }

    if (isReplacementPayment) {
      details.isReplacementPayment = true;
      details.replacesPaymentId = state.paymentDraft.replacementOfPaymentId || null;
      details.replacementRootPaymentId =
        state.paymentDraft.replacementRootPaymentId ||
        state.paymentDraft.replacementOfPaymentId ||
        null;
      details.replacesChequeNumber = state.paymentDraft.replacementOfChequeNumber || null;
      details.replacementOriginalAmount = state.paymentDraft.replacementOriginalAmount || null;
      details.replacementAppliedAmount = round2(state.paymentDraft.amount || 0);
    }

    const paymentDate = todayStr();

    const paymentType =
      state.paymentDraft.mode === "allocate"
        ? "Partial Payment"
        : "Pay by Invoice";

    const rpcAllocations = state.paymentDraft.allocations.map((alloc) => ({
      invoiceId: alloc.invoiceId,
      amount: round2(alloc.amount)
    }));

    const { data: payment, error: paymentError } = await supabaseClient.rpc("save_payment_fast", {
      p_customer_id: customer.id,
      p_payment_date: paymentDate,
      p_payment_type: paymentType,
      p_method: method,
      p_amount: amount,
      p_details: details,
      p_cleared: cleared,
      p_created_by: state.currentProfile.id,
      p_created_by_name: state.currentProfile.username,
      p_created_by_role: state.currentProfile.role,
      p_allocations: rpcAllocations
    });

    if (paymentError) return alert(paymentError.message);
    if (!payment?.id) return alert("Payment save did not return a payment record.");

    let paymentDocumentSaved = false;
    let paymentDocumentErrorMessage = "";

    try {
      paymentDocumentSaved = await savePaymentDocumentToVault({
        customer,
        payment,
        details,
        method
      });
    } catch (error) {
      paymentDocumentErrorMessage = error.message || "Payment proof image could not be saved.";
      clearPaymentDocumentDraft(true);
    }

    const taxLogText = withholdingApplied
      ? ` | WTax ${formatPeso(details.withholdingTaxAmount)} | Net ${formatPeso(details.netReceivedAmount)}`
      : "";

    const logLabel = isReplacementPayment
      ? `Replacement Payment - ${method} - Gross ${formatPeso(amount)}${taxLogText}`
      : `${payment.payment_type} - ${payment.method} - Gross ${formatPeso(amount)}${taxLogText}`;

    await addLog("Create", "Payment", logLabel, "", null, payment);

    const taxSuccessText = withholdingApplied
      ? ` Withholding tax ${formatPeso(details.withholdingTaxAmount)} and net received ${formatPeso(details.netReceivedAmount)} were stored.`
      : "";

    const successMessage = method === "Cheque"
      ? isReplacementPayment
        ? "Replacement cheque saved as pending clearance. The bounced cheque will stay actionable until this replacement cheque clears."
        : "Cheque payment saved as pending clearance. Invoice balances were not changed."
      : isReplacementPayment
        ? "Replacement payment saved successfully."
        : "Payment saved successfully.";

    const documentSuccessText = paymentDocumentSaved
      ? " Payment proof image was also saved to Document Vault."
      : "";

    const documentErrorText = paymentDocumentErrorMessage
      ? ` Payment was saved, but the proof image was not saved to Document Vault: ${paymentDocumentErrorMessage}`
      : "";

    state.paymentDraft = null;
    closeModal(el.paymentMethodModal);
    await refreshSelectedCustomerOnly();
    alert(successMessage + taxSuccessText + documentSuccessText + documentErrorText);
  }

function renderPaymentTable(customer) {
  el.paymentTableBody.innerHTML = "";
  if (!customer.payments.length) {
    el.paymentTableBody.innerHTML = `<tr><td colspan="8" class="muted">No payments yet.</td></tr>`;
    return;
  }

  customer.payments
    .slice()
    .sort((a, b) => String(b.payment_date).localeCompare(String(a.payment_date)))
    .forEach((payment) => {
      const appliedTo = (payment.allocations || [])
        .map((alloc) => {
          const invoice = getInvoiceById(alloc.invoice_id);
          return `${getInvoiceReferenceLabel(invoice)} (${formatPeso(getAllocationAmount(alloc))})`;
        })
        .join(", ");

      const details = formatPaymentDetails(payment);
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${escapeHtml(payment.payment_date)}</td>
        <td>${escapeHtml(getPaymentTypeLabel(payment))}</td>
        <td>${escapeHtml(payment.method)}</td>
        <td>${details}</td>
        <td>${formatPeso(payment.amount)}</td>
        <td>${escapeHtml(appliedTo || "-")}</td>
        <td>${escapeHtml(payment.created_by_name || "-")}</td>
        <td class="clickable">Details</td>
      `;

      row.querySelector(".clickable")?.addEventListener("click", () => viewPayment(payment.id));
      el.paymentTableBody.appendChild(row);
    });
}

  function renderExecutiveView() {
    if (!canViewExecutive()) return;
    const from = el.execDateFrom.value || null;
    const to = el.execDateTo.value || null;
        const invoices = getActiveInvoices().filter((x) => passesDateFilter(x.invoice_date, from, to));
    const payments = state.payments.filter((x) => passesDateFilter(x.payment_date, from, to));
    const overdueInvoices = invoices.filter((x) => x.balance > 0 && getDaysOpen(x.invoice_date) > 90);
    el.execCustomers.textContent = String(state.customers.length);
    el.execInvoices.textContent = String(invoices.length);
    el.execInvoiced.textContent = formatCompactPeso(
  invoices.reduce((sum, x) => sum + Number(x.total || 0), 0)
);

el.execCollected.textContent = formatCompactPeso(
  getOperationalCollectedAmount(null, from, to)
);
el.execOutstanding.textContent = formatCompactPeso(
  invoices.reduce((sum, x) => sum + Number(x.balance || 0), 0)
);
    el.execOverdue.textContent = String(overdueInvoices.length);

    el.agingTableBody.innerHTML = "";
    if (!overdueInvoices.length) {
      el.agingTableBody.innerHTML = `<tr><td colspan="7" class="muted">No 90+ day overdue invoices.</td></tr>`;
      return;
    }
    overdueInvoices
  .sort((a, b) => getDaysOpen(b.invoice_date) - getDaysOpen(a.invoice_date))
  .forEach((invoice) => {
    const customer = getCustomerById(invoice.customer_id);
    const tbv = getPendingTbvByInvoiceId(invoice.id);
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHtml(customer?.name || "-")}</td>
      <td>${escapeHtml(invoice.invoice_number)}</td>
      <td>${escapeHtml(invoice.invoice_date)}</td>
      <td>${getDaysOpen(invoice.invoice_date)}</td>
      <td>${formatPeso(invoice.balance)}</td>
      <td>${statusPill(invoice.status)}</td>
      <td>${tbv ? `<span class="notice-pill notice-postdated">PENDING</span>` : "-"}</td>
    `;

    el.agingTableBody.appendChild(row);
  });
  }

  function ensurePostDatedChequesPanel() {
    let body = document.getElementById("postDatedChequesBody");
    if (body) return body;

    const panel = document.createElement("div");
    panel.className = "panel";
    panel.id = "postDatedChequesPanel";
    panel.innerHTML = `
      <h3 class="panel-title">Post-Dated Cheques</h3>
      <div class="table-wrap">
        <table class="records-table">
          <thead>
            <tr>
              <th>Cheque Date</th>
              <th>Customer</th>
              <th>Cheque #</th>
              <th>Amount</th>
              <th>Applied To</th>
              <th>Open Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="postDatedChequesBody"></tbody>
        </table>
      </div>
    `;

    const overduePanel = el.notificationsOverdueBody?.closest(".panel");
    if (overduePanel && overduePanel.parentNode === el.notificationsView) {
      el.notificationsView.insertBefore(panel, overduePanel);
    } else {
      el.notificationsView.appendChild(panel);
    }

    body = panel.querySelector("#postDatedChequesBody");
    return body;
  }
        async function markChequeCleared(paymentId) {
  if (!ensureChequeActionAllowed(canClearCheque, "You do not have permission to clear cheques.")) return;

  const payment = state.payments.find((p) => p.id === paymentId);
  if (!payment) return alert("Cheque payment not found.");

  const status = getChequeStatus(payment);
  if (status !== "Pending") return alert("Only pending cheques can be cleared.");

  const confirmed = window.confirm("Mark this cheque as cleared?");
  if (!confirmed) return;

  const { data, error } = await supabaseClient.rpc("clear_cheque_payment", {
    p_payment_id: paymentId
  });

  if (error) return alert(error.message);

  await refreshWorkflowViewsOnly(payment.customer_id || data?.customer_id || null);
  alert("Cheque marked as cleared.");
}

    async function markChequeBounced(paymentId) {
  if (!ensureChequeActionAllowed(canBounceCheque, "You do not have permission to bounce cheques.")) return;

  const payment = state.payments.find((p) => p.id === paymentId);
  if (!payment) return alert("Cheque payment not found.");

  const status = getChequeStatus(payment);
  if (status !== "Pending") return alert("Only pending cheques can be marked as bounced.");

  const reason = window.prompt("Enter bounce reason:", "Insufficient funds");
  if (reason === null) return;

  const { data, error } = await supabaseClient.rpc("bounce_cheque_payment", {
    p_payment_id: paymentId,
    p_reason: reason.trim() || "No reason provided"
  });

  if (error) return alert(error.message);

  await refreshWorkflowViewsOnly(payment.customer_id || data?.customer_id || null);
  alert("Cheque marked as bounced.");
}
  function getPaymentDetailsObject(payment) {
    const raw = payment?.details;

    if (!raw) return {};

    if (typeof raw === "string") {
      try {
        return JSON.parse(raw);
      } catch (error) {
        return {};
      }
    }

    if (typeof raw === "object" && !Array.isArray(raw)) {
      return raw;
    }

    return {};
  }

    function isReplacementPaymentEffective(payment) {
    if (!payment) return false;

    if (payment.method === "Cheque") {
      return payment.cleared === true && getChequeStatus(payment) === "Cleared";
    }

    return true;
  }

  function getReplacementStateForBouncedCheque(bouncedPayment) {
    const originalItems = (bouncedPayment?.allocations || [])
      .map((alloc) => ({
        invoiceId: alloc.invoice_id,
        originalAmount: round2(getAllocationAmount(alloc))
      }))
      .filter((item) => item.originalAmount > 0);

    const originalTotal = round2(
      originalItems.reduce((sum, item) => sum + item.originalAmount, 0)
    );

    const replacementChildrenByParent = new Map();

    state.payments.forEach((payment) => {
      const details = getPaymentDetailsObject(payment);
      if (details.isReplacementPayment === true && details.replacesPaymentId) {
        const parentId = details.replacesPaymentId;
        if (!replacementChildrenByParent.has(parentId)) {
          replacementChildrenByParent.set(parentId, []);
        }
        replacementChildrenByParent.get(parentId).push(payment);
      }
    });

    const allLinkedReplacementPayments = [];
    const visitedPaymentIds = new Set();
    const stack = [bouncedPayment.id];

    while (stack.length) {
      const parentPaymentId = stack.pop();
      const children = replacementChildrenByParent.get(parentPaymentId) || [];

      children.forEach((payment) => {
        if (visitedPaymentIds.has(payment.id)) return;
        visitedPaymentIds.add(payment.id);
        allLinkedReplacementPayments.push(payment);
        stack.push(payment.id);
      });
    }

    const replacedByInvoice = new Map();

    allLinkedReplacementPayments
      .filter(isReplacementPaymentEffective)
      .forEach((payment) => {
        (payment.allocations || []).forEach((alloc) => {
          const amount = round2(getAllocationAmount(alloc));
          const current = round2(replacedByInvoice.get(alloc.invoice_id) || 0);
          replacedByInvoice.set(alloc.invoice_id, round2(current + amount));
        });
      });

    const remainingItems = originalItems
      .map((item) => {
        const invoice = state.invoices.find((inv) => inv.id === item.invoiceId);
        const alreadyReplaced = round2(replacedByInvoice.get(item.invoiceId) || 0);
        const remainingAmount = round2(Math.max(0, item.originalAmount - alreadyReplaced));

        return {
          invoice,
          invoiceId: item.invoiceId,
          originalAmount: item.originalAmount,
          alreadyReplaced,
          remainingAmount
        };
      })
      .filter((item) => item.invoice && item.remainingAmount > 0);

    const remainingTotal = round2(
      remainingItems.reduce((sum, item) => sum + item.remainingAmount, 0)
    );

    return {
      originalTotal,
      remainingTotal,
      remainingItems,
      isFullyReplaced: remainingTotal <= 0,
      isPartiallyReplaced: remainingTotal > 0 && remainingTotal < originalTotal,
      buttonLabel:
        remainingTotal <= 0
          ? "Replacement Recorded"
          : remainingTotal < originalTotal
            ? "Record Remaining Replacement"
            : "Record Replacement"
    };
  }

  function getPaymentTypeLabel(payment) {
    const details = getPaymentDetailsObject(payment);
    if (details.isReplacementPayment) return "Replacement Payment";
    return payment.payment_type || "-";
  }
    function isOperationallyCollectedPayment(payment) {
    if (!payment) return false;

    if (payment.method === "Cheque") {
      return payment.cleared === true && getChequeStatus(payment) === "Cleared";
    }

    return payment.cleared !== false;
  }

  function getOperationalCollectedAmount(customerId = null, paymentDateFrom = null, paymentDateTo = null) {
    return round2(
      state.allocations.reduce((sum, alloc) => {
        const payment = state.payments.find((p) => p.id === alloc.payment_id);
        const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);

        if (!payment || !invoice) return sum;
        if (customerId && payment.customer_id !== customerId) return sum;
        if (customerId && invoice.customer_id !== customerId) return sum;
        if (isVoidedInvoice(invoice)) return sum;
        if (!isOperationallyCollectedPayment(payment)) return sum;

        if ((paymentDateFrom || paymentDateTo) && !passesDateFilter(payment.payment_date, paymentDateFrom, paymentDateTo)) {
          return sum;
        }

        return round2(sum + getAllocationAmount(alloc));
      }, 0)
    );
  }
            function startChequeReplacement(paymentId) {
    if (!ensureChequeActionAllowed(canReplaceBouncedCheque, "You do not have permission to record replacement cheques.")) return;

    const bouncedPayment = state.payments.find((p) => p.id === paymentId);
    if (!bouncedPayment) return alert("Bounced cheque payment not found.");

    if (getChequeStatus(bouncedPayment) !== "Bounced") {
      return alert("Only bounced cheques can use replacement flow.");
    }

    const replacementState = getReplacementStateForBouncedCheque(bouncedPayment);
    if (replacementState.isFullyReplaced) {
      return alert("This bounced cheque is already fully replaced.");
    }

    const customer = state.customers.find((c) => c.id === bouncedPayment.customer_id);
    if (!customer) return alert("Customer not found.");

        const bouncedDetails = getPaymentDetailsObject(bouncedPayment);
    const replacementRootPaymentId =
      bouncedDetails.replacementRootPaymentId || bouncedPayment.id;

    state.selectedCustomerId = customer.id;
    renderCustomerList();
    renderCurrentCustomerDashboard();
    setView("customers");

        state.paymentDraft = {
      mode: "replacement",
      amount: replacementState.remainingTotal,
      allocations: replacementState.remainingItems.map((item) => ({
        invoiceId: item.invoiceId,
        amount: item.remainingAmount
      })),
      replacementOfPaymentId: bouncedPayment.id,
      replacementRootPaymentId: replacementRootPaymentId,
      replacementOfChequeNumber: bouncedDetails.chequeNumber || "",
      replacementOriginalAmount: replacementState.originalTotal,
      replacementRemainingAmount: replacementState.remainingTotal
    };

    closeModal(el.paymentTypeModal);
    closeModal(el.invoiceSelectionModal);
    closeModal(el.partialPaymentModal);

    openPaymentMethodStep();
  }
      function renderChequeRegisterView() {
    if (!el.chequeRegisterTableBody) return;

    const entries = getChequeRegisterEntries();
    el.chequeRegisterTableBody.innerHTML = "";

        if (!entries.length) {
      el.chequeRegisterTableBody.innerHTML = `<tr><td colspan="10" class="muted">No cheque payments found.</td></tr>`;
      return;
    }

    entries.forEach((entry) => {
      const { payment, details, customer, status, appliedTo } = entry;
      const row = document.createElement("tr");

      let statusHtml = "-";
      if (status === "Cleared") {
        statusHtml = `<span class="status-pill status-paid">Cleared</span>`;
      } else if (status === "Bounced") {
        statusHtml = `<span class="notice-pill notice-pending">Bounced</span>`;
      } else {
        statusHtml = `<span class="notice-pill notice-postdated">Pending</span>`;
      }

            let actionHtml = `<span class="muted">View only</span>`;

      if (status === "Pending") {
        const actionButtons = [];

        if (canClearCheque()) {
          actionButtons.push(`<button class="btn btn-primary action-clear-cheque">Clear</button>`);
        }

        if (canBounceCheque()) {
          actionButtons.push(`<button class="btn btn-danger action-bounce-cheque">Bounce</button>`);
        }

        actionHtml = actionButtons.length
          ? `<div class="row-actions">${actionButtons.join("")}</div>`
          : `<span class="muted">View only</span>`;
      } else if (status === "Bounced") {
        const replacementState = getReplacementStateForBouncedCheque(payment);

        if (replacementState.isFullyReplaced) {
          actionHtml = `<span class="muted">Replacement Recorded</span>`;
        } else if (canReplaceBouncedCheque()) {
          actionHtml = `
            <div class="row-actions">
              <button class="btn btn-secondary action-replace-cheque">${escapeHtml(replacementState.buttonLabel)}</button>
            </div>
          `;
        } else {
          actionHtml = `<span class="muted">${escapeHtml(replacementState.buttonLabel)}</span>`;
        }
      } else if (canManageChequeRegister()) {
        actionHtml = `<span class="muted">Completed</span>`;
      }

            row.innerHTML = `
        <td>${escapeHtml(payment.payment_date || "-")}</td>
        <td>${escapeHtml(customer?.name || "-")}</td>
        <td>${escapeHtml(details.chequeNumber || "-")}</td>
        <td>${escapeHtml(details.chequeDate || "-")}</td>
        <td>${escapeHtml(getPaymentCollectionReceipt(details) || "-")}</td>
        <td>${formatPeso(payment.amount)}</td>
        <td>${escapeHtml(appliedTo || "-")}</td>
        <td>${statusHtml}</td>
        <td>${escapeHtml(payment.created_by_name || "-")}</td>
        <td>${actionHtml}</td>
      `;

      row.querySelector(".action-clear-cheque")?.addEventListener("click", () => markChequeCleared(payment.id));
      row.querySelector(".action-bounce-cheque")?.addEventListener("click", () => markChequeBounced(payment.id));
      row.querySelector(".action-replace-cheque")?.addEventListener("click", () => startChequeReplacement(payment.id));

      el.chequeRegisterTableBody.appendChild(row);
    });
  }
    function getFilteredTbvRows() {
  const statusFilter = el.notificationTbvStatusFilter?.value || "";
  const invoiceSearch = (el.notificationTbvInvoiceSearch?.value || "").trim().toLowerCase();

  return state.tbvs
    .slice()
    .sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))
    .map((tbv) => {
      const invoice = getInvoiceById(tbv.invoice_id);
      const customer = getCustomerById(invoice?.customer_id);
      const requestedByRole = capitalizeRole(tbv.requested_by_role || "");
      const requestedByDisplay = tbv.requested_by_name
        ? (requestedByRole ? `${tbv.requested_by_name} (${requestedByRole})` : tbv.requested_by_name)
        : "-";

      return {
        tbvId: tbv.id,
        createdAtDisplay: tbv.created_at ? formatDateTime(tbv.created_at) : "-",
        customerName: customer?.name || "-",
        invoiceNumber: invoice?.invoice_number || "-",
        invoiceStatusText: invoice?.status || "-",
        invoiceStatusHtml: invoice ? statusPill(invoice.status) : "-",
        requestedByDisplay,
        explanation: tbv.explanation || "-",
        tbvStatus: tbv.status || "-",
        decisionDateDisplay: tbv.decided_at ? formatDateTime(tbv.decided_at) : "-",
        decidedBy: tbv.decided_by_name || "-",
        decisionNotes: tbv.decision_notes || "-",
        canReview: tbv.status === "PENDING" && canApproveTbv()
      };
    })
    .filter((row) => {
      if (statusFilter && row.tbvStatus !== statusFilter) return false;
      if (invoiceSearch && !String(row.invoiceNumber || "").toLowerCase().includes(invoiceSearch)) return false;
      return true;
    });
}

  function renderTbvRequestsTable() {
    if (!el.tbvTableBody) return;

    const rows = getFilteredTbvRows();
    el.tbvTableBody.innerHTML = "";

    if (!rows.length) {
      el.tbvTableBody.innerHTML = `<tr><td colspan="11" class="muted">No TBV requests found.</td></tr>`;
      return;
    }

    rows.forEach((rowData) => {
      const row = document.createElement("tr");
      const actionHtml = rowData.canReview
        ? `<button class="btn btn-light action-decide-tbv">Review</button>`
        : "-";

      row.innerHTML = `
        <td>${escapeHtml(rowData.createdAtDisplay)}</td>
        <td>${escapeHtml(rowData.customerName)}</td>
        <td>${escapeHtml(rowData.invoiceNumber)}</td>
        <td>${rowData.invoiceStatusHtml}</td>
        <td>${escapeHtml(rowData.requestedByDisplay)}</td>
        <td>${escapeHtml(rowData.explanation)}</td>
        <td>${escapeHtml(rowData.tbvStatus)}</td>
        <td>${escapeHtml(rowData.decisionDateDisplay)}</td>
        <td>${escapeHtml(rowData.decidedBy)}</td>
        <td>${escapeHtml(rowData.decisionNotes)}</td>
        <td>${actionHtml}</td>
      `;

      row.querySelector(".action-decide-tbv")?.addEventListener("click", () => openTbvDecisionModal(rowData.tbvId));
      el.tbvTableBody.appendChild(row);
    });
  }

  function renderNotificationsView() {
    if (!canViewNotifications()) return;
    renderTbvRequestsTable();
    el.notificationsOverdueBody.innerHTML = "";

    const postDatedChequesBody = ensurePostDatedChequesPanel();
    postDatedChequesBody.innerHTML = "";

    const postDatedCheques = getPostDatedChequeEntries();
    if (!postDatedCheques.length) {
      postDatedChequesBody.innerHTML = `<tr><td colspan="7" class="muted">No post-dated cheque follow-ups.</td></tr>`;
    } else {
      postDatedCheques.forEach((entry) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${escapeHtml(entry.details.chequeDate || "-")}</td>
          <td>${escapeHtml(entry.customer?.name || "-")}</td>
          <td>${escapeHtml(entry.details.chequeNumber || "-")}</td>
          <td>${formatPeso(entry.payment.amount)}</td>
          <td>${escapeHtml(entry.invoiceNumbers.join(", ") || "-")}</td>
          <td>${formatPeso(entry.openBalance)}</td>
          <td>${
  entry.details.chequeDate <= todayStr()
    ? `<span class="notice-pill notice-pending">Due for Deposit</span>`
    : `<span class="notice-pill notice-postdated">Upcoming</span>`
}</td>
        `;
        postDatedChequesBody.appendChild(row);
      });
    }

    const overdue = getActiveInvoices().filter((x) => x.balance > 0 && getDaysOpen(x.invoice_date) > 90);
    if (!overdue.length) {
      el.notificationsOverdueBody.innerHTML = `<tr><td colspan="5" class="muted">No overdue invoices.</td></tr>`;
    } else {
      overdue.forEach((invoice) => {
  const customer = getCustomerById(invoice.customer_id);
  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${escapeHtml(customer?.name || "-")}</td>
    <td>${escapeHtml(invoice.invoice_number)}</td>
    <td>${escapeHtml(invoice.invoice_date)}</td>
    <td>${getDaysOpen(invoice.invoice_date)}</td>
    <td>${formatPeso(invoice.balance)}</td>
  `;

  el.notificationsOverdueBody.appendChild(row);
});
    }
  }

    function buildCustomerFilterOptionsHtml() {
    return `<option value="">All Customers</option>` + state.customers
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`)
      .join("");
  }

  function openTbvModal(invoiceId) {
    if (!canRequestTbv()) return;
    const invoice = state.invoices.find((x) => x.id === invoiceId);
    const customer = state.customers.find((c) => c.id === invoice?.customer_id);
        if (!invoice) return;
    if (!canEditInvoiceRecord(invoice)) {
      return alert("Admin cannot edit partially paid or paid invoices.");
    }
    state.selectedInvoiceForTbv = invoiceId;
    el.tbvExplanationInput.value = "";
    el.tbvInvoiceInfo.innerHTML = `Customer: <strong>${escapeHtml(customer?.name || "-")}</strong><br>Invoice #: <strong>${escapeHtml(invoice.invoice_number)}</strong><br>Balance: <strong>${formatPeso(invoice.balance)}</strong>`;
    openModal(el.tbvModal);
  }

  async function saveTbvRequest() {
    if (!canRequestTbv()) return;
    const invoiceId = state.selectedInvoiceForTbv;
    const explanation = el.tbvExplanationInput.value.trim();
    if (!invoiceId) return;
    if (!explanation) return alert("Explanation is required.");
    const existingPending = state.tbvs.find((t) => t.invoice_id === invoiceId && t.status === "PENDING");
    if (existingPending) return alert("This invoice already has a pending TBV request.");
    const user = getCurrentUser();
    const invoice = state.invoices.find((x) => x.id === invoiceId);
  const { error } = await supabaseClient.rpc("create_invoice_void_request", {
  p_invoice_id: invoiceId,
  p_explanation: explanation
});
    if (error) return alert(error.message);
    await addLog("Create", "TBV Request", invoice?.invoice_number || "Invoice", explanation, null, { invoice_id: invoiceId, explanation });
    closeModal(el.tbvModal);
    state.selectedInvoiceForTbv = null;
        await refreshWorkflowViewsOnly(invoice?.customer_id || null);
    alert("TBV request submitted.");
  }

  function openTbvDecisionModal(tbvId) {
    if (!canApproveTbv()) return;
    const tbv = state.tbvs.find((t) => t.id === tbvId);
    const invoice = state.invoices.find((i) => i.id === tbv?.invoice_id);
    const customer = state.customers.find((c) => c.id === invoice?.customer_id);
    if (!tbv) return;
    state.selectedTbvForDecision = tbvId;
    el.tbvDecisionNotesInput.value = "";
        el.tbvDecisionInfo.innerHTML = `
      Customer: <strong>${escapeHtml(customer?.name || "-")}</strong><br>
      Invoice #: <strong>${escapeHtml(invoice?.invoice_number || "-")}</strong><br>
      Invoice Status: ${invoice ? statusPill(invoice.status) : "-"}<br>
      Explanation: <strong>${escapeHtml(tbv.explanation)}</strong>
    `;
    openModal(el.tbvDecisionModal);
  }

  async function decideTbv(decision) {
  if (!canApproveTbv()) return;

  const tbvId = state.selectedTbvForDecision;
  if (!tbvId) return;

  const tbv = state.tbvs.find((t) => t.id === tbvId);
  if (!tbv) return;

  const invoice = state.invoices.find((i) => i.id === tbv.invoice_id);
  const notes = el.tbvDecisionNotesInput.value.trim();

  const { data, error } = await supabaseClient.rpc("decide_tbv", {
    p_tbv_id: tbvId,
    p_decision: decision,
    p_notes: notes || null
  });

  if (error) return alert(error.message);

  closeModal(el.tbvDecisionModal);
  state.selectedTbvForDecision = null;
  await refreshWorkflowViewsOnly(invoice?.customer_id || data?.customer_id || null);
  alert(`TBV ${decision === "APPROVED" ? "approved" : "denied"} successfully.`);
}
function autofillSoaPaymentRange() {
  const asOfDate = el.soaAsOfDate.value;
  if (!asOfDate) return;

  const end = new Date(asOfDate);
  const start = new Date(asOfDate);
  start.setDate(start.getDate() - 30);

  el.soaPaymentsTo.value = asOfDate;
  el.soaPaymentsFrom.value = start.toISOString().slice(0, 10);
}

function renderSoaPaymentRangeVisibility() {
  const showPayments = !!el.soaShowPayments.checked;
  el.soaPaymentRangeWrap.classList.toggle("hidden", !showPayments);
}

function getSoaInvoiceParticularsItems(invoice) {
  if (!Array.isArray(invoice?.items)) return [];

  return invoice.items.filter((item) => {
    if (!item) return false;

    const hasProductName = String(item.product_name || "").trim() !== "";
    const hasQty = item.qty !== null && item.qty !== undefined && item.qty !== "";
    const hasUnitPrice = item.unit_price !== null && item.unit_price !== undefined && item.unit_price !== "";

    return hasProductName || hasQty || hasUnitPrice;
  });
}

function renderSoaInvoiceParticularsRow(invoice) {
  const items = getSoaInvoiceParticularsItems(invoice);

  const itemsHtml = items.length
    ? items.map((item) => `
        <tr>
          <td>${escapeHtml(item.product_name || "-")}</td>
          <td>${formatNumber(item.qty)}</td>
          <td>${formatPeso(item.unit_price)}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="3">No invoice particulars found.</td></tr>`;

  return `
    <tr class="soa-particulars-row">
      <td colspan="8">
        <div class="soa-particulars-wrap">
          <strong class="soa-particulars-title">Invoice Particulars</strong>
          <table class="soa-particulars-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price / Qty</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
        </div>
      </td>
    </tr>
  `;
}

function openSoaModal() {
  if (!canGenerateSoa()) return;

  const customer = getSelectedCustomer();
  if (!customer) return alert("Please select a customer first.");

  el.soaPreparedBy.value = state.currentProfile?.username || state.currentProfile?.email || "";
  el.soaAsOfDate.value = todayStr();
  el.soaShowPayments.checked = true;
  el.soaShowInvoiceParticulars.checked = false;

  autofillSoaPaymentRange();
  renderSoaPaymentRangeVisibility();

  openModal(el.soaModal);
}

function generateSoa() {
  const customer = getSelectedCustomer();
  if (!customer) return;

  const preparedBy = el.soaPreparedBy.value.trim();
  const asOfDate = el.soaAsOfDate.value;
  const showPayments = el.soaShowPayments.checked;
  const showInvoiceParticulars = el.soaShowInvoiceParticulars.checked;

  if (!preparedBy) return alert("Prepared By is required.");
  if (!asOfDate) return alert("As of Date is required.");

  const outstandingInvoices = customer.invoices
    .filter((invoice) => invoice.balance > 0 && invoice.invoice_date <= asOfDate)
    .sort((a, b) => String(a.invoice_date).localeCompare(String(b.invoice_date)));

  const previousPayments = customer.payments
    .filter((payment) => payment.payment_date <= asOfDate)
    .sort((a, b) => String(a.payment_date).localeCompare(String(b.payment_date)));

  const totalOutstanding = outstandingInvoices.reduce((sum, invoice) => sum + Number(invoice.balance || 0), 0);

  const outstandingInvoicesHtml = outstandingInvoices.length
    ? outstandingInvoices.map((invoice) => `
        <tr>
          <td>${escapeHtml(invoice.invoice_date)}</td>
          <td>${escapeHtml(invoice.invoice_number)}</td>
          <td>${escapeHtml(invoice.po_number || "-")}</td>
          <td>${escapeHtml(invoice.reference_info || "-")}</td>
          <td>${formatPeso(invoice.total)}</td>
          <td>${formatPeso(invoice.paidAmount)}</td>
          <td>${formatPeso(invoice.balance)}</td>
          <td>${escapeHtml(invoice.status)}</td>
        </tr>
        ${showInvoiceParticulars ? renderSoaInvoiceParticularsRow(invoice) : ""}
      `).join("")
    : `<tr><td colspan="8">No outstanding invoices.</td></tr>`;

  const previousPaymentsHtml = previousPayments.length
    ? previousPayments.map((payment) => `
        <tr>
          <td>${escapeHtml(payment.payment_date)}</td>
          <td>${escapeHtml(payment.payment_type)}</td>
          <td>${escapeHtml(payment.method)}</td>
          <td>${formatPeso(payment.amount)}</td>
          <td>${formatPaymentDetails(payment)}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="5">No previous payments found.</td></tr>`;

  const html = `
    <html><head><title>Statement of Account</title><style>
    body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
    .header { text-align: center; margin-bottom: 20px; line-height: 1.5; }
    .header strong { font-size: 18px; }
    h2 { text-align: center; margin: 20px 0; }
    h3 { margin: 18px 0 10px; }
    .meta { margin-bottom: 18px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 18px; }
    th, td { border: 1px solid #cfcfcf; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f4f4f4; }
    .soa-particulars-row > td { background: #fafafa; padding: 10px; }
    .soa-particulars-wrap { margin: 0; }
    .soa-particulars-title { display: inline-block; margin-bottom: 8px; font-size: 12px; }
    .soa-particulars-table { width: 100%; margin: 0; font-size: 11px; }
    .soa-particulars-table th,
    .soa-particulars-table td { border: 1px solid #d8d8d8; padding: 6px; }
    .total { text-align: right; font-weight: bold; margin-top: 10px; }
    .signatures { margin-top: 50px; display: flex; justify-content: space-between; gap: 40px; }
    .sigbox { width: 45%; }
    .line { margin-top: 45px; border-top: 1px solid #111; padding-top: 6px; }
    </style></head><body>
    <div class="header"><strong>AKY GROUP OF COMPANIES, INC.</strong><br>Sitio Bantud, Brgy. Manoc-Manoc Boracay Malay, Aklan<br>Tel. (036) 288-4218 / 288-5369<br>E-mail address: akygroupofcompaniesinc@gmail.com</div>
    <h2>STATEMENT OF ACCOUNT</h2>
    <div class="meta"><strong>Customer:</strong> ${escapeHtml(customer.name)}<br><strong>As of Date:</strong> ${escapeHtml(asOfDate)}</div>
    <table>
      <thead>
        <tr>
          <th>Invoice Date</th>
          <th>Invoice #</th>
          <th>PO #</th>
          <th>Reference</th>
          <th>Total Amount</th>
          <th>Paid</th>
          <th>Outstanding</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${outstandingInvoicesHtml}</tbody>
    </table>
    ${showPayments ? `<h3>Previous Payments</h3><table><thead><tr><th>Payment Date</th><th>Type</th><th>Method</th><th>Amount</th><th>Details</th></tr></thead><tbody>${previousPaymentsHtml}</tbody></table>` : ""}
    <div class="total">TOTAL OUTSTANDING: ${formatPeso(totalOutstanding)}</div>
    <div class="signatures"><div class="sigbox"><div><strong>Prepared by:</strong> ${escapeHtml(preparedBy)}</div></div><div class="sigbox"><div class="line">Received by:</div></div></div>
    <script>window.onload = () => window.print();<\/script></body></html>`;

  closeModal(el.soaModal);
  openPrintWindow(html);
}
function toggleLogSort(field) {
  if (!field) return;

  if (state.logSortField === field) {
    state.logSortDirection = state.logSortDirection === "asc" ? "desc" : "asc";
  } else {
    state.logSortField = field;
    state.logSortDirection = field === "created_at" ? "desc" : "asc";
  }

  renderLogs();
}

function getSortedLogs() {
  const logs = [...state.logs];
  const field = state.logSortField || "created_at";
  const direction = state.logSortDirection === "asc" ? 1 : -1;

  return logs.sort((a, b) => {
    if (field === "created_at") {
      const aTime = new Date(a.created_at || 0).getTime();
      const bTime = new Date(b.created_at || 0).getTime();
      return (aTime - bTime) * direction;
    }

    const aValue = String(a?.[field] ?? "").toLowerCase();
    const bValue = String(b?.[field] ?? "").toLowerCase();
    return aValue.localeCompare(bValue) * direction;
  });
}

function renderLogSortIndicators() {
  ["created_at", "username", "role", "action", "entity"].forEach((field) => {
    const indicator = document.getElementById(`logSort-${field}`);
    if (!indicator) return;

    if (state.logSortField === field) {
      indicator.textContent = state.logSortDirection === "asc" ? " ▲" : " ▼";
    } else {
      indicator.textContent = "";
    }
  });
}
  function renderLogs() {
  if (!canViewLogs()) return;

  renderLogSortIndicators();
  el.logTableBody.innerHTML = "";

  if (!state.logs.length) {
    el.logTableBody.innerHTML = `<tr><td colspan="7" class="muted">No log entries yet.</td></tr>`;
    return;
  }

  const logs = getSortedLogs();

  logs.forEach((log) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${formatDateTime(log.created_at)}</td>
      <td>${escapeHtml(log.username || "-")}</td>
      <td>${escapeHtml(capitalizeRole(log.role || "-"))}</td>
      <td>${escapeHtml(log.action || "-")}</td>
      <td>${escapeHtml(log.entity || "-")}</td>
      <td>${escapeHtml(log.details || "-")}</td>
      <td>${escapeHtml(log.explanation || "-")}</td>
    `;
    el.logTableBody.appendChild(row);
  });
}
  
  async function addLog(action, entity, details, explanation, oldData, newData) {
  const { error } = await supabaseClient.rpc("append_activity_log", {
    p_action: action,
    p_entity: entity,
    p_details: details || "",
    p_explanation: explanation || "",
    p_old_data: oldData || null,
    p_new_data: newData || null
  });

  if (error) {
    console.error("[AKY] append_activity_log failed.", error);
  }
}

      async function refreshCustomerData(customerId) {
    if (!customerId) return;

    const previousInvoiceIds = state.invoices
      .filter((invoice) => invoice.customer_id === customerId)
      .map((invoice) => invoice.id);

    const previousPaymentIds = state.payments
      .filter((payment) => payment.customer_id === customerId)
      .map((payment) => payment.id);

    const [customerRes, contactsRes, invoicesRes, paymentsRes] = await Promise.all([
      supabaseClient.from("customers").select("*").eq("id", customerId).maybeSingle(),
      supabaseClient.from("customer_contacts").select("*").eq("customer_id", customerId).order("created_at", { ascending: true }),
      supabaseClient.from("invoices").select("*").eq("customer_id", customerId).order("invoice_date", { ascending: false }),
      supabaseClient.from("payments").select("*").eq("customer_id", customerId).order("payment_date", { ascending: false })
    ]);

    if (customerRes.error) return alert(customerRes.error.message);
    if (contactsRes.error) return alert(contactsRes.error.message);
    if (invoicesRes.error) return alert(invoicesRes.error.message);
    if (paymentsRes.error) return alert(paymentsRes.error.message);

    const freshInvoices = invoicesRes.data || [];
    const freshPayments = paymentsRes.data || [];
    const freshInvoiceIds = freshInvoices.map((invoice) => invoice.id);
    const freshPaymentIds = freshPayments.map((payment) => payment.id);

    const [invoiceItemsRes, allocationsRes, tbvsRes] = await Promise.all([
      freshInvoiceIds.length
        ? supabaseClient.from("invoice_items").select("*").in("invoice_id", freshInvoiceIds).order("created_at", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      freshPaymentIds.length
        ? supabaseClient.from("payment_allocations").select("*").in("payment_id", freshPaymentIds)
        : Promise.resolve({ data: [], error: null }),
      freshInvoiceIds.length
        ? supabaseClient.from("invoice_void_requests").select("*").in("invoice_id", freshInvoiceIds).order("created_at", { ascending: false })
        : Promise.resolve({ data: [], error: null })
    ]);

    if (invoiceItemsRes.error) return alert(invoiceItemsRes.error.message);
    if (allocationsRes.error) return alert(allocationsRes.error.message);
    if (tbvsRes.error) return alert(tbvsRes.error.message);

    const invoiceIdsToReplace = new Set([...previousInvoiceIds, ...freshInvoiceIds]);
    const paymentIdsToReplace = new Set([...previousPaymentIds, ...freshPaymentIds]);

    state.customers = state.customers.filter((customer) => customer.id !== customerId);
    if (customerRes.data) {
      state.customers.push(customerRes.data);
    }

    state.contacts = state.contacts
      .filter((contact) => contact.customer_id !== customerId)
      .concat(contactsRes.data || []);

    state.invoices = state.invoices
      .filter((invoice) => invoice.customer_id !== customerId)
      .concat(freshInvoices);

    state.invoiceItems = state.invoiceItems
      .filter((item) => !invoiceIdsToReplace.has(item.invoice_id))
      .concat(invoiceItemsRes.data || []);

    state.payments = state.payments
      .filter((payment) => payment.customer_id !== customerId)
      .concat(freshPayments);

    state.allocations = state.allocations
      .filter((alloc) => !paymentIdsToReplace.has(alloc.payment_id))
      .concat(allocationsRes.data || []);

    state.tbvs = state.tbvs
      .filter((tbv) => !invoiceIdsToReplace.has(tbv.invoice_id))
      .concat(tbvsRes.data || []);

    hydrateData();
    populateReportCustomerFilter();
  }

  async function refreshSelectedCustomerOnly() {
    const customerId = state.selectedCustomerId;

    if (!customerId) {
      await loadAllData();
      renderCustomerList();
      renderCurrentCustomerDashboard();
      return;
    }

    await refreshCustomerData(customerId);
    renderCustomerList();
    renderCurrentCustomerDashboard();
  }

  async function refreshWorkflowViewsOnly(customerId = null) {
    const targetCustomerId = customerId || state.selectedCustomerId || null;

    if (targetCustomerId) {
      await refreshCustomerData(targetCustomerId);
    }

    const { data: logsData, error: logsError } = await supabaseClient
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);

    if (logsError) return alert(logsError.message);

    state.logs = logsData || [];

    renderCustomerList();

    if (state.selectedCustomerId) {
      renderCurrentCustomerDashboard();
    }

    if (state.currentView === "notifications") {
      renderNotificationsView();
    }

    if (state.currentView === "cheque-register") {
      renderChequeRegisterView();
    }

    if (state.currentView === "logs") {
      renderLogs();
    }
  }

  async function refreshAndRenderAll() {
    await loadAllData();

    renderCustomerList();
    renderCurrentCustomerDashboard();

    if (state.currentView !== "customers") {
      renderLazyView(state.currentView);
    }
  }

    async function runWithBusyState(button, busyText, work) {
    if (!button) return work();
    if (button.dataset.busy === "1") return;

    const originalText = button.textContent || "";

    button.dataset.busy = "1";
    button.disabled = true;
    button.textContent = busyText || originalText;

    try {
      return await work();
    } finally {
      button.dataset.busy = "0";
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  function openModal(node) {
    if (!node) return;
    node.style.display = "flex";
  }

  function closeModal(node) {
    if (!node) return;

    if (node === el.changePasswordModal && el.changePasswordModal?.dataset?.force === "1") {
      return;
    }

    node.style.display = "none";
  }

            function formatPaymentDetails(payment) {
    const details = getPaymentDetailsObject(payment);

    const replacementText = details.isReplacementPayment
      ? ` | Replaces bounced cheque #${details.replacesChequeNumber || "-"}`
      : "";

    const rootText = details.isReplacementPayment && details.replacementRootPaymentId
      ? ` | Root Ref: ${details.replacementRootPaymentId}`
      : "";

    const taxText = details.withholdingTaxApplied
      ? ` | WTax: ${formatPeso(details.withholdingTaxAmount || 0)} | Net: ${formatPeso(details.netReceivedAmount ?? payment.amount ?? 0)}`
      : "";

    const collectionReceiptText = getPaymentCollectionReceipt(details)
      ? ` | CR: ${getPaymentCollectionReceipt(details)}`
      : "";

    if (payment.method === "Cash") {
      return escapeHtml(`Deposit to: ${details.bankAccountNumber || "-"}${collectionReceiptText}${replacementText}${rootText}${taxText}`);
    }

    if (payment.method === "Online") {
      return escapeHtml(`Ref: ${details.referenceNumber || "-"} | ${details.platformName || "-"}${collectionReceiptText}${replacementText}${rootText}${taxText}`);
    }

    if (payment.method === "Cheque") {
      return escapeHtml(`Cheque #: ${details.chequeNumber || "-"} | Date: ${details.chequeDate || "-"}${details.isPostDated ? " | Post-Dated" : ""}${collectionReceiptText}${replacementText}${rootText}${taxText}`);
    }

    const fallbackText = `${collectionReceiptText}${replacementText}${rootText}${taxText}`.replace(/^ \| /, "");
    return fallbackText ? escapeHtml(fallbackText) : "-";
  }

  function statusPill(status) {
    const cls = status === "Paid" ? "status-paid" : status === "Partially Paid" ? "status-partial" : "status-unpaid";
    return `<span class="status-pill ${cls}">${escapeHtml(status)}</span>`;
  }

  function getPrimaryStatus(balance, total) {
    if (balance <= 0) return "Paid";
    if (balance < total) return "Partially Paid";
    return "Unpaid";
  }

  function passesDateFilter(dateString, from, to) {
    if (!dateString) return false;
    if (from && dateString < from) return false;
    if (to && dateString > to) return false;
    return true;
  }

  function openPrintWindow(html) {
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow popups for printing/downloading documents.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }

  function downloadTextFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function csvSafe(value) {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  }

  function todayStr() { return new Date().toISOString().split("T")[0]; }
  function num(value) { const n = parseFloat(value); return Number.isFinite(n) ? n : 0; }
  function round2(value) { return Math.round((value + Number.EPSILON) * 100) / 100; }
  function formatPeso(value) { return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(round2(Number(value || 0))); }
  function trimZeros(value) {
  return String(value).replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
}

function formatCompactPeso(value) {
  const amount = Number(value || 0);
  const abs = Math.abs(amount);

  if (abs < 1000) {
    return formatPeso(amount);
  }

  const units = [
    { value: 1e15, suffix: "Q" },
    { value: 1e12, suffix: "T" },
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" }
  ];

  for (const unit of units) {
    if (abs >= unit.value) {
      const scaled = amount / unit.value;

      let decimals = 3;
      if (Math.abs(scaled) >= 100) {
        decimals = 1;
      } else if (Math.abs(scaled) >= 10) {
        decimals = 2;
      }

      return `₱${trimZeros(scaled.toFixed(decimals))}${unit.suffix}`;
    }
  }

  return formatPeso(amount);
}
  function formatNumber(value) {
    const n = Number(value || 0);
    return Number.isInteger(n)
      ? new Intl.NumberFormat("en-PH").format(n)
      : new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }
  function getDaysOpen(dateString) { return Math.max(0, Math.floor((Date.now() - new Date(dateString + "T00:00:00").getTime()) / 86400000)); }
  function formatDateTime(iso) { return new Date(iso).toLocaleString(); }
  function capitalizeRole(str) { return String(str || "").split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join("-"); }
  function escapeHtml(value) { return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
  function escapeAttr(value) { return escapeHtml(value); }
      // ===== AI Document Assist =====
  AKY_AI_DOCUMENT_ASSIST.initAiDocumentAssist({
    supabaseClient,
    state,
    el,
    canUseAiAssist,
    getSelectedCustomer,
    addLineItemRow,
    updateInvoiceTotal,
    getInvoiceEditorState,
    renderPaymentMethodFields,
    renderPaymentReviewBox,
    formatPeso,
    round2,
    todayStr,
    escapeHtml
  });
  // ===== End AI Document Assist =====
    // ===== Document Vault =====
  const customerDocumentVault = AKY_CUSTOMER_DOCUMENT_VAULT.initCustomerDocumentVault({
    supabaseClient,
    canUploadCustomerDocuments,
    canDeleteCustomerDocuments,
    getSelectedCustomer,
    escapeHtml
  });

  function syncDocumentVaultCustomer() {
    customerDocumentVault.syncCustomer();
  }

  async function loadCustomerDocuments() {
    return customerDocumentVault.loadDocuments();
  }

  window.AKY_loadCustomerDocuments = loadCustomerDocuments;
  // ===== End Document Vault =====
})();
