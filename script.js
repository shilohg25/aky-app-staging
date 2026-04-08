(function () {
  "use strict";
const { supabaseClient, ACCOUNT_ADMIN_FUNCTION_URL, ROLE_PERMISSIONS, state } = window;
  
  const el = mapElements();

window.addEventListener("load", () => {
  bindEvents();
  bootstrap();
});

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
navChequeRegister: byId("navChequeRegister"),
navReports: byId("navReports"),
navLogs: byId("navLogs"),
navAccounts: byId("navAccounts"),

      customersView: byId("customersView"),
executiveView: byId("executiveView"),
notificationsView: byId("notificationsView"),
chequeRegisterView: byId("chequeRegisterView"),
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
customerDiscountSettingsWrap: byId("customerDiscountSettingsWrap"),
customerDiscountAuthorizedInput: byId("customerDiscountAuthorizedInput"),
customerDiscountConfigFields: byId("customerDiscountConfigFields"),
customerDiscountMaxAmountInput: byId("customerDiscountMaxAmountInput"),
customerDiscountNoteInput: byId("customerDiscountNoteInput"),
customerDiscountHelpText: byId("customerDiscountHelpText"),
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
invoiceDiscountWrap: byId("invoiceDiscountWrap"),
invoiceDiscountEnabled: byId("invoiceDiscountEnabled"),
invoiceDiscountControls: byId("invoiceDiscountControls"),
invoiceDiscountMode: byId("invoiceDiscountMode"),
invoiceDiscountFixedWrap: byId("invoiceDiscountFixedWrap"),
invoiceDiscountFixedAmount: byId("invoiceDiscountFixedAmount"),
invoiceDiscountReasonWrap: byId("invoiceDiscountReasonWrap"),
invoiceDiscountReason: byId("invoiceDiscountReason"),
invoiceDiscountSummary: byId("invoiceDiscountSummary"),
lineDiscountHeader: byId("lineDiscountHeader"),
lineItemsContainer: byId("lineItemsContainer"),
addLineBtn: byId("addLineBtn"),
invoiceTotalAmount: byId("invoiceTotalAmount"),
saveInvoiceBtn: byId("saveInvoiceBtn"),

      invoiceViewModal: byId("invoiceViewModal"),
      closeInvoiceViewModalBtn: byId("closeInvoiceViewModalBtn"),
      invoiceViewContent: byId("invoiceViewContent"),
paymentViewModal: byId("paymentViewModal"),
      closePaymentViewModalBtn: byId("closePaymentViewModalBtn"),
      paymentViewContent: byId("paymentViewContent"),
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
      withholdingTaxWrap: byId("withholdingTaxWrap"),
      withholdingTaxAppliedInput: byId("withholdingTaxAppliedInput"),
      withholdingTaxRateLabel: byId("withholdingTaxRateLabel"),
      withholdingTaxPreviewBox: byId("withholdingTaxPreviewBox"),
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
      notificationTbvStatusFilter: byId("notificationTbvStatusFilter"),
      notificationTbvInvoiceSearch: byId("notificationTbvInvoiceSearch"),
      downloadTbvReportBtn: byId("downloadTbvReportBtn"),
      printTbvReportBtn: byId("printTbvReportBtn"),
      notificationsOverdueBody: byId("notificationsOverdueBody"),

      reportCustomerFilter: byId("reportCustomerFilter"),
      reportInvoiceDateFrom: byId("reportInvoiceDateFrom"),
      reportInvoiceDateTo: byId("reportInvoiceDateTo"),
      reportPaidDateFrom: byId("reportPaidDateFrom"),
            reportPaidDateTo: byId("reportPaidDateTo"),
      reportStatusFilter: byId("reportStatusFilter"),
      reportInvoiceNumberSort: byId("reportInvoiceNumberSort"),
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
chequeRegisterTableBody: byId("chequeRegisterTableBody"),

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
soaPaymentRangeWrap: byId("soaPaymentRangeWrap"),
soaPaymentsFrom: byId("soaPaymentsFrom"),
soaPaymentsTo: byId("soaPaymentsTo"),
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
el.navChequeRegister.addEventListener("click", () => setView("cheque-register"));
el.navReports.addEventListener("click", () => setView("reports"));
    el.navLogs.addEventListener("click", () => setView("logs"));
    el.navAccounts.addEventListener("click", () => setView("accounts"));

    el.openCustomerModalBtn.addEventListener("click", openAddCustomerModal);
    el.customerSearch.addEventListener("input", renderCustomerList);
    el.customerSearchBtn.addEventListener("click", renderCustomerList);
    el.customerClearSearchBtn.addEventListener("click", () => {
      el.customerSearch.value = "";
      renderCustomerList();
    });

    el.closeCustomerModalBtn.addEventListener("click", () => closeModal(el.customerModal));
el.customerDiscountAuthorizedInput?.addEventListener("change", renderCustomerDiscountFields);
el.addContactBtn.addEventListener("click", () => addContactRow());
el.saveCustomerBtn.addEventListener("click", saveCustomer);

    el.createInvoiceBtn.addEventListener("click", openInvoiceModalForCreate);
el.closeInvoiceModalBtn.addEventListener("click", () => closeModal(el.invoiceModal));
el.invoiceDiscountEnabled?.addEventListener("change", renderInvoiceDiscountControls);
el.invoiceDiscountMode?.addEventListener("change", renderInvoiceDiscountControls);
el.invoiceDiscountFixedAmount?.addEventListener("input", updateInvoiceTotal);
el.addLineBtn.addEventListener("click", () => addLineItemRow());
el.saveInvoiceBtn.addEventListener("click", saveInvoice);

    el.closeInvoiceViewModalBtn.addEventListener("click", () => closeModal(el.invoiceViewModal));
el.closePaymentViewModalBtn?.addEventListener("click", () => closeModal(el.paymentViewModal));
    el.makePaymentBtn.addEventListener("click", openPaymentTypeModal);
    el.closePaymentTypeModalBtn.addEventListener("click", () => closeModal(el.paymentTypeModal));
    el.payByInvoiceBtn.addEventListener("click", openPayByInvoiceStep);
    el.partialPaymentBtn.addEventListener("click", openPartialPaymentStep);

    el.closeInvoiceSelectionModalBtn.addEventListener("click", () => closeModal(el.invoiceSelectionModal));
    el.cancelInvoiceSelectionBtn.addEventListener("click", () => closeModal(el.invoiceSelectionModal));
    el.proceedInvoiceSelectionBtn.addEventListener("click", proceedSelectedInvoices);

    el.closePartialPaymentModalBtn.addEventListener("click", () => closeModal(el.partialPaymentModal));
    el.partialAmountInput.addEventListener("input", renderPartialBalanceInfo);
    el.proceedPartialPaymentBtn.addEventListener("click", proceedPartialPayment);

        el.closePaymentMethodModalBtn.addEventListener("click", () => closeModal(el.paymentMethodModal));
    el.paymentMethodSelect.addEventListener("change", () => {
      renderPaymentMethodFields();
      renderPaymentReviewBox();
    });
    el.withholdingTaxAppliedInput?.addEventListener("change", renderWithholdingTaxUi);
    el.savePaymentBtn.addEventListener("click", async () => {
  const btn = el.savePaymentBtn;
  if (!btn || btn.dataset.busy === "1") return;

  const originalText = btn.textContent || "Finish Payment";

  btn.dataset.busy = "1";
  btn.disabled = true;
  btn.textContent = "Saving...";

  try {
    await savePayment();
  } finally {
    btn.dataset.busy = "0";
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

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

    el.notificationTbvStatusFilter?.addEventListener("change", renderTbvRequestsTable);
    el.notificationTbvInvoiceSearch?.addEventListener("input", renderTbvRequestsTable);
    el.downloadTbvReportBtn?.addEventListener("click", downloadTbvReportCsv);
    el.printTbvReportBtn?.addEventListener("click", printTbvReport);

    el.closeTbvModalBtn.addEventListener("click", () => closeModal(el.tbvModal));
    el.saveTbvBtn.addEventListener("click", saveTbvRequest);

    el.closeTbvDecisionModalBtn.addEventListener("click", () => closeModal(el.tbvDecisionModal));
    el.approveTbvBtn.addEventListener("click", () => decideTbv("APPROVED"));
    el.denyTbvBtn.addEventListener("click", () => decideTbv("DENIED"));

    el.createSOABtn.addEventListener("click", openSoaModal);
el.closeSoaModalBtn.addEventListener("click", () => closeModal(el.soaModal));
el.soaShowPayments.addEventListener("change", renderSoaPaymentRangeVisibility);
el.soaAsOfDate.addEventListener("change", autofillSoaPaymentRange);
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
    document.querySelectorAll("#logView .sortable-th").forEach((th) => {
  th.addEventListener("click", () => toggleLogSort(th.dataset.sort));
});

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

  if (profile.must_change_password) {
    openChangePasswordModal(true);
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
    }
  }

  async function showApp() {
    el.loginScreen.classList.add("hidden");
    el.appShell.classList.remove("hidden");
    renderCurrentUser();
    await loadAllData();
    if (canManageAccounts()) await loadAccounts();

    renderCustomerList();
    renderCurrentCustomerDashboard();
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
    function canAuthorizeCustomerDiscount() {
    return (state.currentProfile?.role || "") === "owner";
  }

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

  if (profile.must_change_password) {
    openChangePasswordModal(true);
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
  el.changePasswordModal.style.display = "none";
  renderCurrentUser();
  alert("Password changed successfully.");
}

  async function loadAllData() {
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
      if (customer && !isVoidedInvoice(invoice)) customer.invoices.push(invoice);
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

    if (view === "cheque-register") {
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
    const role = state.currentProfile?.role || "";
    return role === "owner" || role === "admin";
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

  function updateInvoiceDiscountSummary(editorState) {
    if (!el.invoiceDiscountSummary) return;

    if (!editorState.discountAuthorized) {
      el.invoiceDiscountSummary.innerHTML = "Discounts are not enabled for this customer.";
      return;
    }

    if (!editorState.discountEnabled) {
      el.invoiceDiscountSummary.innerHTML = `
        Customer is discount-authorized.<br>
        Max discount per invoice: <strong>${formatPeso(editorState.capAmount)}</strong>
      `;
      return;
    }

    const capStatus = editorState.exceedsCap
      ? `<span style="color:#c73636;"><strong>Over cap by ${formatPeso(editorState.discountTotalAmount - editorState.capAmount)}</strong></span>`
      : `<strong>Within cap</strong>`;

    el.invoiceDiscountSummary.innerHTML = `
      Subtotal: <strong>${formatPeso(editorState.subtotalAmount)}</strong><br>
      Line Discounts: <strong>${formatPeso(editorState.lineDiscountTotal)}</strong><br>
      Fixed Invoice Discount: <strong>${formatPeso(editorState.invoiceDiscountAmount)}</strong><br>
      Total Discount: <strong>${formatPeso(editorState.discountTotalAmount)}</strong><br>
      Final Invoice Total: <strong>${formatPeso(editorState.totalAmount)}</strong><br>
      Customer Discount Cap: <strong>${formatPeso(editorState.capAmount)}</strong> | ${capStatus}
    `;
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
  function getInvoiceDiscountBreakdownBox() {
    let box = document.getElementById("invoiceDiscountBreakdown");

    if (!box) {
      box = document.createElement("div");
      box.id = "invoiceDiscountBreakdown";
      box.className = "info-box";
      box.style.marginTop = "12px";

      const parentPanel = el.lineItemsContainer?.parentNode;
      if (parentPanel) {
        parentPanel.appendChild(box);
      }
    }

    return box;
  }
  function renderInvoiceDiscountBreakdown(editorState) {
    const box = getInvoiceDiscountBreakdownBox();
    if (!box) return;

    if (!editorState.discountAuthorized) {
      box.innerHTML = `
        Discount not authorized for this customer.<br>
        Subtotal: <strong>${formatPeso(editorState.subtotalAmount)}</strong><br>
        Final Total: <strong>${formatPeso(editorState.totalAmount)}</strong>
      `;
      return;
    }

    const capNote = editorState.exceedsCap
      ? `<span style="color:#c73636;"><strong>Over cap by ${formatPeso(editorState.discountTotalAmount - editorState.capAmount)}</strong></span>`
      : `<strong>Within cap</strong>`;

    box.innerHTML = `
      Subtotal: <strong>${formatPeso(editorState.subtotalAmount)}</strong><br>
      Discount: <strong>${formatPeso(editorState.discountTotalAmount)}</strong><br>
      Final Total: <strong>${formatPeso(editorState.totalAmount)}</strong><br>
      Customer Discount Cap: <strong>${formatPeso(editorState.capAmount)}</strong> | ${capNote}
    `;
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

  function findDuplicateInvoiceByNumber(invoiceNumber, currentInvoiceId = null) {
    const targetKey = normalizeInvoiceNumberForKey(invoiceNumber);
    if (!targetKey) return null;

    return state.invoices.find((invoice) => {
      if (!invoice) return false;
      if (currentInvoiceId && invoice.id === currentInvoiceId) return false;

      const existingKey =
        invoice.invoice_number_key ||
        normalizeInvoiceNumberForKey(invoice.invoice_number);

      return existingKey === targetKey;
    }) || null;
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

applyInvoiceDocumentLayout();
}

function applyInvoiceDocumentFile(file) {
  if (!file.type || !file.type.startsWith("image/")) {
    throw new Error("Please upload an image file only.");
  }

  if (file.size > 6 * 1024 * 1024) {
    throw new Error("Please keep the image under 6MB.");
  }

  if (invoiceDocumentState.previewUrl) {
    URL.revokeObjectURL(invoiceDocumentState.previewUrl);
  }

  invoiceDocumentState.file = file;
  invoiceDocumentState.source = "upload";
  invoiceDocumentState.previewUrl = URL.createObjectURL(file);

  const previewWrap = document.getElementById("invoiceDocumentPreviewWrap");
  const previewImg = document.getElementById("invoiceDocumentPreviewImg");

  if (previewWrap && previewImg) {
    previewImg.src = invoiceDocumentState.previewUrl;
    previewWrap.classList.remove("hidden");
  }

  setInvoiceDocumentStatus(
  "Image ready. When you click Save Invoice, this image will also be saved into Document Vault.",
  false
);

applyInvoiceDocumentLayout();
}

function clearInvoiceDocumentDraft(resetStatus = false) {
  const fileInput = document.getElementById("invoiceDocumentFileInput");
  const notesInput = document.getElementById("invoiceDocumentNotes");
  const previewWrap = document.getElementById("invoiceDocumentPreviewWrap");
  const previewImg = document.getElementById("invoiceDocumentPreviewImg");

  if (invoiceDocumentState.previewUrl) {
    URL.revokeObjectURL(invoiceDocumentState.previewUrl);
  }

  invoiceDocumentState.file = null;
  invoiceDocumentState.previewUrl = "";
  invoiceDocumentState.source = "upload";

  if (fileInput) fileInput.value = "";
  if (notesInput) notesInput.value = "";
  if (previewImg) previewImg.src = "";
  if (previewWrap) previewWrap.classList.add("hidden");

  if (resetStatus) {
  setInvoiceDocumentStatus(
    "Optional. Upload an image. It will be saved to Document Vault using the invoice number after the invoice is saved.",
    false
  );
}

applyInvoiceDocumentLayout();
}

function setInvoiceDocumentStatus(message, isError) {
  const statusBox = document.getElementById("invoiceDocumentStatus");
  if (!statusBox) return;

  statusBox.textContent = message;
  statusBox.classList.toggle("doc-status-error", !!isError);
  statusBox.classList.toggle("doc-status-success", !isError);
}

function invoiceDocumentSafeFileName(fileName) {
  const cleaned = String(fileName || "invoice-document.png")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  return cleaned || `invoice-document-${Date.now()}.png`;
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
      <td>${formatPeso(item.discount_per_qty || 0)}</td>
      <td>${formatPeso(item.line_total)}</td>
    </tr>
  `).join("");

  const showEdit = canEditInvoiceRecord(invoice);
  const showTbv = canRequestTbv() && !tbv;

  el.invoiceViewContent.innerHTML = `
    <div class="invoice-meta-grid">
      <div class="invoice-meta-card"><span>Invoice #</span><strong>${escapeHtml(invoice.invoice_number)}</strong></div>
      <div class="invoice-meta-card"><span>Date</span><strong>${escapeHtml(invoice.invoice_date)}</strong></div>
      <div class="invoice-meta-card"><span>PO #</span><strong>${escapeHtml(invoice.po_number || "-")}</strong></div>
      <div class="invoice-meta-card"><span>Reference</span><strong>${escapeHtml(invoice.reference_info || "-")}</strong></div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;">
        <strong>Invoice Document</strong>
        <span class="muted">Latest linked upload</span>
      </div>
      <div
        id="invoiceDocumentPreviewSlot"
        data-invoice-id="${invoice.id}"
        style="min-height:120px;display:flex;align-items:center;justify-content:center;background:#f8fbff;border:1px solid var(--line);border-radius:14px;padding:14px;"
      >
        <span class="muted">Loading invoice document...</span>
      </div>
    </div>

    <div class="table-wrap">
      <table class="records-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Discount / Qty</th>
            <th>Line Total</th>
          </tr>
        </thead>
        <tbody>${itemsHtml || `<tr><td colspan="5" class="muted">No line items.</td></tr>`}</tbody>
      </table>
    </div>

    ${Number(invoice.discount_total_amount || 0) > 0 ? `
      <div class="info-box" style="margin-top:16px;">
        Subtotal: <strong>${formatPeso(invoice.subtotal_amount || invoice.total)}</strong><br>
        Line Discounts: <strong>${formatPeso(invoice.line_discount_total || 0)}</strong><br>
        Fixed Invoice Discount: <strong>${formatPeso(invoice.invoice_discount_amount || 0)}</strong><br>
        Total Discount: <strong>${formatPeso(invoice.discount_total_amount || 0)}</strong><br>
        Discount Mode: <strong>${escapeHtml(invoice.discount_mode || "none")}</strong><br>
        Reason: <strong>${escapeHtml(invoice.discount_reason || "-")}</strong>
      </div>
    ` : ""}

    <div class="summary-grid" style="margin-top:16px;">
      <div class="panel summary-card"><span class="summary-label">Invoice Total</span><strong>${formatPeso(invoice.total)}</strong></div>
      <div class="panel summary-card"><span class="summary-label">Paid</span><strong>${formatPeso(invoice.paidAmount)}</strong></div>
      <div class="panel summary-card"><span class="summary-label">Balance</span><strong>${formatPeso(invoice.balance)}</strong></div>
      <div class="panel summary-card"><span class="summary-label">Status</span><strong>${escapeHtml(invoice.status)}</strong></div>
    </div>

    ${tbv ? `<div class="alert-box" style="margin-top:16px;">TBV status: ${escapeHtml(tbv.status)} | Explanation: ${escapeHtml(tbv.explanation)}</div>` : ""}

    <div class="btn-row" style="margin-top:16px;">
      ${showEdit ? `<button class="btn btn-light" id="invoiceViewEditBtn">Edit Invoice</button>` : ""}
      ${showTbv ? `<button class="btn btn-danger" id="invoiceViewTbvBtn">TBV</button>` : ""}
    </div>
  `;

  openModal(el.invoiceViewModal);

  document.getElementById("invoiceViewEditBtn")?.addEventListener("click", () => {
    closeModal(el.invoiceViewModal);
    openInvoiceModalForEdit(invoice.id);
  });

  document.getElementById("invoiceViewTbvBtn")?.addEventListener("click", () => {
    closeModal(el.invoiceViewModal);
    openTbvModal(invoice.id);
  });

  void (async () => {
    const previewSlot = document.getElementById("invoiceDocumentPreviewSlot");
    if (!previewSlot) return;

    try {
      const { data: docs, error: docsError } = await supabaseClient
        .from("customer_documents")
        .select("id, storage_path, mime_type, title, file_name, uploaded_at")
        .eq("customer_id", customer.id)
        .eq("invoice_id", invoice.id)
        .order("uploaded_at", { ascending: false })
        .limit(1);

      if (docsError) {
        throw new Error(docsError.message || "Could not load invoice document record.");
      }

      const doc = Array.isArray(docs) && docs.length ? docs[0] : null;

      if (!doc?.storage_path) {
        previewSlot.innerHTML = `<div class="muted">No uploaded invoice image for this invoice yet.</div>`;
        return;
      }

      const { data: fileBlob, error: fileError } = await supabaseClient.storage
        .from("customer-documents")
        .download(doc.storage_path);

      if (fileError || !fileBlob) {
        throw new Error(fileError?.message || "Could not load invoice document file.");
      }

      const currentSlot = document.getElementById("invoiceDocumentPreviewSlot");
      if (!currentSlot || currentSlot.getAttribute("data-invoice-id") !== String(invoice.id)) {
        return;
      }

      if (window.__akyInvoicePreviewUrl) {
        URL.revokeObjectURL(window.__akyInvoicePreviewUrl);
      }

      const blobUrl = URL.createObjectURL(fileBlob);
      window.__akyInvoicePreviewUrl = blobUrl;

      const safeTitle = escapeHtml(doc.title || doc.file_name || invoice.invoice_number || "Invoice document");
      const safeFileName = escapeHtml(doc.file_name || "invoice-document");
      const isImage = String(doc.mime_type || "").toLowerCase().startsWith("image/");

      if (!isImage) {
        currentSlot.innerHTML = `
          <div style="width:100%;text-align:center;">
            <div class="muted" style="margin-bottom:12px;">A linked document exists, but it is not an image preview.</div>
            <div style="font-weight:700;margin-bottom:12px;">${safeTitle}</div>
            <button class="btn btn-light" type="button" id="invoiceDocumentOpenBtn">Open Document</button>
          </div>
        `;

        document.getElementById("invoiceDocumentOpenBtn")?.addEventListener("click", () => {
          window.open(blobUrl, "_blank", "noopener,noreferrer");
        });

        return;
      }

      currentSlot.innerHTML = `
        <div style="width:100%;">
          <div class="muted" style="margin-bottom:10px;">${safeFileName}</div>
          <img
            src="${blobUrl}"
            alt="${safeTitle}"
            style="display:block;width:100%;max-height:480px;object-fit:contain;border:1px solid var(--line);border-radius:12px;background:#ffffff;"
          />
          <div class="btn-row" style="margin-top:12px;">
            <button class="btn btn-light" type="button" id="invoiceDocumentOpenBtn">Open Full Image</button>
          </div>
        </div>
      `;

      document.getElementById("invoiceDocumentOpenBtn")?.addEventListener("click", () => {
        window.open(blobUrl, "_blank", "noopener,noreferrer");
      });
    } catch (error) {
      const currentSlot = document.getElementById("invoiceDocumentPreviewSlot");
      if (!currentSlot || currentSlot.getAttribute("data-invoice-id") !== String(invoice.id)) {
        return;
      }

      currentSlot.innerHTML = `
        <div class="muted">Could not load invoice document.</div>
        <div class="muted" style="margin-top:6px;">${escapeHtml(error.message || "Unknown error.")}</div>
      `;
    }
  })();
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
    if (!file.type || !file.type.startsWith("image/")) {
      throw new Error("Please upload an image file only.");
    }

    if (file.size > 6 * 1024 * 1024) {
      throw new Error("Please keep the image under 6MB.");
    }

    if (paymentDocumentState.previewUrl) {
      URL.revokeObjectURL(paymentDocumentState.previewUrl);
    }

    paymentDocumentState.file = file;
    paymentDocumentState.source = "upload";
    paymentDocumentState.previewUrl = URL.createObjectURL(file);

    const previewWrap = document.getElementById("paymentDocumentPreviewWrap");
    const previewImg = document.getElementById("paymentDocumentPreviewImg");

    if (previewWrap && previewImg) {
      previewImg.src = paymentDocumentState.previewUrl;
      previewWrap.classList.remove("hidden");
    }

    setPaymentDocumentStatus(
      "Image ready. When you click Finish Payment, this image will also be saved to Document Vault.",
      false
    );
  }

  function clearPaymentDocumentDraft(resetStatus = false) {
    const fileInput = document.getElementById("paymentDocumentFileInput");
    const previewWrap = document.getElementById("paymentDocumentPreviewWrap");
    const previewImg = document.getElementById("paymentDocumentPreviewImg");

    if (paymentDocumentState.previewUrl) {
      URL.revokeObjectURL(paymentDocumentState.previewUrl);
    }

    paymentDocumentState.file = null;
    paymentDocumentState.previewUrl = "";
    paymentDocumentState.source = "upload";

    if (fileInput) fileInput.value = "";
    if (previewImg) previewImg.src = "";
    if (previewWrap) previewWrap.classList.add("hidden");

    if (resetStatus) {
      setPaymentDocumentStatus(
        "Optional. Upload one payment proof image. It will be saved to Document Vault after the payment is saved.",
        false
      );
    }
  }

  function setPaymentDocumentStatus(message, isError) {
    const statusBox = document.getElementById("paymentDocumentStatus");
    if (!statusBox) return;

    statusBox.textContent = message;
    statusBox.classList.toggle("doc-status-error", !!isError);
    statusBox.classList.toggle("doc-status-success", !isError);
  }

  function paymentDocumentSafeFileName(fileName) {
    const cleaned = String(fileName || "payment-proof.png")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    return cleaned || `payment-proof-${Date.now()}.png`;
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
  function viewPayment(paymentId) {
  const customer = getSelectedCustomer();
  if (!customer) return;

  const payment = customer.payments.find((item) => item.id === paymentId);
  if (!payment) return;

  const details = getPaymentDetailsObject(payment);
  const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];
  const paymentStatus = payment.method === "Cheque"
    ? getChequeStatus(payment)
    : (payment.cleared === false ? "Pending" : "Collected");

  const appliedRowsHtml = allocations.length
    ? allocations.map((alloc) => {
        const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
        return `
          <tr>
            <td>${escapeHtml(getInvoiceReferenceLabel(invoice))}</td>
            <td>${formatPeso(getAllocationAmount(alloc))}</td>
          </tr>
        `;
      }).join("")
    : `<tr><td colspan="2" class="muted">No invoice allocations.</td></tr>`;

  const replacementInfoHtml = details.isReplacementPayment
    ? `
      <div class="info-box" style="margin-top:16px;">
        Replacement Payment<br>
        Replaces Cheque #: <strong>${escapeHtml(details.replacesChequeNumber || "-")}</strong><br>
        Root Ref: <strong>${escapeHtml(details.replacementRootPaymentId || details.replacesPaymentId || "-")}</strong>
      </div>
    `
    : "";

  const withholdingInfoHtml = details.withholdingTaxApplied
    ? `
      <div class="info-box" style="margin-top:16px;">
        Withholding Tax: <strong>${formatPeso(details.withholdingTaxAmount || 0)}</strong><br>
        Net Received: <strong>${formatPeso(details.netReceivedAmount ?? payment.amount ?? 0)}</strong><br>
        Formula: <strong>${escapeHtml(details.withholdingTaxFormula || "gross / (1 + vat_rate) × tax_rate")}</strong>
      </div>
    `
    : "";

  el.paymentViewContent.innerHTML = `
    <div class="invoice-meta-grid">
      <div class="invoice-meta-card"><span>Date</span><strong>${escapeHtml(payment.payment_date || "-")}</strong></div>
      <div class="invoice-meta-card"><span>Type</span><strong>${escapeHtml(getPaymentTypeLabel(payment))}</strong></div>
      <div class="invoice-meta-card"><span>Method</span><strong>${escapeHtml(payment.method || "-")}</strong></div>
      <div class="invoice-meta-card"><span>Status</span><strong>${escapeHtml(paymentStatus)}</strong></div>
    </div>

    <div class="summary-grid" style="margin-bottom:16px;">
      <div class="panel summary-card"><span class="summary-label">Gross Amount</span><strong>${formatPeso(payment.amount)}</strong></div>
      <div class="panel summary-card"><span class="summary-label">Created By</span><strong>${escapeHtml(payment.created_by_name || "-")}</strong></div>
      <div class="panel summary-card"><span class="summary-label">Created Role</span><strong>${escapeHtml(payment.created_by_role || "-")}</strong></div>
      <div class="panel summary-card"><span class="summary-label">Created At</span><strong>${escapeHtml(payment.created_at ? formatDateTime(payment.created_at) : "-")}</strong></div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;">
        <strong>Payment Reference</strong>
        <span class="muted">Saved payment details</span>
      </div>
      <div class="form-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
        <div class="invoice-meta-card">
          <span>Bank / Platform</span>
          <strong>${escapeHtml(details.platformName || details.bankAccountNumber || "-")}</strong>
        </div>
        <div class="invoice-meta-card">
          <span>Reference / Cheque #</span>
          <strong>${escapeHtml(details.referenceNumber || details.chequeNumber || "-")}</strong>
        </div>
        <div class="invoice-meta-card">
          <span>Cheque Date</span>
          <strong>${escapeHtml(details.chequeDate || "-")}</strong>
        </div>
        <div class="invoice-meta-card">
          <span>Post-Dated</span>
          <strong>${details.isPostDated ? "Yes" : "No"}</strong>
        </div>
      </div>
    </div>

    <div class="panel" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;">
        <strong>Payment Proof</strong>
        <span class="muted">Latest linked upload</span>
      </div>
      <div
        id="paymentDocumentPreviewSlot"
        data-payment-id="${payment.id}"
        style="min-height:120px;display:flex;align-items:center;justify-content:center;background:#f8fbff;border:1px solid var(--line);border-radius:14px;padding:14px;"
      >
        <span class="muted">Loading payment proof...</span>
      </div>
    </div>

    <div class="table-wrap">
      <table class="records-table">
        <thead>
          <tr>
            <th>Applied Invoice</th>
            <th>Allocated Amount</th>
          </tr>
        </thead>
        <tbody>${appliedRowsHtml}</tbody>
      </table>
    </div>

    ${replacementInfoHtml}
    ${withholdingInfoHtml}
  `;

  openModal(el.paymentViewModal);

  void (async () => {
    const previewSlot = document.getElementById("paymentDocumentPreviewSlot");
    if (!previewSlot) return;

    try {
      const { data: docs, error: docsError } = await supabaseClient
        .from("customer_documents")
        .select("id, storage_path, mime_type, title, file_name, uploaded_at")
        .eq("customer_id", customer.id)
        .eq("payment_id", payment.id)
        .order("uploaded_at", { ascending: false })
        .limit(1);

      if (docsError) {
        throw new Error(docsError.message || "Could not load payment proof record.");
      }

      const doc = Array.isArray(docs) && docs.length ? docs[0] : null;

      if (!doc?.storage_path) {
        previewSlot.innerHTML = `<div class="muted">No uploaded payment proof for this payment yet.</div>`;
        return;
      }

      const { data: fileBlob, error: fileError } = await supabaseClient.storage
        .from("customer-documents")
        .download(doc.storage_path);

      if (fileError || !fileBlob) {
        throw new Error(fileError?.message || "Could not load payment proof file.");
      }

      const currentSlot = document.getElementById("paymentDocumentPreviewSlot");
      if (!currentSlot || currentSlot.getAttribute("data-payment-id") !== String(payment.id)) {
        return;
      }

      if (window.__akyPaymentPreviewUrl) {
        URL.revokeObjectURL(window.__akyPaymentPreviewUrl);
      }

      const blobUrl = URL.createObjectURL(fileBlob);
      window.__akyPaymentPreviewUrl = blobUrl;

      const safeTitle = escapeHtml(doc.title || doc.file_name || "Payment proof");
      const safeFileName = escapeHtml(doc.file_name || "payment-proof");
      const isImage = String(doc.mime_type || "").toLowerCase().startsWith("image/");

      if (!isImage) {
        currentSlot.innerHTML = `
          <div style="width:100%;text-align:center;">
            <div class="muted" style="margin-bottom:12px;">A linked document exists, but it is not an image preview.</div>
            <div style="font-weight:700;margin-bottom:12px;">${safeTitle}</div>
            <button class="btn btn-light" type="button" id="paymentDocumentOpenBtn">Open Document</button>
          </div>
        `;

        document.getElementById("paymentDocumentOpenBtn")?.addEventListener("click", () => {
          window.open(blobUrl, "_blank", "noopener,noreferrer");
        });

        return;
      }

      currentSlot.innerHTML = `
        <div style="width:100%;">
          <div class="muted" style="margin-bottom:10px;">${safeFileName}</div>
          <img
            src="${blobUrl}"
            alt="${safeTitle}"
            style="display:block;width:100%;max-height:480px;object-fit:contain;border:1px solid var(--line);border-radius:12px;background:#ffffff;"
          />
          <div class="btn-row" style="margin-top:12px;">
            <button class="btn btn-light" type="button" id="paymentDocumentOpenBtn">Open Full Image</button>
          </div>
        </div>
      `;

      document.getElementById("paymentDocumentOpenBtn")?.addEventListener("click", () => {
        window.open(blobUrl, "_blank", "noopener,noreferrer");
      });
    } catch (error) {
      const currentSlot = document.getElementById("paymentDocumentPreviewSlot");
      if (!currentSlot || currentSlot.getAttribute("data-payment-id") !== String(payment.id)) {
        return;
      }

      currentSlot.innerHTML = `
        <div class="muted">Could not load payment proof.</div>
        <div class="muted" style="margin-top:6px;">${escapeHtml(error.message || "Unknown error.")}</div>
      `;
    }
  })();
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
      const appliedTo = (payment.allocations || []).map((alloc) => {
        const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
        return `${getInvoiceReferenceLabel(invoice)} (${formatPeso(getAllocationAmount(alloc))})`;
      }).join(", ");

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
    async function markChequeCleared(paymentId) {
    if (!canManageChequeRegister()) return;

    const payment = state.payments.find((p) => p.id === paymentId);
    if (!payment) return alert("Cheque payment not found.");

    const status = getChequeStatus(payment);
    if (status !== "Pending") return alert("Only pending cheques can be cleared.");

    const confirmed = window.confirm("Mark this cheque as cleared?");
    if (!confirmed) return;

    for (const alloc of payment.allocations || []) {
      const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
      if (!invoice) continue;

      const invoiceTotal = Number(invoice.total || invoice.total_amount || 0);
      const currentPaid = Number(invoice.paidAmount || invoice.paid_amount || 0);
      const allocAmount = getAllocationAmount(alloc);

      if (round2(currentPaid + allocAmount) > round2(invoiceTotal)) {
        return alert(
          `Cannot clear this cheque because invoice ${invoice.invoice_number || ""} would exceed its total. ` +
          `This cheque may have been recorded under the old logic and needs owner review first.`
        );
      }
    }

    for (const alloc of payment.allocations || []) {
      const invoice = state.invoices.find((inv) => inv.id === alloc.invoice_id);
      if (!invoice) continue;

      const invoiceTotal = Number(invoice.total || invoice.total_amount || 0);
      const currentPaid = Number(invoice.paidAmount || invoice.paid_amount || 0);
      const allocAmount = getAllocationAmount(alloc);

      const newPaid = round2(currentPaid + allocAmount);
      const newBalance = round2(Math.max(0, invoiceTotal - newPaid));
      const newStatus = newBalance <= 0 ? "PAID" : newBalance < invoiceTotal ? "PARTIALLY_PAID" : "UNPAID";

      const { error: invoiceError } = await supabaseClient
        .from("invoices")
        .update({
          paid_amount: newPaid,
          balance_amount: newBalance,
          primary_status: newStatus
        })
        .eq("id", alloc.invoice_id);

      if (invoiceError) return alert(invoiceError.message);
    }

    const updatedDetails = {
      ...(payment.details || {}),
      clearedAt: new Date().toISOString(),
      clearedBy: state.currentProfile?.id || null,
      clearedByName: state.currentProfile?.username || state.currentProfile?.email || "User",
      bouncedAt: null,
      bouncedBy: null,
      bouncedByName: null,
      bounceReason: null
    };

    const { error: paymentError } = await supabaseClient
      .from("payments")
      .update({
        cleared: true,
        details: updatedDetails
      })
      .eq("id", paymentId);

    if (paymentError) return alert(paymentError.message);

    await addLog(
      "Clear",
      "Cheque Payment",
      `${payment.payment_type} - Cheque - ${formatPeso(payment.amount)}`,
      "Cheque marked as cleared",
      payment,
      { payment_id: paymentId, status: "CLEARED" }
    );

        await refreshWorkflowViewsOnly(payment.customer_id || null);
    alert("Cheque marked as cleared.");
  }

  async function markChequeBounced(paymentId) {
    if (!canManageChequeRegister()) return;

    const payment = state.payments.find((p) => p.id === paymentId);
    if (!payment) return alert("Cheque payment not found.");

    const status = getChequeStatus(payment);
    if (status !== "Pending") return alert("Only pending cheques can be marked as bounced.");

    const reason = window.prompt("Enter bounce reason:", "Insufficient funds");
    if (reason === null) return;

    const updatedDetails = {
      ...(payment.details || {}),
      bouncedAt: new Date().toISOString(),
      bouncedBy: state.currentProfile?.id || null,
      bouncedByName: state.currentProfile?.username || state.currentProfile?.email || "User",
      bounceReason: reason.trim() || "No reason provided",
      clearedAt: null,
      clearedBy: null,
      clearedByName: null
    };

    const { error } = await supabaseClient
      .from("payments")
      .update({
        cleared: false,
        details: updatedDetails
      })
      .eq("id", paymentId);

    if (error) return alert(error.message);

    await addLog(
      "Bounce",
      "Cheque Payment",
      `${payment.payment_type} - Cheque - ${formatPeso(payment.amount)}`,
      updatedDetails.bounceReason,
      payment,
      { payment_id: paymentId, status: "BOUNCED" }
    );

        await refreshWorkflowViewsOnly(payment.customer_id || null);
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
    if (!canManageChequeRegister()) return;

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
      el.chequeRegisterTableBody.innerHTML = `<tr><td colspan="9" class="muted">No cheque payments found.</td></tr>`;
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

      if (canManageChequeRegister()) {
        if (status === "Pending") {
          actionHtml = `
            <div class="row-actions">
              <button class="btn btn-primary action-clear-cheque">Clear</button>
              <button class="btn btn-danger action-bounce-cheque">Bounce</button>
            </div>
          `;
        } else if (status === "Bounced") {
          const replacementState = getReplacementStateForBouncedCheque(payment);

          if (replacementState.isFullyReplaced) {
            actionHtml = `<span class="muted">Replacement Recorded</span>`;
          } else {
            actionHtml = `
              <div class="row-actions">
                <button class="btn btn-secondary action-replace-cheque">${escapeHtml(replacementState.buttonLabel)}</button>
              </div>
            `;
          }
        } else {
          actionHtml = `<span class="muted">Completed</span>`;
        }
      } else if (status === "Bounced") {
        const replacementState = getReplacementStateForBouncedCheque(payment);
        actionHtml = replacementState.isFullyReplaced
          ? `<span class="muted">Replacement Recorded</span>`
          : `<span class="muted">${escapeHtml(replacementState.buttonLabel)}</span>`;
      }

      row.innerHTML = `
        <td>${escapeHtml(payment.payment_date || "-")}</td>
        <td>${escapeHtml(customer?.name || "-")}</td>
        <td>${escapeHtml(details.chequeNumber || "-")}</td>
        <td>${escapeHtml(details.chequeDate || "-")}</td>
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
        const invoice = state.invoices.find((x) => x.id === tbv.invoice_id);
        const customer = state.customers.find((c) => c.id === invoice?.customer_id);
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
    const sortMode = el.reportInvoiceNumberSort?.value || "date_desc";
    const invoiceNumberCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

    return getActiveInvoices().map((invoice) => {
      const customer = state.customers.find((c) => c.id === invoice.customer_id);
      const paymentDates = state.allocations
        .filter((a) => a.invoice_id === invoice.id)
        .map((a) => state.payments.find((p) => p.id === a.payment_id))
        .filter((payment) => payment && isOperationallyCollectedPayment(payment))
        .map((payment) => payment.payment_date)
        .filter(Boolean)
        .sort();

      const latestPaidDate = paymentDates.length ? paymentDates[paymentDates.length - 1] : "";

      return {
        customerId: customer?.id || "",
        customerName: customer?.name || "-",
        invoiceNumber: invoice.invoice_number || "",
        invoiceDate: invoice.invoice_date || "",
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
    }).sort((a, b) => {
      if (sortMode === "invoice_asc") {
        return invoiceNumberCollator.compare(String(a.invoiceNumber || ""), String(b.invoiceNumber || ""));
      }

      if (sortMode === "invoice_desc") {
        return invoiceNumberCollator.compare(String(b.invoiceNumber || ""), String(a.invoiceNumber || ""));
      }

      return String(b.invoiceDate || "").localeCompare(String(a.invoiceDate || ""));
    });
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
    if (el.reportInvoiceNumberSort) el.reportInvoiceNumberSort.value = "date_desc";
    renderReportsView();
  }

    function downloadTbvReportCsv() {
    const rows = getFilteredTbvRows();
    if (!rows.length) return alert("No TBV rows to export.");

    const headers = ["Date Requested", "Customer", "Invoice #", "Invoice Status", "Requested By", "Explanation", "TBV Status", "Decision Date", "Decided By", "Decision Notes"];
    const csv = [
      headers.join(","),
      ...rows.map((row) => [
        csvSafe(row.createdAtDisplay),
        csvSafe(row.customerName),
        csvSafe(row.invoiceNumber),
        csvSafe(row.invoiceStatusText),
        csvSafe(row.requestedByDisplay),
        csvSafe(row.explanation),
        csvSafe(row.tbvStatus),
        csvSafe(row.decisionDateDisplay),
        csvSafe(row.decidedBy),
        csvSafe(row.decisionNotes)
      ].join(","))
    ].join("\n");

    downloadTextFile(`AKY_TBV_Report_${todayStr()}.csv`, csv, "text/csv;charset=utf-8");
  }

  function printTbvReport() {
    const rows = getFilteredTbvRows();
    if (!rows.length) return alert("No TBV rows to print.");

    const statusFilter = el.notificationTbvStatusFilter?.value || "All";
    const invoiceSearch = (el.notificationTbvInvoiceSearch?.value || "").trim() || "None";
    const html = `
      <html><head><title>AKY TBV Report</title><style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      h1 { margin: 0 0 8px; }
      .meta { margin-bottom: 16px; color: #555; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
      th { background: #f3f3f3; }
      </style></head><body>
      <h1>AKY TBV Report</h1>
      <div class="meta">Generated on ${new Date().toLocaleString()}<br>TBV Status Filter: ${escapeHtml(statusFilter)}<br>Invoice # Search: ${escapeHtml(invoiceSearch)}</div>
      <table><thead><tr>
      <th>Date Requested</th><th>Customer</th><th>Invoice #</th><th>Invoice Status</th><th>Requested By</th><th>Explanation</th><th>TBV Status</th><th>Decision Date</th><th>Decided By</th><th>Decision Notes</th>
      </tr></thead><tbody>
      ${rows.map((row) => `
        <tr>
          <td>${escapeHtml(row.createdAtDisplay)}</td>
          <td>${escapeHtml(row.customerName)}</td>
          <td>${escapeHtml(row.invoiceNumber)}</td>
          <td>${escapeHtml(row.invoiceStatusText)}</td>
          <td>${escapeHtml(row.requestedByDisplay)}</td>
          <td>${escapeHtml(row.explanation)}</td>
          <td>${escapeHtml(row.tbvStatus)}</td>
          <td>${escapeHtml(row.decisionDateDisplay)}</td>
          <td>${escapeHtml(row.decidedBy)}</td>
          <td>${escapeHtml(row.decisionNotes)}</td>
        </tr>
      `).join("")}
      </tbody></table><script>window.onload = () => window.print();<\/script></body></html>`;

    openPrintWindow(html);
  }

  function downloadReportCsv() {
    const rows = getReportRows();
    const headers = ["Customer", "Invoice #", "Invoice Date", "PO #", "Reference", "Total", "Paid", "Balance", "Status", "Latest Paid Date"];
    const csv = [headers.join(","), ...rows.map((r) => [csvSafe(r.customerName), csvSafe(r.invoiceNumber), csvSafe(r.invoiceDate), csvSafe(r.poNumber), csvSafe(r.referenceInfo), r.total, r.paid, r.balance, csvSafe(r.status), csvSafe(r.latestPaidDate)].join(","))].join("\n");
    downloadTextFile(`AKY_Report_${todayStr()}.csv`, csv, "text/csv;charset=utf-8");
  }

  function printReport() {
    const rows = getReportRows();
    const html = `
      <html><head><title>AKY Report</title><style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
      h1 { margin: 0 0 8px; }
      .meta { margin-bottom: 16px; color: #555; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background: #f3f3f3; }
      </style></head><body>
      <h1>AKY Report</h1>
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
    const { error } = await supabaseClient.from("invoice_void_requests").insert([{ invoice_id: invoiceId, requested_by: user.id, requested_by_name: user.username, requested_by_role: user.role, explanation, status: "PENDING" }]);
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
        await refreshWorkflowViewsOnly(invoice?.customer_id || null);
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
  function openSoaModal() {
  if (!canGenerateSoa()) return;

  const customer = getSelectedCustomer();
  if (!customer) return alert("Please select a customer first.");

  el.soaPreparedBy.value = state.currentProfile?.username || state.currentProfile?.email || "";
  el.soaAsOfDate.value = todayStr();
  el.soaShowPayments.checked = true;

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
      if (canManageAccounts()) await loadAccounts();
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
    if (canManageAccounts()) await loadAccounts();

    renderCustomerList();
    renderCurrentCustomerDashboard();

    if (state.currentView !== "customers") {
      renderLazyView(state.currentView);
    }
  }

  function openModal(node) { node.style.display = "flex"; }
  function closeModal(node) {
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

    if (payment.method === "Cash") {
      return escapeHtml(`Deposit to: ${details.bankAccountNumber || "-"}${replacementText}${rootText}${taxText}`);
    }

    if (payment.method === "Online") {
      return escapeHtml(`Ref: ${details.referenceNumber || "-"} | ${details.platformName || "-"}${replacementText}${rootText}${taxText}`);
    }

    if (payment.method === "Cheque") {
      return escapeHtml(`Cheque #: ${details.chequeNumber || "-"} | Date: ${details.chequeDate || "-"}${details.isPostDated ? " | Post-Dated" : ""}${replacementText}${rootText}${taxText}`);
    }

    const fallbackText = `${replacementText}${rootText}${taxText}`.replace(/^ \| /, "");
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
  const aiDocAssist = {
    invoice: { imageDataUrl: "" },
    payment: { imageDataUrl: "" }
  };

  initAiDocumentAssist();

  function initAiDocumentAssist() {
    bindAiUploadUi({
      kind: "invoice",
      fileInputId: "invoiceAiFileInput",
      pasteZoneId: "invoiceAiPasteZone",
      previewWrapId: "invoiceAiPreviewWrap",
      previewImgId: "invoiceAiPreviewImg",
      statusId: "invoiceAiStatus",
      analyzeBtnId: "invoiceAiAnalyzeBtn",
      clearBtnId: "invoiceAiClearBtn",
      analyzeHandler: analyzeInvoiceDocumentWithAi
    });

    bindAiUploadUi({
      kind: "payment",
      fileInputId: "paymentAiFileInput",
      pasteZoneId: "paymentAiPasteZone",
      previewWrapId: "paymentAiPreviewWrap",
      previewImgId: "paymentAiPreviewImg",
      statusId: "paymentAiStatus",
      analyzeBtnId: "paymentAiAnalyzeBtn",
      clearBtnId: "paymentAiClearBtn",
      analyzeHandler: analyzePaymentDocumentWithAi
    });
  }

  function bindAiUploadUi(config) {
    const fileInput = document.getElementById(config.fileInputId);
    const pasteZone = document.getElementById(config.pasteZoneId);
    const previewWrap = document.getElementById(config.previewWrapId);
    const previewImg = document.getElementById(config.previewImgId);
    const statusBox = document.getElementById(config.statusId);
    const analyzeBtn = document.getElementById(config.analyzeBtnId);
    const clearBtn = document.getElementById(config.clearBtnId);

    if (!fileInput || !pasteZone || !previewWrap || !previewImg || !statusBox || !analyzeBtn || !clearBtn) {
      return;
    }

    const setStatus = (html) => {
      statusBox.innerHTML = html;
    };

    const setPreview = (dataUrl) => {
      aiDocAssist[config.kind].imageDataUrl = dataUrl || "";
      previewImg.src = dataUrl || "";
      previewWrap.classList.toggle("hidden", !dataUrl);

      if (dataUrl) {
        setStatus("Image ready. Click <strong>Analyze with AI</strong> to fill the form.");
      } else {
        setStatus("Nothing uploaded yet.");
      }
    };

    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const dataUrl = await aiFileToDataUrl(file);
        setPreview(dataUrl);
      } catch (error) {
        alert(error.message || "Could not read the image.");
      }
    });

    pasteZone.addEventListener("paste", async (event) => {
      const items = [...(event.clipboardData?.items || [])];
      const imageItem = items.find((item) => item.type.startsWith("image/"));

      if (!imageItem) {
        setStatus("No image found in clipboard. Use Snipping Tool, copy the image, click this box, then press <strong>Ctrl + V</strong>.");
        return;
      }

      event.preventDefault();

      const file = imageItem.getAsFile();
      if (!file) {
        setStatus("Clipboard image could not be read. Try copying the snippet again.");
        return;
      }

      try {
        const dataUrl = await aiFileToDataUrl(file);
        setPreview(dataUrl);
      } catch (error) {
        alert(error.message || "Could not read the pasted image.");
      }
    });

    pasteZone.addEventListener("click", () => pasteZone.focus());
    analyzeBtn.addEventListener("click", config.analyzeHandler);

    clearBtn.addEventListener("click", () => {
      fileInput.value = "";
      setPreview("");
    });
  }

  function aiSetBusy(kind, isBusy) {
    const analyzeBtn = document.getElementById(`${kind}AiAnalyzeBtn`);
    const clearBtn = document.getElementById(`${kind}AiClearBtn`);
    const fileInput = document.getElementById(`${kind}AiFileInput`);
    const pasteZone = document.getElementById(`${kind}AiPasteZone`);

    if (analyzeBtn) {
      analyzeBtn.disabled = isBusy;
      analyzeBtn.textContent = isBusy ? "Analyzing..." : "Analyze with AI";
    }

    if (clearBtn) clearBtn.disabled = isBusy;
    if (fileInput) fileInput.disabled = isBusy;
    if (pasteZone) pasteZone.classList.toggle("disabled", !!isBusy);
  }

  async function aiFileToDataUrl(file) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please use an image file.");
    }

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Could not read the selected image."));
      reader.readAsDataURL(file);
    });
  }

  async function callAiDocumentAssist(payload) {
  const { data, error } = await supabaseClient.functions.invoke("ai-document-assist", {
    body: payload
  });

  if (error) {
    try {
      if (error.context) {
        const rawText = await error.context.text();

        try {
          const parsed = JSON.parse(rawText);
          throw new Error(
            parsed?.error ||
            parsed?.details ||
            parsed?.message ||
            rawText ||
            error.message ||
            "AI function call failed."
          );
        } catch (jsonParseError) {
          throw new Error(rawText || error.message || "AI function call failed.");
        }
      }

      throw new Error(error.message || "AI function call failed.");
    } catch (innerError) {
      throw new Error(innerError.message || error.message || "AI function call failed.");
    }
  }

  if (!data?.ok) {
    throw new Error(data?.error || "AI extraction failed.");
  }

  return data.result;
}

  async function analyzeInvoiceDocumentWithAi() {
    if (state.currentProfile?.role !== "owner") {
  alert("Only owner can use AI Assist.");
  return;
}
    const statusBox = document.getElementById("invoiceAiStatus");
    const imageDataUrl = aiDocAssist.invoice.imageDataUrl;
    const customer = getSelectedCustomer();

    if (!customer) {
      alert("Please select a customer first.");
      return;
    }

    if (!imageDataUrl) {
      alert("Upload or paste an invoice image first.");
      return;
    }

    aiSetBusy("invoice", true);
    statusBox.innerHTML = "Analyzing invoice image...";

    try {
      const result = await callAiDocumentAssist({
        mode: "invoice",
        imageDataUrl,
        customerName: customer.name || null
      });

      applyInvoiceAiResult(result);
    } catch (error) {
      statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> ${escapeHtml(error.message || "Unknown error")}</span>`;
    } finally {
      aiSetBusy("invoice", false);
    }
  }

  function applyInvoiceAiResult(result) {
    const statusBox = document.getElementById("invoiceAiStatus");

    if (!result || typeof result !== "object") {
      statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> Invalid response.</span>`;
      return;
    }

    if (result.invoice_number) el.invoiceNumber.value = String(result.invoice_number);
    if (result.invoice_date) el.invoiceDate.value = String(result.invoice_date);
    if (result.po_number) el.poNumber.value = String(result.po_number);
    if (result.reference_info) el.referenceInfo.value = String(result.reference_info);

    const items = Array.isArray(result.line_items) ? result.line_items : [];
    el.lineItemsContainer.innerHTML = "";

    items
      .filter((item) => item && (item.product_name || item.qty || item.unit_price))
      .forEach((item) => {
        addLineItemRow({
          product: item.product_name || "",
          qty: item.qty ?? "",
          price: item.unit_price ?? "",
          discountPerQty: 0
        });
      });

    if (!el.lineItemsContainer.children.length) {
      addLineItemRow();
    }

    updateInvoiceTotal();

    const editorState = getInvoiceEditorState();
    const detectedTotal = Number(result.total_amount || 0);
    const appTotal = Number(editorState.totalAmount || 0);
    const hasTotalMismatch =
      detectedTotal > 0 &&
      Math.abs(round2(detectedTotal) - round2(appTotal)) > 0.01;

    const warnings = Array.isArray(result.warnings) ? result.warnings : [];
    const warningHtml = [
      ...(hasTotalMismatch
        ? [`Detected total ${formatPeso(detectedTotal)} does not match app total ${formatPeso(appTotal)}.`]
        : []),
      ...warnings
    ]
      .map((warning) => `• ${escapeHtml(warning)}`)
      .join("<br>");

    statusBox.innerHTML = `
      <strong>AI filled the invoice form.</strong><br>
      Document type: <strong>${escapeHtml(result.document_type || "unknown")}</strong><br>
      Confidence: <strong>${escapeHtml(result.confidence || "unknown")}</strong><br>
      Detected Invoice #: <strong>${escapeHtml(result.invoice_number || "-")}</strong><br>
      Detected Date: <strong>${escapeHtml(result.invoice_date || "-")}</strong><br>
      Detected Total: <strong>${result.total_amount ? formatPeso(result.total_amount) : "-"}</strong><br>
      Line items added: <strong>${items.length}</strong><br>
      Review every field before saving.
      ${warningHtml ? `<div style="margin-top:10px;color:#8a5a00;">${warningHtml}</div>` : ""}
    `;
  }

  async function analyzePaymentDocumentWithAi() {
    if (state.currentProfile?.role !== "owner") {
  alert("Only owner can use AI Assist.");
  return;
}
    const statusBox = document.getElementById("paymentAiStatus");
    const imageDataUrl = aiDocAssist.payment.imageDataUrl;
    const customer = getSelectedCustomer();

    if (!state.paymentDraft) {
      alert("Open the payment details step first.");
      return;
    }

    if (!customer) {
      alert("Please select a customer first.");
      return;
    }

    if (!imageDataUrl) {
      alert("Upload or paste a payment proof image first.");
      return;
    }

    aiSetBusy("payment", true);
    statusBox.innerHTML = "Analyzing payment proof...";

    try {
      const result = await callAiDocumentAssist({
        mode: "payment",
        imageDataUrl,
        customerName: customer.name || null,
        draftAmount: Number(state.paymentDraft.amount || 0),
        draftInvoices: (state.paymentDraft.allocations || []).map((alloc) => {
          const invoice = state.invoices.find((inv) => inv.id === alloc.invoiceId);
          return {
            invoice_number: invoice?.invoice_number || null,
            allocated_amount: alloc.amount
          };
        })
      });

      applyPaymentAiResult(result);
    } catch (error) {
      statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> ${escapeHtml(error.message || "Unknown error")}</span>`;
    } finally {
      aiSetBusy("payment", false);
    }
  }

  function applyPaymentAiResult(result) {
    const statusBox = document.getElementById("paymentAiStatus");

    if (!result || typeof result !== "object") {
      statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> Invalid response.</span>`;
      return;
    }

    const suggestedMethod = result.payment_method_suggestion || "";

    if (suggestedMethod === "Cheque" || suggestedMethod === "Online" || suggestedMethod === "Cash") {
      el.paymentMethodSelect.value = suggestedMethod;
      renderPaymentMethodFields();
    }

    if (suggestedMethod === "Cheque") {
      if (result.cheque_number) el.chequeNumberInput.value = String(result.cheque_number);
      if (result.cheque_date) el.chequeDateInput.value = String(result.cheque_date);

      if (typeof result.is_post_dated === "boolean") {
        el.chequePostDatedInput.checked = result.is_post_dated;
      } else if (result.cheque_date) {
        el.chequePostDatedInput.checked = result.cheque_date > todayStr();
      }
    }

    if (suggestedMethod === "Online") {
      if (result.reference_number) el.onlineReferenceInput.value = String(result.reference_number);
      if (result.platform_name) el.onlinePlatformInput.value = String(result.platform_name);
    }

    if (suggestedMethod === "Cash" && result.bank_account_number) {
      el.cashBankAccountInput.value = String(result.bank_account_number);
    }

    renderPaymentMethodFields();
    renderPaymentReviewBox();

    const warnings = Array.isArray(result.warnings) ? result.warnings.slice() : [];
    const detectedAmount = Number(result.amount || 0);
    const draftAmount = Number(state.paymentDraft?.amount || 0);

    if (detectedAmount > 0 && draftAmount > 0 && Math.abs(round2(detectedAmount) - round2(draftAmount)) > 0.01) {
      warnings.unshift(`Detected amount ${formatPeso(detectedAmount)} does not match your prepared payment amount ${formatPeso(draftAmount)}.`);
    }

    const warningHtml = warnings.map((warning) => `• ${escapeHtml(warning)}`).join("<br>");

    statusBox.innerHTML = `
      <strong>AI filled the payment details.</strong><br>
      Document type: <strong>${escapeHtml(result.document_type || "unknown")}</strong><br>
      Confidence: <strong>${escapeHtml(result.confidence || "unknown")}</strong><br>
      Suggested method: <strong>${escapeHtml(result.payment_method_suggestion || "-")}</strong><br>
      Detected Amount: <strong>${result.amount ? formatPeso(result.amount) : "-"}</strong><br>
      Detected Reference: <strong>${escapeHtml(result.reference_number || result.cheque_number || "-")}</strong><br>
      Review the payment method and all extracted fields before saving.
      ${warningHtml ? `<div style="margin-top:10px;color:#8a5a00;">${warningHtml}</div>` : ""}
      <div style="margin-top:10px;">Invoice allocation and withholding tax still stay under your control.</div>
    `;
  }
  // ===== End AI Document Assist =====
  // ===== Document Vault =====
  const documentVaultState = {
    file: null,
    source: "upload",
    previewUrl: "",
    currentCustomerId: null,
    documents: []
  };

  initDocumentVault();

  function initDocumentVault() {
  const fileInput = document.getElementById("customerDocumentFileInput");
  const saveBtn = document.getElementById("saveCustomerDocumentBtn");
  const clearBtn = document.getElementById("clearCustomerDocumentBtn");
  const docsTableBody = document.getElementById("customerDocumentsTableBody");

  if (!fileInput || !saveBtn || !clearBtn || !docsTableBody) {
    return;
  }

  ensureDocVaultPopupShell();

  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      applyDocumentVaultFile(file, "upload");
    } catch (error) {
      setDocumentVaultStatus(error.message || "Could not use that file.", true);
      fileInput.value = "";
    }
  });

  saveBtn.addEventListener("click", saveCustomerDocument);
  clearBtn.addEventListener("click", () => clearDocumentVaultDraft(true));

  docsTableBody.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-doc-action]");
    if (!button) return;

    const action = button.getAttribute("data-doc-action");
    const docId = button.getAttribute("data-doc-id");
    if (!action || !docId) return;

    if (action === "view") {
      await openCustomerDocument(docId);
    }

    if (action === "delete") {
      await deleteCustomerDocument(docId);
    }
  });

  syncDocumentVaultCustomer();
}
function ensureDocVaultStandaloneButton() {
  const hint = document.getElementById("docVaultCustomerHint");
  if (!hint) return null;

  let bar = document.getElementById("docVaultHeaderBar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "docVaultHeaderBar";
    bar.style.display = "flex";
    bar.style.justifyContent = "flex-end";
    bar.style.alignItems = "center";
    bar.style.gap = "10px";
    bar.style.margin = "8px 0 12px";
    hint.insertAdjacentElement("afterend", bar);
  }

  let btn = document.getElementById("docVaultStandaloneBtn");
  if (!btn) {
    btn = document.createElement("button");
    btn.type = "button";
    btn.id = "docVaultStandaloneBtn";
    btn.className = "btn btn-light small-btn";
    btn.style.padding = "8px 12px";
    btn.style.borderRadius = "10px";
    btn.textContent = "+ Other Document";
    bar.appendChild(btn);
  }

  return btn;
}
  function ensureDocVaultPopupShell() {
  const uploader = document.getElementById("docVaultUploader");
  if (!uploader) return null;

  let overlay = document.getElementById("docVaultPopupOverlay");
  let panel = document.getElementById("docVaultPopupPanel");

  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "docVaultPopupOverlay";
    overlay.className = "hidden";
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(15, 23, 42, 0.45)";
    overlay.style.zIndex = "9999";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "20px";

    panel = document.createElement("div");
    panel.id = "docVaultPopupPanel";
    panel.style.width = "100%";
    panel.style.maxWidth = "720px";
    panel.style.maxHeight = "90vh";
    panel.style.overflowY = "auto";
    panel.style.background = "#ffffff";
    panel.style.borderRadius = "18px";
    panel.style.boxShadow = "0 24px 70px rgba(0,0,0,0.18)";
    panel.style.padding = "18px";

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) {
        closeDocVaultPopup();
      }
    });
  }

  if (panel && uploader.parentElement !== panel) {
    panel.appendChild(uploader);
  }

  uploader.classList.remove("hidden");
  uploader.style.margin = "0";
  uploader.style.padding = "0";
  uploader.style.border = "0";
  uploader.style.background = "transparent";
  uploader.style.boxShadow = "none";

  let popupHeader = document.getElementById("docVaultPopupHeader");
  if (!popupHeader) {
    popupHeader = document.createElement("div");
    popupHeader.id = "docVaultPopupHeader";
    popupHeader.style.display = "flex";
    popupHeader.style.justifyContent = "space-between";
    popupHeader.style.alignItems = "center";
    popupHeader.style.gap = "12px";
    popupHeader.style.marginBottom = "14px";
    popupHeader.innerHTML = `
      <h3 style="margin:0;font-size:20px;">Other Customer Document</h3>
      <button type="button" id="closeDocVaultPopupBtn" class="icon-btn">&times;</button>
    `;
    uploader.prepend(popupHeader);
    document.getElementById("closeDocVaultPopupBtn")?.addEventListener("click", closeDocVaultPopup);
  }

  const pasteZone = document.getElementById("customerDocumentPasteZone");
  if (pasteZone) {
    pasteZone.classList.add("hidden");
  }

  const notesInput = document.getElementById("customerDocumentNotes");
  const notesField = notesInput?.closest(".field");
  if (notesInput) notesInput.value = "";
  if (notesField) notesField.classList.add("hidden");

  const previewWrap = document.getElementById("customerDocumentPreviewWrap");
  if (previewWrap) {
    previewWrap.style.maxWidth = "280px";
  }

  const chooseWrap =
    document.getElementById("customerDocumentFileInput")?.closest(".field") ||
    document.getElementById("customerDocumentFileInput")?.parentElement;
  if (chooseWrap) {
    chooseWrap.style.maxWidth = "220px";
    chooseWrap.style.marginLeft = "auto";
  }

  return overlay;
}

