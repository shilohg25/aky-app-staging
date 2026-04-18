(function () {
  "use strict";

  function createMap(items) {
    return new Map((items || []).map((item) => [item.id, item]));
  }

  function createPendingTbvByInvoiceId(tbvs) {
    const map = new Map();
    (tbvs || []).forEach((tbv) => {
      if (tbv?.invoice_id && tbv?.status === "PENDING" && !map.has(tbv.invoice_id)) {
        map.set(tbv.invoice_id, tbv);
      }
    });
    return map;
  }

  function createStateIndexes(state) {
    return {
      customersById: createMap(state?.customers),
      contactsById: createMap(state?.contacts),
      invoicesById: createMap(state?.invoices),
      paymentsById: createMap(state?.payments),
      tbvsById: createMap(state?.tbvs),
      pendingTbvByInvoiceId: createPendingTbvByInvoiceId(state?.tbvs)
    };
  }

  window.AKY_STATE_INDEXES = Object.freeze({
    createStateIndexes
  });
})();
