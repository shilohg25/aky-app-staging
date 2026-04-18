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

    void state;
    void el;
    void buildCustomerFilterOptionsHtml;
    void getActiveInvoices;
    void isOperationallyCollectedPayment;
    void getPaymentCollectionReceipt;
    void statusPill;
    void openReportInvoiceDetails;
    void openReportPaymentDetails;
    void getChequeStatus;
    void formatDateTime;
    void getPaymentDetailsObject;
    void getInvoiceReferenceLabel;
    void getAllocationAmount;
    void getPaymentTypeLabel;
    void formatPeso;
    void csvSafe;
    void downloadTextFile;
    void todayStr;
    void openPrintWindow;
    void getFilteredTbvRows;
    void escapeHtml;

    const noop = () => undefined;
    const emptyRows = () => [];

    // This build does not include the real reports implementation.
    // Export stable no-op functions so app.js does not fall back to
    // error-logging placeholder handlers on every invocation.
    return {
      populateReportCustomerFilter: noop,
      getReportRows: emptyRows,
      renderReportsView: noop,
      clearReportFilters: noop,
      renderPaymentReceivedReportView: noop,
      clearPaymentReportFilters: noop,
      downloadPaymentReportCsv: noop,
      printPaymentReceivedReport: noop,
      downloadTbvReportCsv: noop,
      printTbvReport: noop,
      downloadReportCsv: noop,
      printReport: noop
    };
  }

  window.AKY_APP_REPORTS = Object.freeze({
    initAppReports
  });
})();