function openDocVaultPopup() {
  const overlay = ensureDocVaultPopupShell();
  if (!overlay) return;

  documentVaultState.standaloneOpen = true;
  overlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  setDocumentVaultStatus("Upload an image for a rare standalone customer document. Max 6MB.", false);
}

function closeDocVaultPopup() {
  const overlay = document.getElementById("docVaultPopupOverlay");
  if (overlay) overlay.classList.add("hidden");

  documentVaultState.standaloneOpen = false;
  document.body.style.overflow = "";
  clearDocumentVaultDraft(false);
}
  function syncDocumentVaultCustomer() {
  if (typeof getSelectedCustomer !== "function") return;

  const customer = getSelectedCustomer();
  const customerId = customer?.id || null;
  const role = state.currentProfile?.role || "";

  const uploader = document.getElementById("docVaultUploader");
  const hint = document.getElementById("docVaultCustomerHint");
  const tableBody = document.getElementById("customerDocumentsTableBody");
  const standaloneBtn = ensureDocVaultStandaloneButton();

  if (!uploader || !hint || !tableBody) return;

  const canUploadStandalone = !!customerId && role !== "co-owner";

  if (standaloneBtn) {
    standaloneBtn.classList.toggle("hidden", !canUploadStandalone);
    standaloneBtn.textContent = "+ Other Document";
    standaloneBtn.onclick = () => openDocVaultPopup();
  }

  uploader.classList.toggle("hidden", !documentVaultState.standaloneOpen);

  if (!customerId) {
    hint.textContent = "Select a customer to view saved supporting documents.";
    tableBody.innerHTML = `<tr><td colspan="7" class="muted">Select a customer first.</td></tr>`;

    if (documentVaultState.currentCustomerId !== null) {
      documentVaultState.currentCustomerId = null;
      documentVaultState.documents = [];
      documentVaultState.standaloneOpen = false;
      closeDocVaultPopup();
    }

    return;
  }

  hint.textContent = `Saved documents for ${customer.name || "selected customer"}. Invoice and payment uploads appear here automatically.`;

  if (documentVaultState.currentCustomerId !== customerId) {
    documentVaultState.currentCustomerId = customerId;
    closeDocVaultPopup();
    loadCustomerDocuments();
  }
}

  function applyDocumentVaultFile(file, source) {
    if (!file.type.startsWith("image/")) {
      throw new Error("Please use an image file only.");
    }

    if (file.size > 6 * 1024 * 1024) {
      throw new Error("Please keep the image under 6MB.");
    }

    if (documentVaultState.previewUrl) {
      URL.revokeObjectURL(documentVaultState.previewUrl);
    }

    documentVaultState.file = file;
    documentVaultState.source = source || "upload";
    documentVaultState.previewUrl = URL.createObjectURL(file);

    const previewWrap = document.getElementById("customerDocumentPreviewWrap");
    const previewImg = document.getElementById("customerDocumentPreviewImg");
    const titleInput = document.getElementById("customerDocumentTitle");

    if (previewWrap && previewImg) {
      previewImg.src = documentVaultState.previewUrl;
      previewWrap.classList.remove("hidden");
    }

    if (titleInput && !titleInput.value.trim()) {
      titleInput.value = docVaultTitleFromFile(file.name);
    }

    setDocumentVaultStatus("Image ready. Review details, then click Save Document.", false);
  }

  function clearDocumentVaultDraft(resetStatus) {
    const fileInput = document.getElementById("customerDocumentFileInput");
    const previewWrap = document.getElementById("customerDocumentPreviewWrap");
    const previewImg = document.getElementById("customerDocumentPreviewImg");
    const titleInput = document.getElementById("customerDocumentTitle");
    const referenceInput = document.getElementById("customerDocumentReference");
    const notesInput = document.getElementById("customerDocumentNotes");
    const categoryInput = document.getElementById("customerDocumentCategory");

    if (documentVaultState.previewUrl) {
      URL.revokeObjectURL(documentVaultState.previewUrl);
    }

    documentVaultState.file = null;
    documentVaultState.source = "upload";
    documentVaultState.previewUrl = "";

    if (fileInput) fileInput.value = "";
    if (previewImg) previewImg.src = "";
    if (previewWrap) previewWrap.classList.add("hidden");
    if (titleInput) titleInput.value = "";
    if (referenceInput) referenceInput.value = "";
    if (notesInput) notesInput.value = "";
    if (categoryInput) categoryInput.value = "invoice";

    if (resetStatus) {
      setDocumentVaultStatus("Choose an image. Max 6MB.", false);
    }
  }

  function setDocumentVaultStatus(message, isError) {
    const statusBox = document.getElementById("customerDocumentStatus");
    if (!statusBox) return;

    statusBox.innerHTML = message;
    statusBox.classList.toggle("doc-status-error", !!isError);
    statusBox.classList.toggle("doc-status-success", !isError);
  }

  async function saveCustomerDocument() {
    const role = state.currentProfile?.role || "";
    if (role === "co-owner") {
      alert("Co-owner can view documents but cannot upload.");
      return;
    }

    const customer = typeof getSelectedCustomer === "function" ? getSelectedCustomer() : null;
    if (!customer?.id) {
      alert("Please select a customer first.");
      return;
    }

    if (!documentVaultState.file) {
      alert("Choose an image first.");
      return;
    }

    const categoryInput = document.getElementById("customerDocumentCategory");
    const titleInput = document.getElementById("customerDocumentTitle");
    const referenceInput = document.getElementById("customerDocumentReference");
    const notesInput = document.getElementById("customerDocumentNotes");
    const saveBtn = document.getElementById("saveCustomerDocumentBtn");
    const clearBtn = document.getElementById("clearCustomerDocumentBtn");

    const category = categoryInput?.value || "invoice";
    const title = titleInput?.value?.trim() || docVaultTitleFromFile(documentVaultState.file.name);
    const referenceCode = referenceInput?.value?.trim() || null;
    const notes = notesInput?.value?.trim() || null;

    try {
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = "Saving...";
      }
      if (clearBtn) clearBtn.disabled = true;

      const { data: authData, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !authData?.user?.id) {
        throw new Error("Could not identify the signed-in user.");
      }

      const safeFileName = docVaultSafeFileName(documentVaultState.file.name);
      const storagePath = `${customer.id}/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safeFileName}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("customer-documents")
        .upload(storagePath, documentVaultState.file, {
          cacheControl: "3600",
          upsert: false,
          contentType: documentVaultState.file.type || "image/png"
        });

      if (uploadError) {
        throw new Error(uploadError.message || "Storage upload failed.");
      }

      const { error: insertError } = await supabaseClient
        .from("customer_documents")
        .insert({
          customer_id: customer.id,
          category,
          title,
          reference_code: referenceCode,
          notes,
          file_name: documentVaultState.file.name,
          mime_type: documentVaultState.file.type || "image/png",
          file_size: documentVaultState.file.size,
          storage_path: storagePath,
          source: documentVaultState.source,
          uploaded_by: authData.user.id
        });

      if (insertError) {
        await supabaseClient.storage.from("customer-documents").remove([storagePath]);
        throw new Error(insertError.message || "Database save failed.");
      }

      clearDocumentVaultDraft(true);
await loadCustomerDocuments();
setDocumentVaultStatus("Document saved successfully.", false);
closeDocVaultPopup();
    } catch (error) {
      setDocumentVaultStatus(docVaultEscapeHtml(error.message || "Could not save document."), true);
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Document";
      }
      if (clearBtn) clearBtn.disabled = false;
    }
  }

  async function loadCustomerDocuments() {
  const customer = typeof getSelectedCustomer === "function" ? getSelectedCustomer() : null;
  const tableBody = document.getElementById("customerDocumentsTableBody");
  if (!tableBody) return;

  if (!customer?.id) {
    tableBody.innerHTML = `<tr><td colspan="7" class="muted">Select a customer first.</td></tr>`;
    return;
  }

  tableBody.innerHTML = `<tr><td colspan="7" class="muted">Loading documents...</td></tr>`;

    const { data, error } = await supabaseClient
      .from("customer_documents")
      .select("*")
      .eq("customer_id", customer.id)
      .order("uploaded_at", { ascending: false });

    if (error) {
      tableBody.innerHTML = `<tr><td colspan="7" class="muted">Could not load documents.</td></tr>`;
      return;
    }

    documentVaultState.documents = Array.isArray(data) ? data : [];
renderCustomerDocumentsTable();
}

window.AKY_loadCustomerDocuments = loadCustomerDocuments;

  function renderCustomerDocumentsTable() {
    const tableBody = document.getElementById("customerDocumentsTableBody");
    if (!tableBody) return;

    const role = state.currentProfile?.role || "";
    const canDelete = role === "owner" || role === "admin";
    const docs = documentVaultState.documents || [];

    if (!docs.length) {
      tableBody.innerHTML = `<tr><td colspan="7" class="muted">No saved documents for this customer yet.</td></tr>`;
      return;
    }

    tableBody.innerHTML = docs.map((doc) => {
      const uploadedAt = doc.uploaded_at ? docVaultFormatDateTime(doc.uploaded_at) : "-";
      const title = doc.title || doc.file_name || "-";
      const reference = doc.reference_code || "-";
      const source = doc.source === "paste" ? "Paste" : "Upload";
      const size = docVaultFormatBytes(doc.file_size || 0);

      return `
        <tr>
          <td>${docVaultEscapeHtml(uploadedAt)}</td>
          <td>${docVaultEscapeHtml(docVaultPrettyCategory(doc.category))}</td>
          <td>${docVaultEscapeHtml(title)}</td>
          <td>${docVaultEscapeHtml(reference)}</td>
          <td>${docVaultEscapeHtml(source)}</td>
          <td>${docVaultEscapeHtml(size)}</td>
          <td>
            <div class="doc-action-row">
              <button class="btn btn-light small-btn" type="button" data-doc-action="view" data-doc-id="${doc.id}">View</button>
              ${canDelete ? `<button class="btn btn-danger small-btn" type="button" data-doc-action="delete" data-doc-id="${doc.id}">Delete</button>` : ""}
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  async function openCustomerDocument(docId) {
    const doc = documentVaultState.documents.find((item) => item.id === docId);
    if (!doc) return;

    try {
      const { data, error } = await supabaseClient.storage
        .from("customer-documents")
        .download(doc.storage_path);

      if (error || !data) {
        throw new Error(error?.message || "Could not open document.");
      }

      const blobUrl = URL.createObjectURL(data);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      alert(error.message || "Could not open document.");
    }
  }

  async function deleteCustomerDocument(docId) {
    const role = state.currentProfile?.role || "";
    if (role !== "owner" && role !== "admin") {
      alert("Only owner and admin can delete documents.");
      return;
    }

    const doc = documentVaultState.documents.find((item) => item.id === docId);
    if (!doc) return;

    const confirmed = confirm(`Delete this document?\n\n${doc.title || doc.file_name || "Untitled document"}`);
    if (!confirmed) return;

    try {
      const { error: rowDeleteError } = await supabaseClient
        .from("customer_documents")
        .delete()
        .eq("id", doc.id);

      if (rowDeleteError) {
        throw new Error(rowDeleteError.message || "Could not delete document record.");
      }

      const { error: storageDeleteError } = await supabaseClient.storage
        .from("customer-documents")
        .remove([doc.storage_path]);

      await loadCustomerDocuments();

      if (storageDeleteError) {
        setDocumentVaultStatus("Document record deleted, but file cleanup in storage failed.", true);
        return;
      }

      setDocumentVaultStatus("Document deleted successfully.", false);
    } catch (error) {
      setDocumentVaultStatus(docVaultEscapeHtml(error.message || "Could not delete document."), true);
    }
  }

  function docVaultPrettyCategory(value) {
    if (value === "invoice") return "Invoice";
    if (value === "payment_proof") return "Payment Proof";
    if (value === "cheque") return "Cheque";
    return "Other";
  }

  function docVaultTitleFromFile(fileName) {
    return String(fileName || "Document")
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim() || "Document";
  }

  function docVaultSafeFileName(fileName) {
    const cleaned = String(fileName || "document.png")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    return cleaned || `document-${Date.now()}.png`;
  }

  function docVaultExtFromMime(mimeType) {
    if (mimeType === "image/jpeg") return "jpg";
    if (mimeType === "image/webp") return "webp";
    if (mimeType === "image/gif") return "gif";
    return "png";
  }

  function docVaultFormatBytes(bytes) {
    const value = Number(bytes || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  }

  function docVaultFormatDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
      
    });
  }

  function docVaultEscapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  // ===== End Document Vault =====
})();
