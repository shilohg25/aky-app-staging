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
    void getSelectedCustomer;

    function getInvoiceById(invoiceId) {
      return (state.invoices || []).find((invoice) => invoice.id === invoiceId) || null;
    }

    function getPaymentById(paymentId) {
      return (state.payments || []).find((payment) => payment.id === paymentId) || null;
    }

    function getCustomerById(customerId) {
      return (state.customers || []).find((customer) => customer.id === customerId) || null;
    }

    function formatDateOrDateTime(value) {
      const text = String(value || "").trim();
      if (!text) return "-";
      return text.includes("T") ? formatDateTime(text) : text;
    }

    function getInvoiceItems(invoice) {
      return Array.isArray(invoice?.items)
        ? invoice.items.filter((item) => item)
        : [];
    }

    function getInvoicePayments(invoiceId) {
      return (state.payments || [])
        .filter((payment) =>
          Array.isArray(payment.allocations) &&
          payment.allocations.some((alloc) => alloc.invoice_id === invoiceId)
        )
        .sort((left, right) =>
          String(right.payment_date || "").localeCompare(String(left.payment_date || ""))
        );
    }

    function renderInvoiceItemsTable(invoice) {
      const items = getInvoiceItems(invoice).filter((item) => {
        const hasProductName = String(item.product_name || "").trim() !== "";
        const hasQty = item.qty !== null && item.qty !== undefined && item.qty !== "";
        const hasUnitPrice = item.unit_price !== null && item.unit_price !== undefined && item.unit_price !== "";
        return hasProductName || hasQty || hasUnitPrice;
      });

      if (!items.length) {
        return '<div class="info-box mt-12">No invoice line items found.</div>';
      }

      return `
        <div class="table-wrap mt-12">
          <table class="records-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount / Qty</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map((item) => {
                const qty = Number(item.qty || 0);
                const unitPrice = Number(item.unit_price || 0);
                const discountPerQty = Number(item.discount_per_qty || 0);
                const lineTotal = Math.max(0, (qty * unitPrice) - (qty * discountPerQty));

                return `
                  <tr>
                    <td>${escapeHtml(item.product_name || "-")}</td>
                    <td>${formatNumber(item.qty)}</td>
                    <td>${formatPeso(unitPrice)}</td>
                    <td>${formatPeso(discountPerQty)}</td>
                    <td>${formatPeso(lineTotal)}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    function renderInvoicePaymentsTable(invoice) {
      const payments = getInvoicePayments(invoice.id);

      if (!payments.length) {
        return '<div class="info-box mt-12">No payments are allocated to this invoice yet.</div>';
      }

      return `
        <div class="table-wrap mt-12">
          <table class="records-table">
            <thead>
              <tr>
                <th>Payment Date</th>
                <th>Type</th>
                <th>Method</th>
                <th>Amount Applied</th>
                <th>Collection Receipt (CR)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${payments.map((payment) => {
                const allocation = (payment.allocations || []).find((item) => item.invoice_id === invoice.id) || null;
                const statusText = payment.method === "Cheque"
                  ? getChequeStatus(payment)
                  : (payment.cleared === false ? "Uncleared" : "Collected");

                return `
                  <tr>
                    <td>${escapeHtml(payment.payment_date || "-")}</td>
                    <td>${escapeHtml(getPaymentTypeLabel(payment))}</td>
                    <td>${escapeHtml(payment.method || "-")}</td>
                    <td>${formatPeso(getAllocationAmount(allocation))}</td>
                    <td>${escapeHtml(getPaymentCollectionReceipt(payment) || "-")}</td>
                    <td>${escapeHtml(statusText)}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    function bindInvoiceActionButtons(invoice) {
      const editBtn = document.getElementById("invoiceViewEditBtn");
      const tbvBtn = document.getElementById("invoiceViewTbvBtn");

      if (editBtn) {
        editBtn.addEventListener("click", () => {
          closeModal(el.invoiceViewModal);
          openInvoiceModalForEdit(invoice.id);
        });
      }

      if (tbvBtn) {
        tbvBtn.addEventListener("click", () => {
          closeModal(el.invoiceViewModal);
          openTbvModal(invoice.id);
        });
      }
    }

    function viewInvoice(invoiceId) {
      const invoice = getInvoiceById(invoiceId);
      if (!invoice || !el.invoiceViewContent || !el.invoiceViewModal) return;

      const customer = getCustomerById(invoice.customer_id);
      const tbv = (state.tbvs || []).find((item) => item.invoice_id === invoice.id && item.status === "PENDING");
      const canEdit = typeof canEditInvoiceRecord === "function" && canEditInvoiceRecord(invoice);
      const canOpenTbv = typeof canRequestTbv === "function" && canRequestTbv() && canEdit;
      const discountMode = String(invoice.discount_mode || "none").trim();
      const discountAmount = Number(invoice.discount_total_amount || 0);
      const createdAt = formatDateOrDateTime(invoice.created_at);
      const updatedAt = formatDateOrDateTime(invoice.updated_at);

      el.invoiceViewContent.innerHTML = `
        <div class="invoice-meta-grid">
          <div class="invoice-meta-card"><span>Customer</span><strong>${escapeHtml(customer?.name || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Invoice #</span><strong>${escapeHtml(invoice.invoice_number || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Invoice Date</span><strong>${escapeHtml(invoice.invoice_date || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Status</span><strong>${escapeHtml(invoice.status || "-")}</strong></div>
          <div class="invoice-meta-card"><span>PO #</span><strong>${escapeHtml(invoice.po_number || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Reference</span><strong>${escapeHtml(invoice.reference_info || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Total</span><strong>${formatPeso(invoice.total || 0)}</strong></div>
          <div class="invoice-meta-card"><span>Paid</span><strong>${formatPeso(invoice.paidAmount || invoice.paid_amount || 0)}</strong></div>
          <div class="invoice-meta-card"><span>Balance</span><strong>${formatPeso(invoice.balance || invoice.balance_amount || 0)}</strong></div>
          <div class="invoice-meta-card"><span>Discount</span><strong>${discountMode === "none" ? "-" : `${escapeHtml(discountMode)} / ${formatPeso(discountAmount)}`}</strong></div>
          <div class="invoice-meta-card"><span>Created</span><strong>${escapeHtml(createdAt)}</strong></div>
          <div class="invoice-meta-card"><span>Updated</span><strong>${escapeHtml(updatedAt)}</strong></div>
        </div>

        ${tbv ? '<div class="info-box mt-12"><strong>TBV Status:</strong> Pending review for this invoice.</div>' : ""}

        <div class="panel soft-panel mt-12">
          <div class="panel-row">
            <h4 class="panel-title small-title">Line Items</h4>
            <div class="btn-row">
              ${canEdit ? '<button id="invoiceViewEditBtn" type="button" class="btn btn-light">Edit Invoice</button>' : ""}
              ${canOpenTbv ? '<button id="invoiceViewTbvBtn" type="button" class="btn btn-secondary">Request TBV</button>' : ""}
            </div>
          </div>
          ${renderInvoiceItemsTable(invoice)}
        </div>

        <div class="panel soft-panel mt-12">
          <div class="panel-row">
            <h4 class="panel-title small-title">Applied Payments</h4>
          </div>
          ${renderInvoicePaymentsTable(invoice)}
        </div>
      `;

      bindInvoiceActionButtons(invoice);
      openModal(el.invoiceViewModal);
    }

    function buildPaymentDetailLines(payment) {
      const details = getPaymentDetailsObject(payment);
      const rows = [];

      if (payment.method === "Cash") {
        rows.push(["Deposit Bank Account", details.bankAccountNumber || "-"]);
      }

      if (payment.method === "Online") {
        rows.push(["Reference Number", details.referenceNumber || "-"]);
        rows.push(["Platform / Bank", details.platformName || "-"]);
      }

      if (payment.method === "Cheque") {
        rows.push(["Cheque #", details.chequeNumber || "-"]);
        rows.push(["Cheque Date", details.chequeDate || "-"]);
        rows.push(["Post-Dated", details.isPostDated ? "Yes" : "No"]);
        rows.push(["Cheque Status", getChequeStatus(payment)]);
        rows.push(["Cleared At", formatDateOrDateTime(details.clearedAt)]);
        rows.push(["Bounced At", formatDateOrDateTime(details.bouncedAt)]);
        rows.push(["Bounce Reason", details.bounceReason || "-"]);
      }

      rows.push(["Collection Receipt (CR)", getPaymentCollectionReceipt(payment) || "-"]);
      rows.push(["Withholding Tax Applied", details.withholdingTaxApplied ? "Yes" : "No"]);
      rows.push(["Withholding Tax Amount", formatPeso(details.withholdingTaxAmount || 0)]);
      rows.push(["Net Received", formatPeso(details.netReceivedAmount ?? payment.amount ?? 0)]);

      if (details.isReplacementPayment) {
        rows.push(["Replacement Payment", "Yes"]);
        rows.push(["Replaces Payment ID", details.replacesPaymentId || "-"]);
        rows.push(["Replaces Cheque #", details.replacesChequeNumber || "-"]);
        rows.push(["Replacement Root Payment ID", details.replacementRootPaymentId || "-"]);
      }

      return rows
        .map(([label, value]) => `
          <div class="invoice-meta-card">
            <span>${escapeHtml(label)}</span>
            <strong>${typeof value === "string" && value.startsWith("₱") ? value : escapeHtml(String(value || "-"))}</strong>
          </div>
        `)
        .join("");
    }

    function renderPaymentAllocationsTable(payment) {
      const allocations = Array.isArray(payment.allocations) ? payment.allocations : [];

      if (!allocations.length) {
        return '<div class="info-box mt-12">No invoice allocations found for this payment.</div>';
      }

      return `
        <div class="table-wrap mt-12">
          <table class="records-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Invoice Date</th>
                <th>Status</th>
                <th>Allocated Amount</th>
              </tr>
            </thead>
            <tbody>
              ${allocations.map((alloc) => {
                const invoice = getInvoiceById(alloc.invoice_id);
                return `
                  <tr>
                    <td>${escapeHtml(getInvoiceReferenceLabel(invoice))}</td>
                    <td>${escapeHtml(invoice?.invoice_date || "-")}</td>
                    <td>${escapeHtml(invoice?.status || "-")}</td>
                    <td>${formatPeso(getAllocationAmount(alloc))}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    function viewPayment(paymentId) {
      const payment = getPaymentById(paymentId);
      if (!payment || !el.paymentViewContent || !el.paymentViewModal) return;

      const customer = getCustomerById(payment.customer_id);
      const createdAt = formatDateOrDateTime(payment.created_at);
      const updatedAt = formatDateOrDateTime(payment.updated_at);
      const statusText = payment.method === "Cheque"
        ? getChequeStatus(payment)
        : (payment.cleared === false ? "Uncleared" : "Collected");

      el.paymentViewContent.innerHTML = `
        <div class="invoice-meta-grid">
          <div class="invoice-meta-card"><span>Customer</span><strong>${escapeHtml(customer?.name || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Payment Date</span><strong>${escapeHtml(payment.payment_date || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Type</span><strong>${escapeHtml(getPaymentTypeLabel(payment))}</strong></div>
          <div class="invoice-meta-card"><span>Method</span><strong>${escapeHtml(payment.method || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Gross Amount</span><strong>${formatPeso(payment.amount || 0)}</strong></div>
          <div class="invoice-meta-card"><span>Status</span><strong>${escapeHtml(statusText)}</strong></div>
          <div class="invoice-meta-card"><span>Created By</span><strong>${escapeHtml(payment.created_by_name || "-")}</strong></div>
          <div class="invoice-meta-card"><span>Created</span><strong>${escapeHtml(createdAt)}</strong></div>
          <div class="invoice-meta-card"><span>Updated</span><strong>${escapeHtml(updatedAt)}</strong></div>
        </div>

        <div class="panel soft-panel mt-12">
          <div class="panel-row">
            <h4 class="panel-title small-title">Payment Details</h4>
          </div>
          <div class="invoice-meta-grid mt-12">
            ${buildPaymentDetailLines(payment)}
          </div>
        </div>

        <div class="panel soft-panel mt-12">
          <div class="panel-row">
            <h4 class="panel-title small-title">Allocated Invoices</h4>
          </div>
          ${renderPaymentAllocationsTable(payment)}
        </div>
      `;

      openModal(el.paymentViewModal);
    }

    return {
      viewInvoice,
      viewPayment
    };
  }

  window.AKY_APP_DETAIL_VIEWERS = Object.freeze({
    initAppDetailViewers
  });
})();
