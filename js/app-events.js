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

    function on(node, eventName, handler, options) {
      if (!node || typeof handler !== "function") return;
      node.addEventListener(eventName, handler, options);
    }

    function onClick(node, handler) {
      on(node, "click", handler);
    }

    function onEnter(node, handler) {
      on(node, "keydown", (event) => {
        if (event.key !== "Enter") return;
        event.preventDefault();
        handler(event);
      });
    }

    function withBusy(button, busyText, work) {
      return () => runWithBusyState(button, busyText, work);
    }

    function canCloseModal(modal) {
  if (!modal) return false;
  if (modal === el.changePasswordModal && el.changePasswordModal?.dataset.force === "1") {
    return false;
  }
  return true;
}

function bindModalClose(button, modal) {
  onClick(button, () => {
    if (!canCloseModal(modal)) return;
    closeModal(modal);
  });
}

    function clearExecutiveFilters() {
      if (el.execDateFrom) el.execDateFrom.value = "";
      if (el.execDateTo) el.execDateTo.value = "";
      renderExecutiveView();
    }

    function bindEvents() {
      onClick(el.loginBtn, login);
      onEnter(el.loginUsername, login);
      onEnter(el.loginPassword, login);
      onClick(el.logoutBtn, logout);
      onClick(el.openChangePasswordBtn, () => openChangePasswordModal(false));
      onClick(el.saveOwnPasswordBtn, withBusy(el.saveOwnPasswordBtn, "Saving...", saveOwnPassword));
      bindModalClose(el.closeChangePasswordModalBtn, el.changePasswordModal);

      onClick(el.navCustomers, () => setView("customers"));
      onClick(el.navExecutive, () => setView("executive"));
      onClick(el.navNotifications, () => setView("notifications"));
      onClick(el.navChequeRegister, () => setView("cheque-register"));
      onClick(el.navReports, () => setView("reports"));
      onClick(el.navLogs, () => setView("logs"));
      onClick(el.navAccounts, () => setView("accounts"));

      onClick(el.openCustomerModalBtn, openAddCustomerModal);
      onClick(el.customerSearchBtn, renderCustomerList);
      onClick(el.customerClearSearchBtn, () => {
        if (el.customerSearch) el.customerSearch.value = "";
        renderCustomerList();
      });
      on(el.customerSearch, "input", renderCustomerList);
      onEnter(el.customerSearch, renderCustomerList);

      bindModalClose(el.closeCustomerModalBtn, el.customerModal);
      on(el.customerDiscountAuthorizedInput, "change", renderCustomerDiscountFields);
      on(el.customerDiscountMaxAmountInput, "input", renderCustomerDiscountFields);
      onClick(el.addContactBtn, () => addContactRow());
      onClick(el.saveCustomerBtn, withBusy(el.saveCustomerBtn, "Saving...", saveCustomer));
      onClick(el.editCustomerBtn, openEditCustomerModal);
      onClick(el.deleteCustomerBtn, withBusy(el.deleteCustomerBtn, "Deleting...", deleteSelectedCustomer));

      onClick(el.createInvoiceBtn, openInvoiceModalForCreate);
      bindModalClose(el.closeInvoiceModalBtn, el.invoiceModal);
      on(el.invoiceDiscountEnabled, "change", () => {
        renderInvoiceDiscountControls();
        updateInvoiceTotal();
      });
      on(el.invoiceDiscountMode, "change", () => {
        renderInvoiceDiscountControls();
        updateInvoiceTotal();
      });
      on(el.invoiceDiscountFixedAmount, "input", updateInvoiceTotal);
      onClick(el.addLineBtn, () => addLineItemRow());
      onClick(el.saveInvoiceBtn, withBusy(el.saveInvoiceBtn, "Saving...", saveInvoice));

      bindModalClose(el.closeInvoiceViewModalBtn, el.invoiceViewModal);
      bindModalClose(el.closePaymentViewModalBtn, el.paymentViewModal);

      onClick(el.makePaymentBtn, openPaymentTypeModal);
      bindModalClose(el.closePaymentTypeModalBtn, el.paymentTypeModal);
      onClick(el.payByInvoiceBtn, openPayByInvoiceStep);
      onClick(el.partialPaymentBtn, openPartialPaymentStep);

      bindModalClose(el.closeInvoiceSelectionModalBtn, el.invoiceSelectionModal);
      bindModalClose(el.cancelInvoiceSelectionBtn, el.invoiceSelectionModal);
      onClick(el.proceedInvoiceSelectionBtn, proceedSelectedInvoices);

      bindModalClose(el.closePartialPaymentModalBtn, el.partialPaymentModal);
      on(el.partialInvoiceSelect, "change", renderPartialBalanceInfo);
      on(el.partialAmountInput, "input", renderPartialBalanceInfo);
      onClick(el.proceedPartialPaymentBtn, proceedPartialPayment);

      bindModalClose(el.closePaymentMethodModalBtn, el.paymentMethodModal);
      on(el.paymentMethodSelect, "change", () => {
        renderPaymentMethodFields();
        renderWithholdingTaxUi();
        renderPaymentReviewBox();
      });
      on(el.collectionReceiptInput, "input", renderPaymentReviewBox);
      on(el.chequeNumberInput, "input", renderPaymentReviewBox);
      on(el.chequeDateInput, "change", renderPaymentReviewBox);
      on(el.chequePostDatedInput, "change", renderPaymentReviewBox);
      on(el.onlineReferenceInput, "input", renderPaymentReviewBox);
      on(el.onlinePlatformInput, "input", renderPaymentReviewBox);
      on(el.cashBankAccountInput, "input", renderPaymentReviewBox);
      on(el.withholdingTaxAppliedInput, "change", () => {
        renderWithholdingTaxUi();
        renderPaymentReviewBox();
      });
      onClick(el.savePaymentBtn, withBusy(el.savePaymentBtn, "Saving...", savePayment));

      onClick(el.applyExecFilterBtn, renderExecutiveView);
      onClick(el.clearExecFilterBtn, clearExecutiveFilters);

      on(el.notificationTbvStatusFilter, "change", renderTbvRequestsTable);
      on(el.notificationTbvInvoiceSearch, "input", renderTbvRequestsTable);
      onEnter(el.notificationTbvInvoiceSearch, renderTbvRequestsTable);
      onClick(el.downloadTbvReportBtn, downloadTbvReportCsv);
      onClick(el.printTbvReportBtn, printTbvReport);

      onClick(el.applyReportFilterBtn, renderReportsView);
      onClick(el.clearReportFilterBtn, clearReportFilters);
      onClick(el.downloadReportBtn, downloadReportCsv);
      onClick(el.printReportBtn, printReport);

      onClick(el.applyPaymentReportFilterBtn, renderPaymentReceivedReportView);
      onClick(el.clearPaymentReportFilterBtn, clearPaymentReportFilters);
      onClick(el.downloadPaymentReportBtn, downloadPaymentReportCsv);
      onClick(el.printPaymentReportBtn, printPaymentReceivedReport);

      bindModalClose(el.closeTbvModalBtn, el.tbvModal);
      onClick(el.saveTbvBtn, withBusy(el.saveTbvBtn, "Saving...", saveTbvRequest));

      bindModalClose(el.closeTbvDecisionModalBtn, el.tbvDecisionModal);
      onClick(el.denyTbvBtn, withBusy(el.denyTbvBtn, "Saving...", () => decideTbv("DENIED")));
      onClick(el.approveTbvBtn, withBusy(el.approveTbvBtn, "Saving...", () => decideTbv("APPROVED")));

      onClick(el.createSOABtn, openSoaModal);
      bindModalClose(el.closeSoaModalBtn, el.soaModal);
      on(el.soaShowPayments, "change", renderSoaPaymentRangeVisibility);
      on(el.soaAsOfDate, "change", autofillSoaPaymentRange);
      onClick(el.generateSoaBtn, generateSoa);

      onClick(el.applyAccountFilterBtn, renderAccountsView);
      onClick(el.refreshAccountsBtn, withBusy(el.refreshAccountsBtn, "Refreshing...", refreshAccounts));
      onClick(el.openAccountModalBtn, openCreateAccountModal);
      on(el.accountSearch, "input", renderAccountsView);
      onEnter(el.accountSearch, renderAccountsView);
      on(el.accountRoleFilter, "change", renderAccountsView);
      bindModalClose(el.closeAccountModalBtn, el.accountModal);
      onClick(el.saveAccountBtn, withBusy(el.saveAccountBtn, "Saving...", saveAccount));

      bindModalClose(el.closeResetPasswordModalBtn, el.resetPasswordModal);
      onClick(el.saveResetPasswordBtn, withBusy(el.saveResetPasswordBtn, "Saving...", saveResetPassword));

      document.querySelectorAll(".sortable-th[data-sort]").forEach((header) => {
        onClick(header, () => toggleLogSort(header.dataset.sort));
      });

      [
  el.customerModal,
  el.invoiceModal,
  el.invoiceViewModal,
  el.paymentViewModal,
  el.paymentTypeModal,
  el.invoiceSelectionModal,
  el.partialPaymentModal,
  el.paymentMethodModal,
  el.changePasswordModal,
  el.tbvModal,
  el.tbvDecisionModal,
  el.soaModal,
  el.accountModal,
  el.resetPasswordModal
].forEach((modal) => {
  on(modal, "click", (event) => {
    if (event.target !== modal) return;
    if (!canCloseModal(modal)) return;
    closeModal(modal);
  });
});

      on(document, "keydown", (event) => {
  if (event.key !== "Escape") return;

  [
    el.resetPasswordModal,
    el.accountModal,
    el.soaModal,
    el.tbvDecisionModal,
    el.tbvModal,
    el.paymentMethodModal,
    el.partialPaymentModal,
    el.invoiceSelectionModal,
    el.paymentTypeModal,
    el.paymentViewModal,
    el.invoiceViewModal,
    el.invoiceModal,
    el.customerModal,
    el.changePasswordModal
  ].forEach((modal) => {
    if (!modal || modal.style.display !== "flex") return;
    if (!canCloseModal(modal)) return;
    closeModal(modal);
  });
});
    }

    return { bindEvents };
  }

  window.AKY_APP_EVENTS = Object.freeze({
    initAppEvents
  });
})();
