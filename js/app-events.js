(function () {
  "use strict";

  function initAppEvents(deps) {
    const {
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
    } = deps || {};

    // Paste the exact deleted bindEvents() function block here, unchanged.

    return { bindEvents };
  }

  window.AKY_APP_EVENTS = Object.freeze({
    initAppEvents
  });
})();
