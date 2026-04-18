(function () {
  "use strict";

  function createInitialState() {
    return {
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
      accountsLoadError: "",
      selectedCustomerId: null,
      editingCustomerId: null,
      editingInvoiceId: null,
      paymentDraft: null,
      selectedInvoiceForTbv: null,
      selectedTbvForDecision: null,
      editingAccountId: null,
      selectedAccountForReset: null,
      logSortField: "created_at",
      logSortDirection: "desc"
    };
  }

  function resetAuthBoundState(targetState) {
    const next = createInitialState();
    const stateRef = targetState || window.state;

    if (!stateRef || typeof stateRef !== "object") {
      return next;
    }

    stateRef.currentView = next.currentView;
    stateRef.currentProfile = next.currentProfile;
    stateRef.customers = next.customers;
    stateRef.contacts = next.contacts;
    stateRef.invoices = next.invoices;
    stateRef.invoiceItems = next.invoiceItems;
    stateRef.payments = next.payments;
    stateRef.allocations = next.allocations;
    stateRef.logs = next.logs;
    stateRef.tbvs = next.tbvs;
    stateRef.accounts = next.accounts;
    stateRef.accountsLoadError = next.accountsLoadError;
    stateRef.selectedCustomerId = next.selectedCustomerId;
    stateRef.editingCustomerId = next.editingCustomerId;
    stateRef.editingInvoiceId = next.editingInvoiceId;
    stateRef.paymentDraft = next.paymentDraft;
    stateRef.selectedInvoiceForTbv = next.selectedInvoiceForTbv;
    stateRef.selectedTbvForDecision = next.selectedTbvForDecision;
    stateRef.editingAccountId = next.editingAccountId;
    stateRef.selectedAccountForReset = next.selectedAccountForReset;
    stateRef.logSortField = next.logSortField;
    stateRef.logSortDirection = next.logSortDirection;

    return stateRef;
  }

  window.state = createInitialState();

  window.AKY_STATE = Object.freeze({
    createInitialState,
    resetAuthBoundState
  });
})();
