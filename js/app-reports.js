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

    let reportTableEventsBound = false;
    let paymentReportTableEventsBound = false;

    function passesDateFilter(dateString, from, to) {
      if (!dateString) return false;
      if (from && dateString < from) return false;
      if (to && dateString > to) return false;
      return true;
    }

    function setText(node, value) {
      if (node) node.textContent = value;
    }

    function getCustomerMap() {
      return new Map((state.customers || []).map((customer) => [customer.id, customer]));
    }

    function normalizeSortKey(value) {
      return String(value || "")
        .trim()
        .toLowerCase();
    }

    function getInvoiceSortKey(invoice) {
      return String(
        invoice?.invoice_number_key ||
        invoice?.invoice_number ||
        ""
      ).trim().toLowerCase();
    }

    function getInvoiceAppliedPayments(invoiceId) {
      return (state.payments || [])
        .filter((payment) =>
          (payment.allocations || []).some((alloc) => alloc.invoice_id === invoiceId)
        );
    }

    function getOperationalPaymentsForInvoice(invoiceId) {
      return getInvoiceAppliedPayments(invoiceId)
        .filter((payment) => isOperationallyCollectedPayment(payment))
        .sort((left, right) =>
          String(right.payment_date || "").localeCompare(String(left.payment_date || ""))
        );
    }

    function getLatestPaidDateForInvoice(invoiceId) {
      const latestPayment = getOperationalPaymentsForInvoice(invoiceId)[0];
      return latestPayment?.payment_date || "";
    }

    function getLatestCollectionReceiptForInvoice(invoiceId) {
      const latestPayment = getOperationalPaymentsForInvoice(invoiceId)[0];
      return latestPayment ? getPaymentCollectionReceipt(latestPayment) : "";
    }

    function getReportRows() {
      const customerId = String(el.reportCustomerFilter?.value || "").trim();
      const invoiceDateFrom = String(el.reportInvoiceDateFrom?.value || "").trim();
      const invoiceDateTo = String(el.reportInvoiceDateTo?.value || "").trim();
      const paidDateFrom = String(el.reportPaidDateFrom?.value || "").trim();
      const paidDateTo = String(el.reportPaidDateTo?.value || "").trim();
      const statusFilter = String(el.reportStatusFilter?.value || "").trim();
      const sortMode = String(el.reportInvoiceNumberSort?.value || "date_desc").trim();
      const customerMap = getCustomerMap();

      const rows = (getActiveInvoices() || [])
        .map((invoice) => {
          const customer = customerMap.get(invoice.customer_id) || null;
          const latestPaidDate = getLatestPaidDateForInvoice(invoice.id);
          const collectionReceipt = getLatestCollectionReceiptForInvoice(invoice.id);

          return {
            invoice,
            customer,
            customerId: invoice.customer_id,
            customerName: customer?.name || "-",
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoice_number || "-",
            invoiceDate: invoice.invoice_date || "",
            poNumber: invoice.po_number || "-",
            reference: invoice.reference_info || "-",
            total: Number(invoice.total || invoice.total_amount || 0),
            paid: Number(invoice.paidAmount || invoice.paid_amount || 0),
            balance: Number(invoice.balance || invoice.balance_amount || 0),
            status: invoice.status || "Unpaid",
            collectionReceipt: collectionReceipt || "-",
            latestPaidDate: latestPaidDate || "",
            latestPaidDateDisplay: latestPaidDate || "-",
            statusHtml: statusPill(invoice.status || "Unpaid")
          };
        })
        .filter((row) => {
          if (customerId && row.customerId !== customerId) return false;
          if (!passesDateFilter(row.invoiceDate, invoiceDateFrom, invoiceDateTo)) return false;
          if (statusFilter && row.status !== statusFilter) return false;

          if (paidDateFrom || paidDateTo) {
            if (!row.latestPaidDate) return false;
            if (!passesDateFilter(row.latestPaidDate, paidDateFrom, paidDateTo)) return false;
          }

          return true;
        });

      rows.sort((left, right) => {
        if (sortMode === "invoice_asc") {
          return getInvoiceSortKey(left.invoice).localeCompare(getInvoiceSortKey(right.invoice));
        }

        if (sortMode === "invoice_desc") {
          return getInvoiceSortKey(right.invoice).localeCompare(getInvoiceSortKey(left.invoice));
        }

        return String(right.invoiceDate || "").localeCompare(String(left.invoiceDate || ""));
      });

      return rows;
    }

    function bindReportTableEvents() {
      if (reportTableEventsBound || !el.reportsTableBody) return;

      el.reportsTableBody.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-report-invoice-id]");
        if (!button) return;

        const customerId = button.dataset.reportCustomerId || "";
        const invoiceId = button.dataset.reportInvoiceId || "";
        if (!customerId || !invoiceId) return;

        openReportInvoiceDetails(customerId, invoiceId);
      });

      reportTableEventsBound = true;
    }

    function renderReportsView() {
      if (!el.reportsTableBody) return;

      bindReportTableEvents();
      const rows = getReportRows();
      el.reportsTableBody.innerHTML = "";

      setText(el.reportInvoicesCount, String(rows.length));
      setText(
        el.reportTotalInvoiced,
        formatPeso(rows.reduce((sum, row) => sum + Number(row.total || 0), 0))
      );
      setText(
        el.reportTotalPaid,
        formatPeso(rows.reduce((sum, row) => sum + Number(row.paid || 0), 0))
      );
      setText(
        el.reportTotalOutstanding,
        formatPeso(rows.reduce((sum, row) => sum + Number(row.balance || 0), 0))
      );

      if (!rows.length) {
        el.reportsTableBody.innerHTML = `
          <tr>
            <td colspan="11" class="muted">No invoices found for the selected filters.</td>
          </tr>
        `;
        renderPaymentReceivedReportView();
        return;
      }

      el.reportsTableBody.innerHTML = rows
        .map((row) => `
          <tr>
            <td>${escapeHtml(row.customerName)}</td>
            <td>${escapeHtml(row.invoiceNumber)}</td>
            <td>${escapeHtml(row.invoiceDate || "-")}</td>
            <td>${escapeHtml(row.poNumber)}</td>
            <td>${escapeHtml(row.reference)}</td>
            <td>${formatPeso(row.total)}</td>
            <td>${formatPeso(row.paid)}</td>
            <td>${formatPeso(row.balance)}</td>
            <td>${row.statusHtml}</td>
            <td>${escapeHtml(row.collectionReceipt)}</td>
            <td>
              <button
                type="button"
                class="btn btn-light"
                data-report-customer-id="${escapeHtml(row.customerId)}"
                data-report-invoice-id="${escapeHtml(row.invoiceId)}"
              >
                ${escapeHtml(row.latestPaidDateDisplay)}
              </button>
            </td>
          </tr>
        `)
        .join("");

      renderPaymentReceivedReportView();
    }

    function clearReportFilters() {
      if (el.reportCustomerFilter) el.reportCustomerFilter.value = "";
      if (el.reportInvoiceDateFrom) el.reportInvoiceDateFrom.value = "";
      if (el.reportInvoiceDateTo) el.reportInvoiceDateTo.value = "";
      if (el.reportPaidDateFrom) el.reportPaidDateFrom.value = "";
      if (el.reportPaidDateTo) el.reportPaidDateTo.value = "";
      if (el.reportStatusFilter) el.reportStatusFilter.value = "";
      if (el.reportInvoiceNumberSort) el.reportInvoiceNumberSort.value = "date_desc";

      renderReportsView();
    }

    function getPaymentReportStatusInfo(payment) {
      if (payment.method === "Cheque") {
        const chequeStatus = getChequeStatus(payment);
        if (chequeStatus === "Bounced") {
          return {
            code: "BOUNCED",
            label: "Bounced",
            resolvedDate: String(getPaymentDetailsObject(payment).bouncedAt || "").trim()
          };
        }

        if (chequeStatus === "Pending") {
          return {
            code: "PENDING",
            label: "Pending",
            resolvedDate: ""
          };
        }
      }

      return {
        code: "COLLECTED",
        label: "Collected / Cleared",
        resolvedDate: String(getPaymentDetailsObject(payment).clearedAt || payment.payment_date || "").trim()
      };
    }

    function getPaymentAppliedToText(payment) {
      const items = (payment.allocations || []).map((alloc) => {
        const invoice = (state.invoices || []).find((item) => item.id === alloc.invoice_id);
        return `${getInvoiceReferenceLabel(invoice)} (${formatPeso(getAllocationAmount(alloc))})`;
      });

      return items.join(", ") || "-";
    }

    function getPaymentReportRows() {
      const customerId = String(el.paymentReportCustomerFilter?.value || "").trim();
      const dateFrom = String(el.paymentReportDateFrom?.value || "").trim();
      const dateTo = String(el.paymentReportDateTo?.value || "").trim();
      const methodFilter = String(el.paymentReportMethodFilter?.value || "").trim();
      const statusFilter = String(el.paymentReportStatusFilter?.value || "").trim();
      const customerMap = getCustomerMap();

      return (state.payments || [])
        .map((payment) => {
          const customer = customerMap.get(payment.customer_id) || null;
          const statusInfo = getPaymentReportStatusInfo(payment);
          const resolvedDate = statusInfo.resolvedDate
            ? String(statusInfo.resolvedDate).includes("T")
              ? formatDateTime(statusInfo.resolvedDate)
              : statusInfo.resolvedDate
            : "-";

          return {
            payment,
            paymentId: payment.id,
            customerId: payment.customer_id,
            customerName: customer?.name || "-",
            paymentDate: payment.payment_date || "",
            type: getPaymentTypeLabel(payment),
            method: payment.method || "-",
            reference: getPaymentCollectionReceipt(payment) || "-",
            grossAmount: Number(payment.amount || 0),
            statusCode: statusInfo.code,
            statusLabel: statusInfo.label,
            appliedTo: getPaymentAppliedToText(payment),
            collectionReceipt: getPaymentCollectionReceipt(payment) || "-",
            resolvedDate,
            notes: getPaymentDetailsObject(payment).bounceReason || "-",
            statusClass:
              statusInfo.code === "COLLECTED"
                ? "status-paid"
                : statusInfo.code === "PENDING"
                  ? "status-partial"
                  : "status-unpaid"
          };
        })
        .filter((row) => {
          if (customerId && row.customerId !== customerId) return false;
          if (!passesDateFilter(row.paymentDate, dateFrom, dateTo)) return false;
          if (methodFilter && row.method !== methodFilter) return false;
          if (statusFilter && row.statusCode !== statusFilter) return false;
          return true;
        })
        .sort((left, right) => String(right.paymentDate || "").localeCompare(String(left.paymentDate || "")));
    }

    function bindPaymentReportTableEvents() {
      if (paymentReportTableEventsBound || !el.paymentReportsTableBody) return;

      el.paymentReportsTableBody.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-report-payment-id]");
        if (!button) return;

        const customerId = button.dataset.reportCustomerId || "";
        const paymentId = button.dataset.reportPaymentId || "";
        if (!customerId || !paymentId) return;

        openReportPaymentDetails(customerId, paymentId);
      });

      paymentReportTableEventsBound = true;
    }

    function renderPaymentReceivedReportView() {
      if (!el.paymentReportsTableBody) return;

      bindPaymentReportTableEvents();
      const rows = getPaymentReportRows();
      el.paymentReportsTableBody.innerHTML = "";

      setText(el.paymentReportCount, String(rows.length));
      setText(
        el.paymentReportGrossTotal,
        formatPeso(rows.reduce((sum, row) => sum + Number(row.grossAmount || 0), 0))
      );
      setText(
        el.paymentReportClearedTotal,
        formatPeso(
          rows
            .filter((row) => row.statusCode === "COLLECTED")
            .reduce((sum, row) => sum + Number(row.grossAmount || 0), 0)
        )
      );
      setText(
        el.paymentReportPendingTotal,
        formatPeso(
          rows
            .filter((row) => row.statusCode === "PENDING")
            .reduce((sum, row) => sum + Number(row.grossAmount || 0), 0)
        )
      );
      setText(
        el.paymentReportBouncedTotal,
        formatPeso(
          rows
            .filter((row) => row.statusCode === "BOUNCED")
            .reduce((sum, row) => sum + Number(row.grossAmount || 0), 0)
        )
      );

      if (!rows.length) {
        el.paymentReportsTableBody.innerHTML = `
          <tr>
            <td colspan="11" class="muted">No payments found for the selected filters.</td>
          </tr>
        `;
        return;
      }

      el.paymentReportsTableBody.innerHTML = rows
        .map((row) => `
          <tr>
            <td>${escapeHtml(row.paymentDate || "-")}</td>
            <td>${escapeHtml(row.customerName)}</td>
            <td>${escapeHtml(row.type)}</td>
            <td>${escapeHtml(row.method)}</td>
            <td>${escapeHtml(row.reference)}</td>
            <td>${formatPeso(row.grossAmount)}</td>
            <td><span class="status-pill ${escapeHtml(row.statusClass)}">${escapeHtml(row.statusLabel)}</span></td>
            <td>${escapeHtml(row.appliedTo)}</td>
            <td>${escapeHtml(row.collectionReceipt)}</td>
            <td>
              <button
                type="button"
                class="btn btn-light"
                data-report-customer-id="${escapeHtml(row.customerId)}"
                data-report-payment-id="${escapeHtml(row.paymentId)}"
              >
                ${escapeHtml(row.resolvedDate)}
              </button>
            </td>
            <td>${escapeHtml(row.notes)}</td>
          </tr>
        `)
        .join("");
    }

    function clearPaymentReportFilters() {
      if (el.paymentReportCustomerFilter) el.paymentReportCustomerFilter.value = "";
      if (el.paymentReportDateFrom) el.paymentReportDateFrom.value = "";
      if (el.paymentReportDateTo) el.paymentReportDateTo.value = "";
      if (el.paymentReportMethodFilter) el.paymentReportMethodFilter.value = "";
      if (el.paymentReportStatusFilter) el.paymentReportStatusFilter.value = "";

      renderPaymentReceivedReportView();
    }

    function populateReportCustomerFilter() {
      const html = buildCustomerFilterOptionsHtml();

      if (el.reportCustomerFilter) el.reportCustomerFilter.innerHTML = html;
      if (el.paymentReportCustomerFilter) el.paymentReportCustomerFilter.innerHTML = html;
    }

    function downloadReportCsv() {
      const rows = getReportRows();
      const lines = [
        [
          "Customer",
          "Invoice #",
          "Invoice Date",
          "PO #",
          "Reference",
          "Total",
          "Paid",
          "Balance",
          "Status",
          "Collection Receipt (CR)",
          "Latest Paid Date"
        ].map(csvSafe).join(",")
      ];

      rows.forEach((row) => {
        lines.push([
          row.customerName,
          row.invoiceNumber,
          row.invoiceDate || "",
          row.poNumber,
          row.reference,
          row.total,
          row.paid,
          row.balance,
          row.status,
          row.collectionReceipt,
          row.latestPaidDateDisplay
        ].map(csvSafe).join(","));
      });

      downloadTextFile(`invoice-report-${todayStr()}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
    }

    function downloadPaymentReportCsv() {
      const rows = getPaymentReportRows();
      const lines = [
        [
          "Payment Date",
          "Customer",
          "Type",
          "Method",
          "Reference",
          "Gross Amount",
          "Status",
          "Applied To",
          "Collection Receipt (CR)",
          "Resolved Date",
          "Notes"
        ].map(csvSafe).join(",")
      ];

      rows.forEach((row) => {
        lines.push([
          row.paymentDate || "",
          row.customerName,
          row.type,
          row.method,
          row.reference,
          row.grossAmount,
          row.statusLabel,
          row.appliedTo,
          row.collectionReceipt,
          row.resolvedDate,
          row.notes
        ].map(csvSafe).join(","));
      });

      downloadTextFile(`payment-received-report-${todayStr()}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
    }

    function downloadTbvReportCsv() {
      const rows = getFilteredTbvRows();
      const lines = [
        [
          "Requested At",
          "Customer",
          "Invoice #",
          "Invoice Status",
          "Requested By",
          "Explanation",
          "TBV Status",
          "Decision Date",
          "Decided By",
          "Decision Notes"
        ].map(csvSafe).join(",")
      ];

      rows.forEach((row) => {
        lines.push([
          row.createdAtDisplay,
          row.customerName,
          row.invoiceNumber,
          row.invoiceStatusText,
          row.requestedByDisplay,
          row.explanation,
          row.tbvStatus,
          row.decisionDateDisplay,
          row.decidedBy,
          row.decisionNotes
        ].map(csvSafe).join(","));
      });

      downloadTextFile(`tbv-report-${todayStr()}.csv`, lines.join("\n"), "text/csv;charset=utf-8");
    }

    function buildPrintTable(headers, bodyHtml, title) {
      return `
        <!doctype html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>${escapeHtml(title)}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
              h1 { margin: 0 0 16px; font-size: 22px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
              th { background: #f3f4f6; }
              .status-pill { display: inline-block; padding: 2px 8px; border-radius: 999px; border: 1px solid #bbb; }
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <h1>${escapeHtml(title)}</h1>
            <table>
              <thead>
                <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
              </thead>
              <tbody>
                ${bodyHtml}
              </tbody>
            </table>
            <script>
              window.onload = function () {
                window.print();
              };
            </script>
          </body>
        </html>
      `;
    }

    function printReport() {
      const rows = getReportRows();
      const html = buildPrintTable(
        [
          "Customer",
          "Invoice #",
          "Invoice Date",
          "PO #",
          "Reference",
          "Total",
          "Paid",
          "Balance",
          "Status",
          "Collection Receipt (CR)",
          "Latest Paid Date"
        ],
        rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.customerName)}</td>
            <td>${escapeHtml(row.invoiceNumber)}</td>
            <td>${escapeHtml(row.invoiceDate || "-")}</td>
            <td>${escapeHtml(row.poNumber)}</td>
            <td>${escapeHtml(row.reference)}</td>
            <td>${escapeHtml(formatPeso(row.total))}</td>
            <td>${escapeHtml(formatPeso(row.paid))}</td>
            <td>${escapeHtml(formatPeso(row.balance))}</td>
            <td>${row.statusHtml}</td>
            <td>${escapeHtml(row.collectionReceipt)}</td>
            <td>${escapeHtml(row.latestPaidDateDisplay)}</td>
          </tr>
        `).join(""),
        "Invoice Report"
      );

      openPrintWindow(html);
    }

    function printPaymentReceivedReport() {
      const rows = getPaymentReportRows();
      const html = buildPrintTable(
        [
          "Payment Date",
          "Customer",
          "Type",
          "Method",
          "Reference",
          "Gross Amount",
          "Status",
          "Applied To",
          "Collection Receipt (CR)",
          "Resolved Date",
          "Notes"
        ],
        rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.paymentDate || "-")}</td>
            <td>${escapeHtml(row.customerName)}</td>
            <td>${escapeHtml(row.type)}</td>
            <td>${escapeHtml(row.method)}</td>
            <td>${escapeHtml(row.reference)}</td>
            <td>${escapeHtml(formatPeso(row.grossAmount))}</td>
            <td><span class="status-pill">${escapeHtml(row.statusLabel)}</span></td>
            <td>${escapeHtml(row.appliedTo)}</td>
            <td>${escapeHtml(row.collectionReceipt)}</td>
            <td>${escapeHtml(row.resolvedDate)}</td>
            <td>${escapeHtml(row.notes)}</td>
          </tr>
        `).join(""),
        "Payment Received Report"
      );

      openPrintWindow(html);
    }

    function printTbvReport() {
      const rows = getFilteredTbvRows();
      const html = buildPrintTable(
        [
          "Requested At",
          "Customer",
          "Invoice #",
          "Invoice Status",
          "Requested By",
          "Explanation",
          "TBV Status",
          "Decision Date",
          "Decided By",
          "Decision Notes"
        ],
        rows.map((row) => `
          <tr>
            <td>${escapeHtml(row.createdAtDisplay)}</td>
            <td>${escapeHtml(row.customerName)}</td>
            <td>${escapeHtml(row.invoiceNumber)}</td>
            <td>${escapeHtml(row.invoiceStatusText)}</td>
            <td>${escapeHtml(row.requestedByDisplay)}</td>
            <td>${escapeHtml(row.explanation)}</td>
            <td>${escapeHtml(row.tbvStatus)}</td>
            <td>${escapeHtml(row.decisionDateDisplay)}</td>
            <td>${escapeHtml(row.decidedBy)}</td>
            <td>${escapeHtml(row.decisionNotes)}</td>
          </tr>
        `).join(""),
        "TBV Report"
      );

      openPrintWindow(html);
    }

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
