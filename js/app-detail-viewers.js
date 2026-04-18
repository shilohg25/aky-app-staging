(function () {
  "use strict";

  function initAppDetailViewers(deps) {
    const {
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
    } = deps || {};

        // The detail-viewer implementations are not bundled in this build.
    // Return an empty API so app.js can safely supply its fallback handlers.
    return {};
  }

  window.AKY_APP_DETAIL_VIEWERS = Object.freeze({
    initAppDetailViewers
  });
})();
