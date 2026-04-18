(function () {
  "use strict";

  function initAppReports(deps) {
    const {
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
    } = deps || {};

        // The report implementations are not bundled in this build.
    // Return an empty API so app.js can fall back to its built-in no-op handlers
    // instead of throwing a ReferenceError during module initialization.
    return {};
  }

  window.AKY_APP_REPORTS = Object.freeze({
    initAppReports
  });
})();
