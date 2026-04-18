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

    void supabaseClient;
    void state;
    void el;
    void getSelectedCustomer;
    void canEditInvoiceRecord;
    void canRequestTbv;
    void openInvoiceModalForEdit;
    void openTbvModal;
    void openModal;
    void closeModal;
    void getPaymentDetailsObject;
    void getChequeStatus;
    void getInvoiceReferenceLabel;
    void getPaymentTypeLabel;
    void getPaymentCollectionReceipt;
    void getAllocationAmount;
    void formatPeso;
    void formatNumber;
    void formatDateTime;
    void escapeHtml;

    const noop = () => undefined;

    // This build does not include the real detail-viewer implementation.
    // Export stable no-op functions so app.js does not fall back to
    // error-logging placeholder handlers on every invocation.
    return {
      viewInvoice: noop,
      viewPayment: noop
    };
  }

  window.AKY_APP_DETAIL_VIEWERS = Object.freeze({
    initAppDetailViewers
  });
})();
