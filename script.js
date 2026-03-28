const SUPABASE_URL = "https://pnadtkjdybaalnaqotiu.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_lnGONrjUkuM00sgdNTS7aQ_lSxolPAd";
const ACCOUNT_ADMIN_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/account-admin`;
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(function () {
  "use strict";

  const ROLE_PERMISSIONS = {
    owner: {
      viewAllData: true,
      createCustomer: true,
      editCustomer: true,
      deleteCustomer: true,
      createInvoice: true,
      editInvoice: true,
      createPayment: true,
      requestTbv: true,
      approveTbv: true,
      viewExecutive: true,
      viewNotifications: true,
      viewLogs: true,
      downloadReports: true,
      generateSoa: true,
      manageAccounts: true,
      noteRequiredOnEdit: false
    },
    "co-owner": {
      viewAllData: true,
      createCustomer: false,
      editCustomer: false,
      deleteCustomer: false,
      createInvoice: false,
      editInvoice: false,
      createPayment: false,
      requestTbv: false,
      approveTbv: false,
      viewExecutive: true,
      viewNotifications: true,
      viewLogs: true,
      downloadReports: true,
      generateSoa: true,
      manageAccounts: false,
      noteRequiredOnEdit: false
    },
    admin: {
      viewAllData: true,
      createCustomer: true,
      editCustomer: true,
      deleteCustomer: false,
      createInvoice: true,
      editInvoice: true,
      createPayment: true,
      requestTbv: true,
      approveTbv: false,
      viewExecutive: false,
      viewNotifications: false,
      viewLogs: true,
      downloadReports: true,
      generateSoa: true,
      manageAccounts: false,
      noteRequiredOnEdit: true
    },
   user: {
  viewAllData: true,
  createCustomer: true,
  editCustomer: false,
  deleteCustomer: false,
  createInvoice: true,
  editInvoice: false,
  createPayment: true,
  requestTbv: false,
  approveTbv: false,
  viewExecutive: false,
  viewNotifications: false,
  viewLogs: false,
  downloadReports: true,
  generateSoa: true,
  manageAccounts: false,
  noteRequiredOnEdit: false
}
  };

  const state = {
    currentView: "customers",
    currentProfile: null,
    customers: [],
    contacts: [],
    invoices: [],
    invoiceItems: [],
    payments: [],
    allocations: [],
    logs: [],
    tbvs: [],
    accounts: [],
    selectedCustomerId: null,
    editingCustomerId: null,
    editingInvoiceId: null,
    paymentDraft: null,
    selectedInvoiceForTbv: null,
    selectedTbvForDecision: null,
    editingAccountId: null,
    selectedAccountForReset: null
  };

  const el = mapElements();
  bindEvents();
  bootstrap();

  function mapElements() {
    const byId = (id) => document.getElementById(id);
    return {
      loginScreen: byId("loginScreen"),
      appShell: byId("appShell"),
      loginUsername: byId("loginUsername"),
      loginPassword: byId("loginPassword"),
      loginBtn: byId("loginBtn"),
      loginMessage: byId("loginMessage"),

      currentUserInfo: byId("currentUserInfo"),
      openChangePasswordBtn: byId("openChangePasswordBtn"),
      logoutBtn: byId("logoutBtn"),

      navCustomers: byId("navCustomers"),
      navExecutive: byId("navExecutive"),
      navNotifications: byId("navNotifications"),
      navReports: byId("navReports"),
      navLogs: byId("navLogs"),
      navAccounts: byId("navAccounts"),

      customersView: byId("customersView"),
      executiveView: byId("executiveView"),
      notificationsView: byId("notificationsView"),
      reportsView: byId("reportsView"),
      logView: byId("logView"),
      accountsView: byId("accountsView"),

      customerList: byId("customerList"),
      customerSearch: byId("customerSearch"),
      customerSearchBtn: byId("customerSearchBtn"),
      customerClearSearchBtn: byId("customerClearSearchBtn"),
      openCustomerModalBtn: byId("openCustomerModalBtn"),

      welcomePanel: byId("welcomePanel"),
      customerDashboard: byId("customerDashboard"),
      customerTitle: byId("customerTitle"),
      customerMeta: byId("customerMeta"),
      customerContacts: byId("customerContacts"),
      overdueAlertBox: byId("overdueAlertBox"),
      createInvoiceBtn: byId("createInvoiceBtn"),
      makePaymentBtn: byId("makePaymentBtn"),
      createSOABtn: byId("createSOABtn"),
      editCustomerBtn: byId("editCustomerBtn"),
      deleteCustomerBtn: byId("deleteCustomerBtn"),

      sumInvoiced: byId("sumInvoiced"),
      sumCollected: byId("sumCollected"),
      sumOutstanding: byId("sumOutstanding"),
      sumOverdue: byId("sumOverdue"),

      invoiceTableBody: byId("invoiceTableBody"),
      paymentTableBody: byId("paymentTableBody"),

      customerModal: byId("customerModal"),
      customerModalTitle: byId("customerModalTitle"),
      closeCustomerModalBtn: byId("closeCustomerModalBtn"),
      customerEditNoteWrap: byId("customerEditNoteWrap"),
      customerEditRequiredNote: byId("customerEditRequiredNote"),
      customerFormName: byId("customerFormName"),
      customerFormPhone: byId("customerFormPhone"),
      customerFormEmail: byId("customerFormEmail"),
      additionalContacts: byId("additionalContacts"),
      addContactBtn: byId("addContactBtn"),
      saveCustomerBtn: byId("saveCustomerBtn"),

      invoiceModal: byId("invoiceModal"),
      invoiceModalTitle: byId("invoiceModalTitle"),
      closeInvoiceModalBtn: byId("closeInvoiceModalBtn"),
      editNoteWrap: byId("editNoteWrap"),
      editRequiredNote: byId("editRequiredNote"),
      invoiceNumber: byId("invoiceNumber"),
      invoiceDate: byId("invoiceDate"),
      poNumber: byId("poNumber"),
      referenceInfo: byId("referenceInfo"),
      lineItemsContainer: byId("lineItemsContainer"),
      addLineBtn: byId("addLineBtn"),
      invoiceTotalAmount: byId("invoiceTotalAmount"),
      saveInvoiceBtn: byId("saveInvoiceBtn"),

      invoiceViewModal: byId("invoiceViewModal"),
      closeInvoiceViewModalBtn: byId("closeInvoiceViewModalBtn"),
      invoiceViewContent: byId("invoiceViewContent"),

      paymentTypeModal: byId("paymentTypeModal"),
      closePaymentTypeModalBtn: byId("closePaymentTypeModalBtn"),
      payByInvoiceBtn: byId("payByInvoiceBtn"),
      partialPaymentBtn: byId("partialPaymentBtn"),

      invoiceSelectionModal: byId("invoiceSelectionModal"),
      closeInvoiceSelectionModalBtn: byId("closeInvoiceSelectionModalBtn"),
      invoiceSelectionList: byId("invoiceSelectionList"),
      selectedInvoicesTotal: byId("selectedInvoicesTotal"),
      cancelInvoiceSelectionBtn: byId("cancelInvoiceSelectionBtn"),
      proceedInvoiceSelectionBtn: byId("proceedInvoiceSelectionBtn"),

      partialPaymentModal: byId("partialPaymentModal"),
      closePartialPaymentModalBtn: byId("closePartialPaymentModalBtn"),
      partialInvoiceSelect: byId("partialInvoiceSelect"),
      partialAmountInput: byId("partialAmountInput"),
      partialBalanceInfo: byId("partialBalanceInfo"),
      proceedPartialPaymentBtn: byId("proceedPartialPaymentBtn"),

      paymentMethodModal: byId("paymentMethodModal"),
      closePaymentMethodModalBtn: byId("closePaymentMethodModalBtn"),
      paymentMethodSelect: byId("paymentMethodSelect"),
      chequeNumberWrap: byId("chequeNumberWrap"),
      chequeNumberInput: byId("chequeNumberInput"),
      chequeDateWrap: byId("chequeDateWrap"),
      chequeDateInput: byId("chequeDateInput"),
      chequePostDatedWrap: byId("chequePostDatedWrap"),
      chequePostDatedInput: byId("chequePostDatedInput"),
      onlineReferenceWrap: byId("onlineReferenceWrap"),
      onlineReferenceInput: byId("onlineReferenceInput"),
      onlinePlatformWrap: byId("onlinePlatformWrap"),
      onlinePlatformInput: byId("onlinePlatformInput"),
      cashBankAccountWrap: byId("cashBankAccountWrap"),
      cashBankAccountInput: byId("cashBankAccountInput"),
      paymentReviewBox: byId("paymentReviewBox"),
      savePaymentBtn: byId("savePaymentBtn"),

      changePasswordModal: byId("changePasswordModal"),
      changePasswordTitle: byId("changePasswordTitle"),
      newOwnPassword: byId("newOwnPassword"),
      confirmOwnPassword: byId("confirmOwnPassword"),
      saveOwnPasswordBtn: byId("saveOwnPasswordBtn"),

      execDateFrom: byId("execDateFrom"),
      execDateTo: byId("execDateTo"),
      applyExecFilterBtn: byId("applyExecFilterBtn"),
      clearExecFilterBtn: byId("clearExecFilterBtn"),
      execCustomers: byId("execCustomers"),
      execInvoices: byId("execInvoices"),
      execInvoiced: byId("execInvoiced"),
      execCollected: byId("execCollected"),
      execOutstanding: byId("execOutstanding"),
      execOverdue: byId("execOverdue"),
      agingTableBody: byId("agingTableBody"),

      tbvTableBody: byId("tbvTableBody"),
      notificationsOverdueBody: byId("notificationsOverdueBody"),

      reportCustomerFilter: byId("reportCustomerFilter"),
      reportInvoiceDateFrom: byId("reportInvoiceDateFrom"),
      reportInvoiceDateTo: byId("reportInvoiceDateTo"),
      reportPaidDateFrom: byId("reportPaidDateFrom"),
      reportPaidDateTo: byId("reportPaidDateTo"),
      reportStatusFilter: byId("reportStatusFilter"),
      applyReportFilterBtn: byId("applyReportFilterBtn"),
      clearReportFilterBtn: byId("clearReportFilterBtn"),
      downloadReportBtn: byId("downloadReportBtn"),
      printReportBtn: byId("printReportBtn"),
      reportsTableBody: byId("reportsTableBody"),
      reportInvoicesCount: byId("reportInvoicesCount"),
      reportTotalInvoiced: byId("reportTotalInvoiced"),
      reportTotalPaid: byId("reportTotalPaid"),
      reportTotalOutstanding: byId("reportTotalOutstanding"),

      logTableBody: byId("logTableBody"),

      tbvModal: byId("tbvModal"),
      closeTbvModalBtn: byId("closeTbvModalBtn"),
      tbvInvoiceInfo: byId("tbvInvoiceInfo"),
      tbvExplanationInput: byId("tbvExplanationInput"),
      saveTbvBtn: byId("saveTbvBtn"),

      tbvDecisionModal: byId("tbvDecisionModal"),
      closeTbvDecisionModalBtn: byId("closeTbvDecisionModalBtn"),
      tbvDecisionInfo: byId("tbvDecisionInfo"),
      tbvDecisionNotesInput: byId("tbvDecisionNotesInput"),
      denyTbvBtn: byId("denyTbvBtn"),
      approveTbvBtn: byId("approveTbvBtn"),

      soaModal: byId("soaModal"),
      closeSoaModalBtn: byId("closeSoaModalBtn"),
      soaPreparedBy: byId("soaPreparedBy"),
      soaAsOfDate: byId("soaAsOfDate"),
      soaShowPayments: byId("soaShowPayments"),
      generateSoaBtn: byId("generateSoaBtn"),

      accountsTableBody: byId("accountsTableBody"),
      accountSearch: byId("accountSearch"),
      accountRoleFilter: byId("accountRoleFilter"),
      applyAccountFilterBtn: byId("applyAccountFilterBtn"),
      refreshAccountsBtn: byId("refreshAccountsBtn"),
      openAccountModalBtn: byId("openAccountModalBtn"),

      accountModal: byId("accountModal"),
      accountModalTitle: byId("accountModalTitle"),
      closeAccountModalBtn: byId("closeAccountModalBtn"),
      accountNameInput: byId("accountNameInput"),
      accountEmailInput: byId("accountEmailInput"),
      accountRoleInput: byId("accountRoleInput"),
      accountPasswordWrap: byId("accountPasswordWrap"),
      accountPasswordInput: byId("accountPasswordInput"),
      accountMustChangePasswordInput: byId("accountMustChangePasswordInput"),
      accountModalHelpBox: byId("accountModalHelpBox"),
      saveAccountBtn: byId("saveAccountBtn"),

      resetPasswordModal: byId("resetPasswordModal"),
      closeResetPasswordModalBtn: byId("closeResetPasswordModalBtn"),
      resetPasswordInfo: byId("resetPasswordInfo"),
      resetPasswordInput: byId("resetPasswordInput"),
      resetMustChangePasswordInput: byId("resetMustChangePasswordInput"),
      saveResetPasswordBtn: byId("saveResetPasswordBtn")
    };
  }

  function bindEvents() {
    el.loginBtn.addEventListener("click", login);
    el.loginPassword.addEventListener("keydown", (e) => e.key === "Enter" && login());

    el.openChangePasswordBtn.addEventListener("click", () => openChangePasswordModal(false));
    el.saveOwnPasswordBtn.addEventListener("click", saveOwnPassword);
    el.logoutBtn.addEventListener("click", logout);

    el.navCustomers.addEventListener("click", () => setView("customers"));
    el.navExecutive.addEventListener("click", () => setView("executive"));
    el.navNotifications.addEventListener("click", () => setView("notifications"));
    el.navReports.addEventListener("click", () => setView("reports"));
    el.navLogs.addEventListener("click", () => setView("logs"));
    el.navAccounts.addEventListener("click", () => setView("accounts"));

    el.openCustomerModalBtn.addEventListener("click", openAddCustomerModal);
    el.customerSearchBtn.addEventListener("click", renderCustomerList);
    el.customerClearSearchBtn.addEventListener("click", () => {
      el.customerSearch.value = "";
      renderCustomerList();
    });

    el.closeCustomerModalBtn.addEventListener("click", () => closeModal(el.customerModal));
    el.addContactBtn.addEventListener("click", () => addContactRow());
    el.saveCustomerBtn.addEventListener("click", saveCustomer);

    el.createInvoiceBtn.addEventListener("click", openInvoiceModalForCreate);
    el.closeInvoiceModalBtn.addEventListener("click", () => closeModal(el.invoiceModal));
    el.addLineBtn.addEventListener("click", () => addLineItemRow());
    el.saveInvoiceBtn.addEventListener("click", saveInvoice);

    el.closeInvoiceViewModalBtn.addEventListener("click", () => closeModal(el.invoiceViewModal));

    el.makePaymentBtn.addEventListener("click", openPaymentTypeModal);
    el.closePaymentTypeModalBtn.addEventListener("click", () => closeModal(el.paymentTypeModal));
    el.payByInvoiceBtn.addEventListener("click", openPayByInvoiceStep);
    el.partialPaymentBtn.addEventListener("click", openPartialPaymentStep);

    el.closeInvoiceSelectionModalBtn.addEventListener("click", () => closeModal(el.invoiceSelectionModal));
    el.cancelInvoiceSelectionBtn.addEventListener("click", () => closeModal(el.invoiceSelectionModal));
    el.proceedInvoiceSelectionBtn.addEventListener("click", proceedSelectedInvoices);

    el.closePartialPaymentModalBtn.addEventListener("click", () => closeModal(el.partialPaymentModal));
    el.partialInvoiceSelect.addEventListener("change", renderPartialBalanceInfo);
    el.partialAmountInput.addEventListener("input", renderPartialBalanceInfo);
    el.proceedPartialPaymentBtn.addEventListener("click", proceedPartialPayment);

    el.closePaymentMethodModalBtn.addEventListener("click", () => closeModal(el.paymentMethodModal));
    el.paymentMethodSelect.addEventListener("change", renderPaymentMethodFields);
    el.savePaymentBtn.addEventListener("click", savePayment);

    el.applyExecFilterBtn.addEventListener("click", renderExecutiveView);
    el.clearExecFilterBtn.addEventListener("click", () => {
      el.execDateFrom.value = "";
      el.execDateTo.value = "";
      renderExecutiveView();
    });

    el.applyReportFilterBtn.addEventListener("click", renderReportsView);
    el.clearReportFilterBtn.addEventListener("click", clearReportFilters);
    el.downloadReportBtn.addEventListener("click", downloadReportCsv);
    el.printReportBtn.addEventListener("click", printReport);

    el.closeTbvModalBtn.addEventListener("click", () => closeModal(el.tbvModal));
    el.saveTbvBtn.addEventListener("click", saveTbvRequest);

    el.closeTbvDecisionModalBtn.addEventListener("click", () => closeModal(el.tbvDecisionModal));
    el.approveTbvBtn.addEventListener("click", () => decideTbv("APPROVED"));
    el.denyTbvBtn.addEventListener("click", () => decideTbv("DENIED"));

    el.createSOABtn.addEventListener("click", openSoaModal);
    el.closeSoaModalBtn.addEventListener("click", () => closeModal(el.soaModal));
    el.generateSoaBtn.addEventListener("click", generateSoa);

    el.editCustomerBtn.addEventListener("click", openEditCustomerModal);
    el.deleteCustomerBtn.addEventListener("click", deleteSelectedCustomer);

    el.applyAccountFilterBtn.addEventListener("click", renderAccountsView);
    el.refreshAccountsBtn.addEventListener("click", refreshAccounts);
    el.openAccountModalBtn.addEventListener("click", openCreateAccountModal);
    el.closeAccountModalBtn.addEventListener("click", () => closeModal(el.accountModal));
    el.saveAccountBtn.addEventListener("click", saveAccount);
    el.closeResetPasswordModalBtn.addEventListener("click", () => closeModal(el.resetPasswordModal));
    el.saveResetPasswordBtn.addEventListener("click", saveResetPassword);

    document.querySelectorAll(".modal").forEach((modal) => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.querySelectorAll(".modal").forEach((m) => (m.style.display = "none"));
      }
    });

    window.addEventListener("online", () => alert("Internet connection restored."));
    window.addEventListener("offline", () => alert("You are offline. Already-loaded data can still be viewed, printed, and exported on this device."));
  }

  async function bootstrap() {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error || !data.session?.user) {
      showLogin();
      return;
    }

    const profile = await getProfile(data.session.user.id);
    if (!profile) {
      showLogin();
      return;
    }

    state.currentProfile = profile;
    await showApp();

    if (profile.must_change_password) openChangePasswordModal(true);
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

  async function showApp() {
    el.loginScreen.classList.add("hidden");
    el.appShell.classList.remove("hidden");
    renderCurrentUser();
    await loadAllData();
    if (canManageAccounts()) await loadAccounts();
    renderCustomerList();
    renderCurrentCustomerDashboard();
    renderExecutiveView();
    renderNotificationsView();
    renderLogs();
    renderReportsView();
    renderAccountsView();
    setView(state.currentView);
  }

  function getCurrentUser() {
    return state.currentProfile;
  }

  function getRoleConfig() {
    const role = state.currentProfile?.role || "user";
    return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.user;
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
  function editNoteRequired() { return getRoleConfig().noteRequiredOnEdit; }

  async function login() {
    const email = el.loginUsername.value.trim();
    const password = el.loginPassword.value;

    if (!email || !password) {
      el.loginMessage.textContent = "Please enter your email and password.";
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      el.loginMessage.textContent = error.message;
      return;
    }

    const profile = await getProfile(data.user.id);
    if (!profile) {
      el.loginMessage.textContent = "Profile not found.";
      return;
    }

    state.currentProfile = profile;
    el.loginMessage.textContent = "";
    el.loginPassword.value = "";
    await showApp();

    if (profile.must_change_password) openChangePasswordModal(true);
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

    const { error: authError } = await supabaseClient.auth.updateUser({ password });
    if (authError) return alert(authError.message);

    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({ must_change_password: false })
      .eq("id", state.currentProfile.id);

    if (profileError) return alert(profileError.message);

    state.currentProfile.must_change_password = false;
    closeModal(el.changePasswordModal);
    renderCurrentUser();
    alert("Password changed successfully.");
  }

  async function loadAllData() {
    const [customersRes, contactsRes, invoicesRes, invoiceItemsRes, paymentsRes, allocationsRes, logsRes, tbvsRes] = await Promise.all([
      supabaseClient.from("customers").select("*").order("name", { ascending: true }),
      supabaseClient.from("customer_contacts").select("*").order("created_at", { ascending: true }),
      supabaseClient.from("invoices").select("*").eq("is_voided", false).order("invoice_date", { ascending: false }),
      supabaseClient.from("invoice_items").select("*").order("created_at", { ascending: true }),
      supabaseClient.from("payments").select("*").order("payment_date", { ascending: false }),
      supabaseClient.from("payment_allocations").select("*"),
      supabaseClient.from("activity_logs").select("*").order("created_at", { ascending: false }).limit(500),
      supabaseClient.from("invoice_void_requests").select("*").order("created_at", { ascending: false })
    ]);

    if (customersRes.error) return alert(customersRes.error.message);
    if (contactsRes.error) return alert(contactsRes.error.message);
    if (invoicesRes.error) return alert(invoicesRes.error.message);
    if (invoiceItemsRes.error) return alert(invoiceItemsRes.error.message);
    if (paymentsRes.error) return alert(paymentsRes.error.message);
    if (allocationsRes.error) return alert(allocationsRes.error.message);
    if (logsRes.error) return alert(logsRes.error.message);
    if (tbvsRes.error) return alert(tbvsRes.error.message);

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
  }

  function hydrateData() {
    const customerMap = new Map(state.customers.map((c) => [c.id, { ...c, contacts: [], invoices: [], payments: [] }]));

    state.contacts.forEach((contact) => {
      const customer = customerMap.get(contact.customer_id);
      if (customer) customer.contacts.push(contact);
    });

    const invoiceItemMap = new Map();
    state.invoiceItems.forEach((item) => {
      if (!invoiceItemMap.has(item.invoice_id)) invoiceItemMap.set(item.invoice_id, []);
      invoiceItemMap.get(item.invoice_id).push(item);
    });

    const paymentAllocMap = new Map();
    state.allocations.forEach((alloc) => {
      if (!paymentAllocMap.has(alloc.payment_id)) paymentAllocMap.set(alloc.payment_id, []);
      paymentAllocMap.get(alloc.payment_id).push(alloc);
    });

    state.invoices = state.invoices.map((inv) => {
      const items = invoiceItemMap.get(inv.id) || [];
      return {
        ...inv,
        items,
        total: Number(inv.total_amount || 0),
        paidAmount: Number(inv.paid_amount || 0),
        balance: Number(inv.balance_amount || 0),
        status: getPrimaryStatus(Number(inv.balance_amount || 0), Number(inv.total_amount || 0))
      };
    });

    state.payments = state.payments.map((p) => ({ ...p, allocations: paymentAllocMap.get(p.id) || [] }));

    state.invoices.forEach((invoice) => {
      const customer = customerMap.get(invoice.customer_id);
      if (customer) customer.invoices.push(invoice);
    });

    state.payments.forEach((payment) => {
      const customer = customerMap.get(payment.customer_id);
      if (customer) customer.payments.push(payment);
    });

    state.customers = Array.from(customerMap.values());

    if (state.selectedCustomerId && !state.customers.some((c) => c.id === state.selectedCustomerId)) {
      state.selectedCustomerId = null;
    }
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
    el.openCustomerModalBtn.classList.toggle("hidden", !canCreateCustomer());
    el.createSOABtn.classList.toggle("hidden", !canGenerateSoa());
  }

  function setView(view) {
    state.currentView = view;

    [el.customersView, el.executiveView, el.notificationsView, el.reportsView, el.logView, el.accountsView].forEach((v) => v.classList.add("hidden"));
    [el.navCustomers, el.navExecutive, el.navNotifications, el.navReports, el.navLogs, el.navAccounts].forEach((b) => b.classList.remove("active"));

    if (view === "customers") {
      el.customersView.classList.remove("hidden");
      el.navCustomers.classList.add("active");
      return;
    }
    if (view === "executive" && canViewExecutive()) {
      el.executiveView.classList.remove("hidden");
      el.navExecutive.classList.add("active");
      return;
    }
    if (view === "notifications" && canViewNotifications()) {
      el.notificationsView.classList.remove("hidden");
      el.navNotifications.classList.add("active");
      return;
    }
    if (view === "reports") {
      el.reportsView.classList.remove("hidden");
      el.navReports.classList.add("active");
      return;
    }
    if (view === "logs" && canViewLogs()) {
      el.logView.classList.remove("hidden");
      el.navLogs.classList.add("active");
      return;
    }
    if (view === "accounts" && canManageAccounts()) {
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
    const list = state.customers.filter((c) => c.name.toLowerCase().includes(term)).sort((a, b) => a.name.localeCompare(b.name));
    el.customerList.innerHTML = "";
    if (!list.length) {
      el.customerList.innerHTML = `<div class="muted">No matching customers.</div>`;
      return;
    }
    list.forEach((customer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "customer-item" + (customer.id === state.selectedCustomerId ? " active" : "");
      button.textContent = customer.name;
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
      return;
    }

    el.welcomePanel.classList.add("hidden");
    el.customerDashboard.classList.remove("hidden");
    el.customerTitle.textContent = customer.name;
    el.customerMeta.textContent = `Primary Phone: ${customer.phone || "-"}${customer.email ? " | Email: " + customer.email : ""}`;

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
  }

  function renderCustomerContacts(customer) {
    const contacts = [{ contact_name: customer.name, phone: customer.phone, email: customer.email, primary: true }, ...(customer.contacts || [])];
    el.customerContacts.innerHTML = contacts.map((contact, index) => `
      <div class="contact-card">
        <strong>${contact.primary ? "Primary Contact" : "Additional Contact " + index}</strong><br>
        Name: ${escapeHtml(contact.contact_name || "-")}<br>
        Phone: ${escapeHtml(contact.phone || "-")}<br>
        Email: ${escapeHtml(contact.email || "-")}
      </div>
    `).join("");
  }

  function renderCustomerSummary(customer) {
    const totalInvoiced = customer.invoices.reduce((sum, x) => sum + Number(x.total || 0), 0);
    const totalCollected = customer.payments.filter((p) => p.cleared !== false).reduce((sum, x) => sum + Number(x.amount || 0), 0);
    const totalOutstanding = customer.invoices.reduce((sum, x) => sum + Number(x.balance || 0), 0);
    const overdueCount = customer.invoices.filter((x) => x.balance > 0 && getDaysOpen(x.invoice_date) > 90).length;

    el.sumInvoiced.textContent = formatPeso(totalInvoiced);
    el.sumCollected.textContent = formatPeso(totalCollected);
    el.sumOutstanding.textContent = formatPeso(totalOutstanding);
    el.sumOverdue.textContent = String(overdueCount);
  }

  function getAllocationAmount(alloc) {
    return Number(alloc?.allocated_amount ?? alloc?.amount ?? 0);
  }

  function getPostDatedChequeEntries(customerId = null) {
    return state.payments
      .filter((payment) => {
        const details = payment.details || {};
        if (customerId && payment.customer_id !== customerId) return false;
        return payment.method === "Cheque" && details.isPostDated && details.chequeDate && payment.cleared !== true;
      })
      .map((payment) => {
        const details = payment.details || {};
        const customer = state.customers.find((c) => c.id === payment.customer_id);

        const allocations = (payment.allocations || []).map((alloc) => {
          const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
          return {
            invoice,
            allocatedAmount: getAllocationAmount(alloc)
          };
        });

        const invoiceNumbers = allocations.map((x) => x.invoice?.invoice_number || "Deleted Invoice");
        const openBalance = allocations.reduce((sum, x) => sum + Number(x.invoice?.balance || 0), 0);

        return {
          payment,
          details,
          customer,
          allocations,
          invoiceNumbers,
          openBalance
        };
      })
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
        alerts.push(`Post-dated cheque follow-up: ${formatPeso(entry.payment.amount)} due on ${entry.details.chequeDate}`);
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

    const contacts = [...el.additionalContacts.querySelectorAll(".contact-card")].map((card) => ({
      contact_name: card.querySelector(".contact-name")?.value.trim() || "",
      phone: card.querySelector(".contact-phone")?.value.trim() || "",
      email: card.querySelector(".contact-email")?.value.trim() || ""
    })).filter((c) => c.contact_name || c.phone || c.email);

    if (state.editingCustomerId) {
      if (!canEditCustomer()) return;
      const note = el.customerEditRequiredNote.value.trim();
      if (editNoteRequired() && !note) return alert("Edit note is required for admin edits.");
      const existing = getSelectedCustomer();
      const { error } = await supabaseClient.from("customers").update({ name, phone, email: email || null, updated_at: new Date().toISOString() }).eq("id", state.editingCustomerId);
      if (error) return alert(error.message);
      const { error: deleteContactsError } = await supabaseClient.from("customer_contacts").delete().eq("customer_id", state.editingCustomerId);
      if (deleteContactsError) return alert(deleteContactsError.message);
      if (contacts.length) {
        const { error: contactErr } = await supabaseClient.from("customer_contacts").insert(contacts.map((c) => ({ ...c, customer_id: state.editingCustomerId })));
        if (contactErr) return alert(contactErr.message);
      }
      await addLog("Edit", "Customer", existing?.name || name, note, existing || null, { name, phone, email });
    } else {
      if (!canCreateCustomer()) return;
      const { data, error } = await supabaseClient.from("customers").insert([{ name, phone, email: email || null, created_by: state.currentProfile.id }]).select().single();
      if (error) return alert(error.message);
      if (contacts.length) {
        const { error: contactErr } = await supabaseClient.from("customer_contacts").insert(contacts.map((c) => ({ ...c, customer_id: data.id })));
        if (contactErr) return alert(contactErr.message);
      }
      state.selectedCustomerId = data.id;
      await addLog("Create", "Customer", name, "", null, data);
    }

    closeModal(el.customerModal);
    state.editingCustomerId = null;
    await refreshAndRenderAll();
    alert("Customer saved successfully.");
  }

  async function deleteSelectedCustomer() {
    if (!canDeleteCustomer()) return;
    const customer = getSelectedCustomer();
    if (!customer) return alert("Please select a customer first.");
    if (customer.invoices.length || customer.payments.length) return alert("This customer cannot be deleted because it already has invoices or payments. Keep the record for accountability.");
    const confirmed = window.confirm(`Delete customer "${customer.name}"? This cannot be undone.`);
    if (!confirmed) return;
    const { error: contactError } = await supabaseClient.from("customer_contacts").delete().eq("customer_id", customer.id);
    if (contactError) return alert(contactError.message);
    const { error: customerError } = await supabaseClient.from("customers").delete().eq("id", customer.id);
    if (customerError) return alert(customerError.message);
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
    el.invoiceDate.value = todayStr();
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
    (invoice.items.length ? invoice.items : [{}]).forEach((item) => addLineItemRow({ product: item.product_name, qty: item.qty, price: item.unit_price }));
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
  }

  function addLineItemRow(item = {}) {
    const row = document.createElement("div");
    row.className = "line-item";
    row.innerHTML = `
      <input type="text" class="line-product" placeholder="Product name" value="${escapeAttr(item.product || "")}">
      <input type="number" class="line-qty" placeholder="Qty" min="0" step="0.01" value="${item.qty ?? ""}">
      <input type="number" class="line-price" placeholder="Price" min="0" step="0.01" value="${item.price ?? ""}">
      <div class="line-total-box">₱0</div>
      <button type="button" class="delete-line-btn">&times;</button>
    `;

    const qtyInput = row.querySelector(".line-qty");
    const priceInput = row.querySelector(".line-price");
    const totalBox = row.querySelector(".line-total-box");

    const recalc = () => {
      const qty = num(qtyInput.value);
      const price = num(priceInput.value);
      totalBox.textContent = formatPeso(qty * price);
      updateInvoiceTotal();
    };

    qtyInput.addEventListener("input", recalc);
    priceInput.addEventListener("input", recalc);
    row.querySelector(".delete-line-btn").addEventListener("click", () => {
      row.remove();
      if (!el.lineItemsContainer.children.length) addLineItemRow();
      updateInvoiceTotal();
    });

    el.lineItemsContainer.appendChild(row);
    recalc();
  }

  function updateInvoiceTotal() {
    const total = [...el.lineItemsContainer.querySelectorAll(".line-item")].reduce((sum, row) => sum + num(row.querySelector(".line-qty").value) * num(row.querySelector(".line-price").value), 0);
    el.invoiceTotalAmount.textContent = formatPeso(total);
  }

  async function saveInvoice() {
    const customer = getSelectedCustomer();
    if (!customer) return;
    const invoiceNumber = el.invoiceNumber.value.trim();
    const invoiceDate = el.invoiceDate.value;
    const poNumber = el.poNumber.value.trim();
    const referenceInfo = el.referenceInfo.value.trim();
    if (!invoiceNumber) return alert("Invoice number is required.");
    if (!invoiceDate) return alert("Invoice date is required.");

    const items = [...el.lineItemsContainer.querySelectorAll(".line-item")].map((row) => {
      const product = row.querySelector(".line-product").value.trim();
      const qty = num(row.querySelector(".line-qty").value);
      const price = num(row.querySelector(".line-price").value);
      return { product_name: product, qty, unit_price: price, line_total: round2(qty * price) };
    }).filter((item) => item.product_name || item.qty || item.unit_price);
    if (!items.length) return alert("Add at least one line item.");
    const total = round2(items.reduce((sum, item) => sum + item.line_total, 0));

    if (state.editingInvoiceId) {
      if (!canEditInvoice()) return;
      const editNote = el.editRequiredNote.value.trim();
      if (editNoteRequired() && !editNote) return alert("Edit note is required for admin edits.");
      const oldInvoice = state.invoices.find((x) => x.id === state.editingInvoiceId);
      if (!oldInvoice) return alert("Invoice not found.");
      const paidAmount = Number(oldInvoice.paidAmount || 0);
      const balanceAmount = round2(Math.max(0, total - paidAmount));
      const primaryStatus = balanceAmount <= 0 ? "PAID" : balanceAmount < total ? "PARTIALLY_PAID" : "UNPAID";
      const { error } = await supabaseClient.from("invoices").update({ invoice_number: invoiceNumber, invoice_date: invoiceDate, po_number: poNumber || null, reference_info: referenceInfo || null, total_amount: total, balance_amount: balanceAmount, primary_status: primaryStatus, updated_at: new Date().toISOString() }).eq("id", state.editingInvoiceId);
      if (error) return alert(error.message);
      const { error: deleteItemsError } = await supabaseClient.from("invoice_items").delete().eq("invoice_id", state.editingInvoiceId);
      if (deleteItemsError) return alert(deleteItemsError.message);
      const { error: itemError } = await supabaseClient.from("invoice_items").insert(items.map((i) => ({ ...i, invoice_id: state.editingInvoiceId })));
      if (itemError) return alert(itemError.message);
      await addLog("Edit", "Invoice", invoiceNumber, editNote, oldInvoice, { invoice_number: invoiceNumber, invoice_date: invoiceDate, po_number: poNumber, reference_info: referenceInfo, total_amount: total });
    } else {
      if (!canCreateInvoice()) return;
      const { data, error } = await supabaseClient.from("invoices").insert([{ customer_id: customer.id, invoice_number: invoiceNumber, invoice_date: invoiceDate, po_number: poNumber || null, reference_info: referenceInfo || null, total_amount: total, paid_amount: 0, balance_amount: total, primary_status: "UNPAID", payment_notice_status: "NONE", created_by: state.currentProfile.id, is_voided: false }]).select().single();
      if (error) return alert(error.message);
      const { error: itemError } = await supabaseClient.from("invoice_items").insert(items.map((i) => ({ ...i, invoice_id: data.id })));
      if (itemError) return alert(itemError.message);
      await addLog("Create", "Invoice", invoiceNumber, "", null, data);
    }

    closeModal(el.invoiceModal);
    state.editingInvoiceId = null;
    await refreshAndRenderAll();
    alert("Invoice saved successfully.");
  }

  function viewInvoice(invoiceId) {
    const customer = getSelectedCustomer();
    if (!customer) return;
    const invoice = customer.invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) return;
    const tbv = state.tbvs.find((t) => t.invoice_id === invoice.id && t.status === "PENDING");
    const itemsHtml = (invoice.items || []).map((item) => `
      <tr>
        <td>${escapeHtml(item.product_name || "-")}</td>
        <td>${formatNumber(item.qty)}</td>
        <td>${formatPeso(item.unit_price)}</td>
        <td>${formatPeso(item.line_total)}</td>
      </tr>
    `).join("");

    let actionButtons = "";
    if (canEditInvoice()) actionButtons += `<button class="btn btn-light" id="invoiceViewEditBtn">Edit Invoice</button>`;
    if (canRequestTbv() && !tbv) actionButtons += `<button class="btn btn-danger" id="invoiceViewTbvBtn">TBV</button>`;

    el.invoiceViewContent.innerHTML = `
      <div class="invoice-meta-grid">
        <div class="invoice-meta-card"><span>Invoice #</span><strong>${escapeHtml(invoice.invoice_number)}</strong></div>
        <div class="invoice-meta-card"><span>Date</span><strong>${escapeHtml(invoice.invoice_date)}</strong></div>
        <div class="invoice-meta-card"><span>PO #</span><strong>${escapeHtml(invoice.po_number || "-")}</strong></div>
        <div class="invoice-meta-card"><span>Reference</span><strong>${escapeHtml(invoice.reference_info || "-")}</strong></div>
      </div>
      <div class="table-wrap">
        <table class="records-table">
          <thead><tr><th>Product Name</th><th>Quantity</th><th>Price</th><th>Line Total</th></tr></thead>
          <tbody>${itemsHtml || `<tr><td colspan="4" class="muted">No line items.</td></tr>`}</tbody>
        </table>
      </div>
      <div class="summary-grid" style="margin-top:16px;">
        <div class="panel summary-card"><span class="summary-label">Invoice Total</span><strong>${formatPeso(invoice.total)}</strong></div>
        <div class="panel summary-card"><span class="summary-label">Paid</span><strong>${formatPeso(invoice.paidAmount)}</strong></div>
        <div class="panel summary-card"><span class="summary-label">Balance</span><strong>${formatPeso(invoice.balance)}</strong></div>
        <div class="panel summary-card"><span class="summary-label">Status</span><strong>${escapeHtml(invoice.status)}</strong></div>
      </div>
      ${tbv ? `<div class="alert-box" style="margin-top:16px;">TBV status: ${escapeHtml(tbv.status)} | Explanation: ${escapeHtml(tbv.explanation)}</div>` : ""}
      <div class="btn-row" style="margin-top:16px;">${actionButtons}</div>
    `;

    openModal(el.invoiceViewModal);
    document.getElementById("invoiceViewEditBtn")?.addEventListener("click", () => { closeModal(el.invoiceViewModal); openInvoiceModalForEdit(invoice.id); });
    document.getElementById("invoiceViewTbvBtn")?.addEventListener("click", () => { closeModal(el.invoiceViewModal); openTbvModal(invoice.id); });
  }

  function renderInvoiceTable(customer) {
    el.invoiceTableBody.innerHTML = "";
    if (!customer.invoices.length) {
      el.invoiceTableBody.innerHTML = `<tr><td colspan="10" class="muted">No invoices yet.</td></tr>`;
      return;
    }

    customer.invoices.slice().sort((a, b) => String(b.invoice_date).localeCompare(String(a.invoice_date))).forEach((invoice) => {
      const tbv = state.tbvs.find((t) => t.invoice_id === invoice.id && t.status === "PENDING");
      const tr = document.createElement("tr");
      let actionHtml = `<button class="btn btn-light action-view">View</button>`;
      if (canEditInvoice()) actionHtml += ` <button class="btn btn-primary action-edit">Edit</button>`;
      if (canRequestTbv() && !tbv) actionHtml += ` <button class="btn btn-danger action-tbv">TBV</button>`;
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
          <td><div class="row-actions">${actionHtml}</div></td>
      `;
      tr.querySelector(".clickable").addEventListener("click", () => viewInvoice(invoice.id));
      tr.querySelector(".action-view").addEventListener("click", () => viewInvoice(invoice.id));
      tr.querySelector(".action-edit")?.addEventListener("click", () => openInvoiceModalForEdit(invoice.id));
      tr.querySelector(".action-tbv")?.addEventListener("click", () => openTbvModal(invoice.id));
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
    closeModal(el.paymentTypeModal);
    el.partialInvoiceSelect.innerHTML = customer.invoices.filter((inv) => inv.balance > 0).map((inv) => `<option value="${inv.id}">${escapeHtml(inv.invoice_number)} - Balance ${formatPeso(inv.balance)} - ${escapeHtml(inv.invoice_date)}</option>`).join("");
    el.partialAmountInput.value = "";
    renderPartialBalanceInfo();
    openModal(el.partialPaymentModal);
  }

  function renderPartialBalanceInfo() {
    const customer = getSelectedCustomer();
    if (!customer) return;
    const invoice = customer.invoices.find((inv) => inv.id === el.partialInvoiceSelect.value);
    if (!invoice) {
      el.partialBalanceInfo.textContent = "Select an invoice.";
      return;
    }
    const entered = num(el.partialAmountInput.value);
    let text = `Current balance for ${invoice.invoice_number}: ${formatPeso(invoice.balance)}.`;
    if (entered > 0) text += ` After this payment, remaining balance will be ${formatPeso(Math.max(0, invoice.balance - entered))}.`;
    text += " The invoice remains Partially Paid until its balance becomes zero.";
    el.partialBalanceInfo.textContent = text;
  }

  function proceedPartialPayment() {
    const customer = getSelectedCustomer();
    if (!customer) return;
    const invoice = customer.invoices.find((inv) => inv.id === el.partialInvoiceSelect.value);
    const amount = num(el.partialAmountInput.value);
    if (!invoice) return alert("Please choose an invoice.");
    if (amount <= 0) return alert("Enter a valid partial amount.");
    if (amount > invoice.balance) return alert("Partial amount cannot be more than the invoice balance.");
    state.paymentDraft = { mode: "partial", amount, allocations: [{ invoiceId: invoice.id, amount }] };
    closeModal(el.partialPaymentModal);
    openPaymentMethodStep();
  }

  function openPaymentMethodStep() {
    if (!state.paymentDraft) return;
    el.paymentMethodSelect.value = "";
    el.chequeNumberInput.value = "";
    el.chequeDateInput.value = todayStr();
    el.chequePostDatedInput.checked = false;
    el.onlineReferenceInput.value = "";
    el.onlinePlatformInput.value = "";
    el.cashBankAccountInput.value = "";
    renderPaymentMethodFields();
    const customer = getSelectedCustomer();
    const lines = state.paymentDraft.allocations.map((alloc) => {
      const invoice = customer.invoices.find((inv) => inv.id === alloc.invoiceId);
      return `${invoice ? invoice.invoice_number : "Invoice"}: ${formatPeso(alloc.amount)}`;
    });
    el.paymentReviewBox.innerHTML = `
      Payment Type: <strong>${state.paymentDraft.mode === "full" ? "Pay by Invoice" : "Partial Payment"}</strong><br>
      Amount: <strong>${formatPeso(state.paymentDraft.amount)}</strong><br>
      Applied To: ${escapeHtml(lines.join(" | "))}
    `;
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
  }

  async function savePayment() {
    const customer = getSelectedCustomer();
    if (!customer || !state.paymentDraft) return;
    if (!canCreatePayment()) return;
    const method = el.paymentMethodSelect.value;
    if (!method) return alert("Select a payment method.");

    const details = {};
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

    const paymentDate = todayStr();
    const amount = round2(state.paymentDraft.amount);
    const { data: payment, error: paymentError } = await supabaseClient.from("payments").insert([{
      customer_id: customer.id,
      payment_date: paymentDate,
      payment_type: state.paymentDraft.mode === "full" ? "Pay by Invoice" : "Partial Payment",
      method: method,
      amount,
      details,
      cleared,
      created_by: state.currentProfile.id,
      created_by_name: state.currentProfile.username,
      created_by_role: state.currentProfile.role
    }]).select().single();

    if (paymentError) return alert(paymentError.message);

    const allocRows = state.paymentDraft.allocations.map((alloc) => ({
      payment_id: payment.id,
      invoice_id: alloc.invoiceId,
      allocated_amount: alloc.amount
    }));

    const { error: allocError } = await supabaseClient.from("payment_allocations").insert(allocRows);
    if (allocError) return alert(allocError.message);

    for (const alloc of state.paymentDraft.allocations) {
      const invoice = state.invoices.find((x) => x.id === alloc.invoiceId);
      if (!invoice) continue;
      const newPaid = round2(Number(invoice.paidAmount || invoice.paid_amount || 0) + alloc.amount);
      const newBalance = round2(Math.max(0, Number(invoice.total || invoice.total_amount || 0) - newPaid));
      const newStatus = newBalance <= 0 ? "PAID" : newBalance < Number(invoice.total || invoice.total_amount || 0) ? "PARTIALLY_PAID" : "UNPAID";
      const { error } = await supabaseClient.from("invoices").update({ paid_amount: newPaid, balance_amount: newBalance, primary_status: newStatus }).eq("id", alloc.invoiceId);
      if (error) return alert(error.message);
    }

    await addLog("Create", "Payment", `${payment.payment_type} - ${payment.method} - ${formatPeso(amount)}`, "", null, payment);
    state.paymentDraft = null;
    closeModal(el.paymentMethodModal);
    await refreshAndRenderAll();
    alert("Payment saved successfully.");
  }

  function renderPaymentTable(customer) {
    el.paymentTableBody.innerHTML = "";
    if (!customer.payments.length) {
      el.paymentTableBody.innerHTML = `<tr><td colspan="7" class="muted">No payments yet.</td></tr>`;
      return;
    }
    customer.payments.slice().sort((a, b) => String(b.payment_date).localeCompare(String(a.payment_date))).forEach((payment) => {
      const appliedTo = payment.allocations.map((alloc) => {
        const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
        return `${invoice ? invoice.invoice_number : "Deleted Invoice"} (${formatPeso(getAllocationAmount(alloc))})`;
      }).join(", ");
      const details = formatPaymentDetails(payment);
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${escapeHtml(payment.payment_date)}</td>
          <td>${escapeHtml(payment.payment_type)}</td>
          <td>${escapeHtml(payment.method)}</td>
          <td>${details}</td>
          <td>${formatPeso(payment.amount)}</td>
          <td>${escapeHtml(appliedTo || "-")}</td>
          <td>${escapeHtml(payment.created_by_name || "-")}</td>
      `;
      el.paymentTableBody.appendChild(row);
    });
  }

  function renderExecutiveView() {
    if (!canViewExecutive()) return;
    const from = el.execDateFrom.value || null;
    const to = el.execDateTo.value || null;
    const invoices = state.invoices.filter((x) => passesDateFilter(x.invoice_date, from, to));
    const payments = state.payments.filter((x) => passesDateFilter(x.payment_date, from, to));
    const overdueInvoices = invoices.filter((x) => x.balance > 0 && getDaysOpen(x.invoice_date) > 90);
    el.execCustomers.textContent = String(state.customers.length);
    el.execInvoices.textContent = String(invoices.length);
    el.execInvoiced.textContent = formatPeso(invoices.reduce((sum, x) => sum + Number(x.total || 0), 0));
    el.execCollected.textContent = formatPeso(payments.filter((p) => p.cleared !== false).reduce((sum, x) => sum + Number(x.amount || 0), 0));
    el.execOutstanding.textContent = formatPeso(invoices.reduce((sum, x) => sum + Number(x.balance || 0), 0));
    el.execOverdue.textContent = String(overdueInvoices.length);

    el.agingTableBody.innerHTML = "";
    if (!overdueInvoices.length) {
      el.agingTableBody.innerHTML = `<tr><td colspan="7" class="muted">No 90+ day overdue invoices.</td></tr>`;
      return;
    }
    overdueInvoices.sort((a, b) => getDaysOpen(b.invoice_date) - getDaysOpen(a.invoice_date)).forEach((invoice) => {
      const customer = state.customers.find((c) => c.id === invoice.customer_id);
      const tbv = state.tbvs.find((t) => t.invoice_id === invoice.id && t.status === "PENDING");
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

  function renderNotificationsView() {
    if (!canViewNotifications()) return;
    el.tbvTableBody.innerHTML = "";
    el.notificationsOverdueBody.innerHTML = "";

    const postDatedChequesBody = ensurePostDatedChequesPanel();
    postDatedChequesBody.innerHTML = "";

    const tbvs = state.tbvs.slice().sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
    if (!tbvs.length) {
      el.tbvTableBody.innerHTML = `<tr><td colspan="7" class="muted">No TBV requests.</td></tr>`;
    } else {
      tbvs.forEach((tbv) => {
        const invoice = state.invoices.find((x) => x.id === tbv.invoice_id);
        const customer = state.customers.find((c) => c.id === invoice?.customer_id);
        const row = document.createElement("tr");
        let decisionButtons = "-";
        if (tbv.status === "PENDING" && canApproveTbv()) decisionButtons = `<button class="btn btn-light action-decide-tbv">Review</button>`;
        row.innerHTML = `
          <td>${formatDateTime(tbv.created_at)}</td>
          <td>${escapeHtml(customer?.name || "-")}</td>
          <td>${escapeHtml(invoice?.invoice_number || "-")}</td>
          <td>${escapeHtml(tbv.requested_by_name || "-")} (${escapeHtml(capitalizeRole(tbv.requested_by_role || ""))})</td>
          <td>${escapeHtml(tbv.explanation || "-")}</td>
          <td>${escapeHtml(tbv.status)}</td>
          <td>${decisionButtons}</td>
        `;
        row.querySelector(".action-decide-tbv")?.addEventListener("click", () => openTbvDecisionModal(tbv.id));
        el.tbvTableBody.appendChild(row);
      });
    }

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
          <td>${entry.openBalance > 0
            ? `<span class="notice-pill notice-pending">Invoice Outstanding</span>`
            : `<span class="status-pill status-paid">Invoice Paid</span>`}
          </td>
        `;
        postDatedChequesBody.appendChild(row);
      });
    }

    const overdue = state.invoices.filter((x) => x.balance > 0 && getDaysOpen(x.invoice_date) > 90);
    if (!overdue.length) {
      el.notificationsOverdueBody.innerHTML = `<tr><td colspan="5" class="muted">No overdue invoices.</td></tr>`;
    } else {
      overdue.forEach((invoice) => {
        const customer = state.customers.find((c) => c.id === invoice.customer_id);
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

  function populateReportCustomerFilter() {
    el.reportCustomerFilter.innerHTML = `<option value="">All Customers</option>` + state.customers.slice().sort((a, b) => a.name.localeCompare(b.name)).map((c) => `<option value="${c.id}">${escapeHtml(c.name)}</option>`).join("");
  }

  function getReportRows() {
    return state.invoices.map((invoice) => {
      const customer = state.customers.find((c) => c.id === invoice.customer_id);
      const paymentDates = state.allocations.filter((a) => a.invoice_id === invoice.id).map((a) => state.payments.find((p) => p.id === a.payment_id)?.payment_date).filter(Boolean).sort();
      const latestPaidDate = paymentDates.length ? paymentDates[paymentDates.length - 1] : "";
      return {
        customerId: customer?.id || "",
        customerName: customer?.name || "-",
        invoiceNumber: invoice.invoice_number,
        invoiceDate: invoice.invoice_date,
        poNumber: invoice.po_number || "",
        referenceInfo: invoice.reference_info || "",
        total: Number(invoice.total || 0),
        paid: Number(invoice.paidAmount || 0),
        balance: Number(invoice.balance || 0),
        status: invoice.status,
        latestPaidDate
      };
    }).filter((row) => {
      const customerId = el.reportCustomerFilter.value;
      const invoiceFrom = el.reportInvoiceDateFrom.value || null;
      const invoiceTo = el.reportInvoiceDateTo.value || null;
      const paidFrom = el.reportPaidDateFrom.value || null;
      const paidTo = el.reportPaidDateTo.value || null;
      const status = el.reportStatusFilter.value || "";
      if (customerId && row.customerId !== customerId) return false;
      if (invoiceFrom && row.invoiceDate < invoiceFrom) return false;
      if (invoiceTo && row.invoiceDate > invoiceTo) return false;
      if (status && row.status !== status) return false;
      if (paidFrom || paidTo) {
        if (!row.latestPaidDate) return false;
        if (paidFrom && row.latestPaidDate < paidFrom) return false;
        if (paidTo && row.latestPaidDate > paidTo) return false;
      }
      return true;
    }).sort((a, b) => String(b.invoiceDate).localeCompare(String(a.invoiceDate)));
  }

  function renderReportsView() {
    const rows = getReportRows();
    el.reportsTableBody.innerHTML = "";
    el.reportInvoicesCount.textContent = String(rows.length);
    el.reportTotalInvoiced.textContent = formatPeso(rows.reduce((sum, x) => sum + x.total, 0));
    el.reportTotalPaid.textContent = formatPeso(rows.reduce((sum, x) => sum + x.paid, 0));
    el.reportTotalOutstanding.textContent = formatPeso(rows.reduce((sum, x) => sum + x.balance, 0));
    if (!rows.length) {
      el.reportsTableBody.innerHTML = `<tr><td colspan="10" class="muted">No records found.</td></tr>`;
      return;
    }
    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(row.customerName)}</td>
        <td>${escapeHtml(row.invoiceNumber)}</td>
        <td>${escapeHtml(row.invoiceDate)}</td>
        <td>${escapeHtml(row.poNumber || "-")}</td>
        <td>${escapeHtml(row.referenceInfo || "-")}</td>
        <td>${formatPeso(row.total)}</td>
        <td>${formatPeso(row.paid)}</td>
        <td>${formatPeso(row.balance)}</td>
        <td>${statusPill(row.status)}</td>
        <td>${escapeHtml(row.latestPaidDate || "-")}</td>
      `;
      el.reportsTableBody.appendChild(tr);
    });
  }

  function clearReportFilters() {
    el.reportCustomerFilter.value = "";
    el.reportInvoiceDateFrom.value = "";
    el.reportInvoiceDateTo.value = "";
    el.reportPaidDateFrom.value = "";
    el.reportPaidDateTo.value = "";
    el.reportStatusFilter.value = "";
    renderReportsView();
  }

  function downloadReportCsv() {
    const rows = getReportRows();
    const headers = ["Customer", "Invoice #", "Invoice Date", "PO #", "Reference", "Total", "Paid", "Balance", "Status", "Latest Paid Date"];
    const csv = [headers.join(","), ...rows.map((r) => [csvSafe(r.customerName), csvSafe(r.invoiceNumber), csvSafe(r.invoiceDate), csvSafe(r.poNumber), csvSafe(r.referenceInfo), r.total, r.paid, r.balance, csvSafe(r.status), csvSafe(r.latestPaidDate)].join(","))].join("\n");
    downloadTextFile(`AKY_Daily_Report_${todayStr()}.csv`, csv, "text/csv;charset=utf-8");
  }

  function printReport() {
    const rows = getReportRows();
    const html = `
      <html><head><title>AKY Daily Report</title><style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      h1 { margin: 0 0 8px; }
      .meta { margin-bottom: 16px; color: #555; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background: #f3f3f3; }
      </style></head><body>
      <h1>AKY Daily Report</h1>
      <div class="meta">Generated on ${new Date().toLocaleString()}</div>
      <table><thead><tr>
      <th>Customer</th><th>Invoice #</th><th>Invoice Date</th><th>PO #</th><th>Reference</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Latest Paid Date</th>
      </tr></thead><tbody>
      ${rows.map((r) => `
        <tr><td>${escapeHtml(r.customerName)}</td><td>${escapeHtml(r.invoiceNumber)}</td><td>${escapeHtml(r.invoiceDate)}</td><td>${escapeHtml(r.poNumber || "-")}</td><td>${escapeHtml(r.referenceInfo || "-")}</td><td>${formatPeso(r.total)}</td><td>${formatPeso(r.paid)}</td><td>${formatPeso(r.balance)}</td><td>${escapeHtml(r.status)}</td><td>${escapeHtml(r.latestPaidDate || "-")}</td></tr>
      `).join("")}
      </tbody></table><script>window.onload = () => window.print();<\/script></body></html>`;
    openPrintWindow(html);
  }

  function openTbvModal(invoiceId) {
    if (!canRequestTbv()) return;
    const invoice = state.invoices.find((x) => x.id === invoiceId);
    const customer = state.customers.find((c) => c.id === invoice?.customer_id);
    if (!invoice) return;
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
    const { error } = await supabaseClient.from("invoice_void_requests").insert([{ invoice_id: invoiceId, requested_by: user.id, requested_by_name: user.username, requested_by_role: user.role, explanation, status: "PENDING" }]);
    if (error) return alert(error.message);
    await addLog("Create", "TBV Request", invoice?.invoice_number || "Invoice", explanation, null, { invoice_id: invoiceId, explanation });
    closeModal(el.tbvModal);
    state.selectedInvoiceForTbv = null;
    await refreshAndRenderAll();
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
    el.tbvDecisionInfo.innerHTML = `Customer: <strong>${escapeHtml(customer?.name || "-")}</strong><br>Invoice #: <strong>${escapeHtml(invoice?.invoice_number || "-")}</strong><br>Explanation: <strong>${escapeHtml(tbv.explanation)}</strong>`;
    openModal(el.tbvDecisionModal);
  }

  async function decideTbv(decision) {
    if (!canApproveTbv()) return;
    const tbvId = state.selectedTbvForDecision;
    if (!tbvId) return;
    const tbv = state.tbvs.find((t) => t.id === tbvId);
    if (!tbv) return;
    const notes = el.tbvDecisionNotesInput.value.trim();
    const user = getCurrentUser();
    const { error: tbvError } = await supabaseClient.from("invoice_void_requests").update({ status: decision, decision_notes: notes || null, decided_by: user.id, decided_by_name: user.username, decided_at: new Date().toISOString() }).eq("id", tbvId);
    if (tbvError) return alert(tbvError.message);
    const invoice = state.invoices.find((i) => i.id === tbv.invoice_id);
    if (decision === "APPROVED" && invoice) {
      const { error: invoiceError } = await supabaseClient.from("invoices").update({ is_voided: true, voided_at: new Date().toISOString(), voided_by: user.id }).eq("id", tbv.invoice_id);
      if (invoiceError) return alert(invoiceError.message);
      await addLog("Approve", "TBV Request", invoice.invoice_number, notes || tbv.explanation, tbv, { decision: "APPROVED" });
      await addLog("Void", "Invoice", invoice.invoice_number, tbv.explanation, invoice, null);
    } else if (invoice) {
      await addLog("Deny", "TBV Request", invoice.invoice_number, notes || "", tbv, { decision: "DENIED" });
    }
    closeModal(el.tbvDecisionModal);
    state.selectedTbvForDecision = null;
    await refreshAndRenderAll();
    alert(`TBV ${decision === "APPROVED" ? "approved" : "denied"} successfully.`);
  }

  function openSoaModal() {
    if (!canGenerateSoa()) return;
    const customer = getSelectedCustomer();
    if (!customer) return alert("Please select a customer first.");
    el.soaPreparedBy.value = state.currentProfile?.username || "";
    el.soaAsOfDate.value = todayStr();
    el.soaShowPayments.checked = true;
    openModal(el.soaModal);
  }

  function generateSoa() {
    const customer = getSelectedCustomer();
    if (!customer) return;
    const preparedBy = el.soaPreparedBy.value.trim();
    const asOfDate = el.soaAsOfDate.value;
    const showPayments = el.soaShowPayments.checked;
    if (!preparedBy) return alert("Prepared By is required.");
    if (!asOfDate) return alert("As of Date is required.");
    const outstandingInvoices = customer.invoices.filter((i) => i.balance > 0 && i.invoice_date <= asOfDate).sort((a, b) => String(a.invoice_date).localeCompare(String(b.invoice_date)));
    const previousPayments = customer.payments.filter((p) => p.payment_date <= asOfDate).sort((a, b) => String(a.payment_date).localeCompare(String(b.payment_date)));
    const totalOutstanding = outstandingInvoices.reduce((sum, i) => sum + Number(i.balance || 0), 0);
    const html = `
      <html><head><title>Statement of Account</title><style>
      body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
      .header { text-align: center; margin-bottom: 20px; line-height: 1.5; }
      .header strong { font-size: 18px; }
      h2 { text-align: center; margin: 20px 0; }
      .meta { margin-bottom: 18px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 18px; }
      th, td { border: 1px solid #cfcfcf; padding: 8px; text-align: left; }
      th { background: #f4f4f4; }
      .total { text-align: right; font-weight: bold; margin-top: 10px; }
      .signatures { margin-top: 50px; display: flex; justify-content: space-between; gap: 40px; }
      .sigbox { width: 45%; }
      .line { margin-top: 45px; border-top: 1px solid #111; padding-top: 6px; }
      </style></head><body>
      <div class="header"><strong>AKY GROUP OF COMPANIES, INC.</strong><br>Sitio Bantud, Brgy. Manoc-Manoc Boracay Malay, Aklan<br>Tel. (036) 288-4218 / 288-5369<br>E-mail address: akygroupofcompaniesinc@gmail.com</div>
      <h2>STATEMENT OF ACCOUNT</h2>
      <div class="meta"><strong>Customer:</strong> ${escapeHtml(customer.name)}<br><strong>As of Date:</strong> ${escapeHtml(asOfDate)}</div>
      <table><thead><tr><th>Invoice Date</th><th>Invoice #</th><th>PO #</th><th>Reference</th><th>Total Amount</th><th>Paid</th><th>Outstanding</th><th>Status</th></tr></thead><tbody>
      ${outstandingInvoices.length ? outstandingInvoices.map((i) => `<tr><td>${escapeHtml(i.invoice_date)}</td><td>${escapeHtml(i.invoice_number)}</td><td>${escapeHtml(i.po_number || "-")}</td><td>${escapeHtml(i.reference_info || "-")}</td><td>${formatPeso(i.total)}</td><td>${formatPeso(i.paidAmount)}</td><td>${formatPeso(i.balance)}</td><td>${escapeHtml(i.status)}</td></tr>`).join("") : `<tr><td colspan="8">No outstanding invoices.</td></tr>`}
      </tbody></table>
      ${showPayments ? `<h3>Previous Payments</h3><table><thead><tr><th>Payment Date</th><th>Type</th><th>Method</th><th>Amount</th><th>Details</th></tr></thead><tbody>${previousPayments.length ? previousPayments.map((p) => `<tr><td>${escapeHtml(p.payment_date)}</td><td>${escapeHtml(p.payment_type)}</td><td>${escapeHtml(p.method)}</td><td>${formatPeso(p.amount)}</td><td>${formatPaymentDetails(p)}</td></tr>`).join("") : `<tr><td colspan="5">No previous payments found.</td></tr>`}</tbody></table>` : ""}
      <div class="total">TOTAL OUTSTANDING: ${formatPeso(totalOutstanding)}</div>
      <div class="signatures"><div class="sigbox"><div><strong>Prepared by:</strong> ${escapeHtml(preparedBy)}</div></div><div class="sigbox"><div class="line">Received by:</div></div></div>
      <script>window.onload = () => window.print();<\/script></body></html>`;
    closeModal(el.soaModal);
    openPrintWindow(html);
  }

  function renderLogs() {
    if (!canViewLogs()) return;
    el.logTableBody.innerHTML = "";
    if (!state.logs.length) {
      el.logTableBody.innerHTML = `<tr><td colspan="7" class="muted">No log entries yet.</td></tr>`;
      return;
    }
    state.logs.forEach((log) => {
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

  async function refreshAccounts() {
    await loadAccounts();
    renderAccountsView();
  }

  async function loadAccounts() {
    if (!canManageAccounts()) return;
    try {
      const result = await callAccountAdmin("list_users", {});
      state.accounts = Array.isArray(result?.accounts) ? result.accounts : [];
    } catch (error) {
      console.error("account-admin function is missing or not deployed:", error);
      state.accounts = [];
    }
  }

  function getFilteredAccounts() {
    const term = (el.accountSearch.value || "").trim().toLowerCase();
    const role = el.accountRoleFilter.value || "";
    return state.accounts.filter((account) => {
      const haystack = `${account.username || ""} ${account.email || ""} ${account.role || ""}`.toLowerCase();
      if (term && !haystack.includes(term)) return false;
      if (role && account.role !== role) return false;
      return true;
    }).sort((a, b) => String(a.email || "").localeCompare(String(b.email || "")));
  }

  function renderAccountsView() {
    if (!canManageAccounts()) return;
    const accounts = getFilteredAccounts();
    el.accountsTableBody.innerHTML = "";
    if (!accounts.length) {
      el.accountsTableBody.innerHTML = `<tr><td colspan="7" class="muted">No accounts found. If this is the first time opening this page, click Refresh.</td></tr>`;
      return;
    }

    accounts.forEach((account) => {
      const tr = document.createElement("tr");
      const isSelf = account.id === state.currentProfile?.id;
      tr.innerHTML = `
        <td>${escapeHtml(account.username || "-")}</td>
        <td>${escapeHtml(account.email || "-")}</td>
        <td>${escapeHtml(capitalizeRole(account.role || "-"))}</td>
        <td>${account.must_change_password ? "Yes" : "No"}</td>
        <td>${account.is_active === false ? "Inactive" : "Active"}</td>
        <td>${escapeHtml(formatDateTime(account.created_at || new Date().toISOString()))}</td>
        <td>
          <div class="row-actions">
            <button class="btn btn-light action-edit-account">Edit</button>
            <button class="btn btn-secondary action-reset-account">Reset Password</button>
            <button class="btn btn-danger action-delete-account" ${isSelf ? "disabled" : ""}>Delete</button>
          </div>
        </td>
      `;
      tr.querySelector(".action-edit-account").addEventListener("click", () => openEditAccountModal(account.id));
      tr.querySelector(".action-reset-account").addEventListener("click", () => openResetPasswordModal(account.id));
      tr.querySelector(".action-delete-account").addEventListener("click", () => deleteAccount(account.id));
      el.accountsTableBody.appendChild(tr);
    });
  }

  function openCreateAccountModal() {
    if (!canManageAccounts()) return;
    state.editingAccountId = null;
    el.accountModalTitle.textContent = "Create Account";
    el.accountNameInput.value = "";
    el.accountEmailInput.value = "";
    el.accountRoleInput.value = "user";
    el.accountPasswordInput.value = "";
    el.accountMustChangePasswordInput.checked = true;
    el.accountPasswordWrap.classList.remove("hidden");
    el.accountModalHelpBox.textContent = "Owner creates the account and assigns the temporary password. The user changes it after first login.";
    openModal(el.accountModal);
  }

  function openEditAccountModal(accountId) {
    if (!canManageAccounts()) return;
    const account = state.accounts.find((x) => x.id === accountId);
    if (!account) return;
    state.editingAccountId = accountId;
    el.accountModalTitle.textContent = "Edit Account";
    el.accountNameInput.value = account.username || "";
    el.accountEmailInput.value = account.email || "";
    el.accountRoleInput.value = account.role || "user";
    el.accountPasswordInput.value = "";
    el.accountMustChangePasswordInput.checked = !!account.must_change_password;
    el.accountPasswordWrap.classList.add("hidden");
    el.accountModalHelpBox.textContent = "Use Edit to update the name, email, role, and force-password-change setting. Use Reset Password for forgotten passwords.";
    openModal(el.accountModal);
  }

  async function saveAccount() {
    if (!canManageAccounts()) return;
    const username = el.accountNameInput.value.trim();
    const email = el.accountEmailInput.value.trim().toLowerCase();
    const role = el.accountRoleInput.value;
    const password = el.accountPasswordInput.value;
    const mustChangePassword = el.accountMustChangePasswordInput.checked;

    if (!username) return alert("Full name / username is required.");
    if (!email) return alert("Email is required.");
    if (!["owner", "co-owner", "admin", "user"].includes(role)) return alert("Invalid role.");

    if (!state.editingAccountId) {
      const validationError = validatePassword(password);
      if (validationError) return alert(validationError);
      try {
        const result = await callAccountAdmin("create_user", { username, email, role, password, must_change_password: mustChangePassword });
        await addLog("Create", "Account", email, `Created account with role ${role}`, null, result?.account || { email, role, username });
        closeModal(el.accountModal);
        await refreshAccounts();
        alert("Account created successfully.");
      } catch (error) {
        console.error(error);
        alert(error.message || "Failed to create account.");
      }
      return;
    }

    try {
      const result = await callAccountAdmin("update_user", { user_id: state.editingAccountId, username, email, role, must_change_password: mustChangePassword });
      await addLog("Edit", "Account", email, `Updated account role to ${role}`, state.accounts.find((x) => x.id === state.editingAccountId) || null, result?.account || { email, role, username });
      closeModal(el.accountModal);
      state.editingAccountId = null;
      await refreshAccounts();
      alert("Account updated successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update account.");
    }
  }

  function openResetPasswordModal(accountId) {
    if (!canManageAccounts()) return;
    const account = state.accounts.find((x) => x.id === accountId);
    if (!account) return;
    state.selectedAccountForReset = accountId;
    el.resetPasswordInfo.innerHTML = `Reset password for <strong>${escapeHtml(account.username || account.email || "User")}</strong><br>Email: ${escapeHtml(account.email || "-")}`;
    el.resetPasswordInput.value = "";
    el.resetMustChangePasswordInput.checked = true;
    openModal(el.resetPasswordModal);
  }

  async function saveResetPassword() {
    if (!canManageAccounts()) return;
    const accountId = state.selectedAccountForReset;
    const newPassword = el.resetPasswordInput.value;
    const mustChangePassword = el.resetMustChangePasswordInput.checked;
    if (!accountId) return;
    const validationError = validatePassword(newPassword);
    if (validationError) return alert(validationError);
    const account = state.accounts.find((x) => x.id === accountId);
    try {
      await callAccountAdmin("reset_password", { user_id: accountId, password: newPassword, must_change_password: mustChangePassword });
      await addLog("Reset Password", "Account", account?.email || accountId, "Owner reset user password", account || null, { must_change_password: mustChangePassword });
      closeModal(el.resetPasswordModal);
      state.selectedAccountForReset = null;
      await refreshAccounts();
      alert("Password reset successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to reset password.");
    }
  }

  async function deleteAccount(accountId) {
    if (!canManageAccounts()) return;
    if (accountId === state.currentProfile?.id) return alert("You cannot delete your own owner account while logged in.");
    const account = state.accounts.find((x) => x.id === accountId);
    if (!account) return;
    const confirmed = window.confirm(`Delete account ${account.email}? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await callAccountAdmin("delete_user", { user_id: accountId });
      await addLog("Delete", "Account", account.email || accountId, "Owner deleted account", account, null);
      await refreshAccounts();
      alert("Account deleted successfully.");
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to delete account.");
    }
  }

  async function callAccountAdmin(action, payload) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    const accessToken = sessionData.session?.access_token;
    if (!accessToken) throw new Error("Your session expired. Please log in again.");
    const response = await fetch(`${ACCOUNT_ADMIN_FUNCTION_URL}?action=${encodeURIComponent(action)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload || {})
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error || result?.message || `Account admin request failed: ${response.status}`);
    return result;
  }

  async function addLog(action, entity, details, explanation, oldData, newData) {
    await supabaseClient.from("activity_logs").insert([{
      user_id: state.currentProfile?.id || null,
      username: state.currentProfile?.username || null,
      role: state.currentProfile?.role || null,
      action,
      entity,
      details: details || "",
      explanation: explanation || "",
      old_data: oldData || null,
      new_data: newData || null
    }]);
  }

  async function refreshAndRenderAll() {
    await loadAllData();
    if (canManageAccounts()) await loadAccounts();
    renderCustomerList();
    renderCurrentCustomerDashboard();
    renderExecutiveView();
    renderNotificationsView();
    renderLogs();
    renderReportsView();
    renderAccountsView();
  }

  function openModal(node) { node.style.display = "flex"; }
  function closeModal(node) { node.style.display = "none"; }

  function formatPaymentDetails(payment) {
    const details = payment.details || {};
    if (payment.method === "Cash") return escapeHtml(`Deposit to: ${details.bankAccountNumber || "-"}`);
    if (payment.method === "Online") return escapeHtml(`Ref: ${details.referenceNumber || "-"} | ${details.platformName || "-"}`);
    if (payment.method === "Cheque") return escapeHtml(`Cheque #: ${details.chequeNumber || "-"} | Date: ${details.chequeDate || "-"}${details.isPostDated ? " | Post-Dated" : ""}`);
    return "-";
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
})();
