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

    // Paste these exact deleted function blocks here, unchanged, in this order:
    // 1. viewInvoice
    // 2. viewPayment

    return {
      viewInvoice,
      viewPayment
    };
  }

  window.AKY_APP_DETAIL_VIEWERS = Object.freeze({
    initAppDetailViewers
  });
})();
