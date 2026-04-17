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

    // Paste these exact deleted function blocks here, unchanged, in this order:
    // 1. populateReportCustomerFilter
    // 2. getReportRows
    // 3. renderReportsView
    // 4. clearReportFilters
    // 5. getPaymentReceivedStatusInfo
    // 6. getPaymentReportReferenceDisplay
    // 7. getPaymentReportResolvedDateDisplay
    // 8. getPaymentReportNotes
    // 9. getPaymentReceivedReportRows
    // 10. renderPaymentReceivedReportView
    // 11. clearPaymentReportFilters
    // 12. buildPaymentReportCsvRows
    // 13. downloadPaymentReportCsv
    // 14. buildPaymentReportSectionHtml
    // 15. printPaymentReceivedReport
    // 16. downloadTbvReportCsv
    // 17. printTbvReport
    // 18. downloadReportCsv
    // 19. printReport

    return {
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
    };
  }

  window.AKY_APP_REPORTS = Object.freeze({
    initAppReports
  });
})();
