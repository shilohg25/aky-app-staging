(function () {
  "use strict";

  function initAiDocumentAssist(deps) {
    const {
      supabaseClient,
      state,
      el,
      canUseAiAssist,
      getSelectedCustomer,
      addLineItemRow,
      updateInvoiceTotal,
      getInvoiceEditorState,
      renderPaymentMethodFields,
      renderPaymentReviewBox,
      formatPeso,
      round2,
      todayStr,
      escapeHtml
    } = deps || {};

    const aiDocAssist = {
      invoice: { imageDataUrl: "" },
      payment: { imageDataUrl: "" }
    };

    bindAiUploadUi({
      kind: "invoice",
      fileInputId: "invoiceAiFileInput",
      pasteZoneId: "invoiceAiPasteZone",
      previewWrapId: "invoiceAiPreviewWrap",
      previewImgId: "invoiceAiPreviewImg",
      statusId: "invoiceAiStatus",
      analyzeBtnId: "invoiceAiAnalyzeBtn",
      clearBtnId: "invoiceAiClearBtn",
      analyzeHandler: analyzeInvoiceDocumentWithAi
    });

    bindAiUploadUi({
      kind: "payment",
      fileInputId: "paymentAiFileInput",
      pasteZoneId: "paymentAiPasteZone",
      previewWrapId: "paymentAiPreviewWrap",
      previewImgId: "paymentAiPreviewImg",
      statusId: "paymentAiStatus",
      analyzeBtnId: "paymentAiAnalyzeBtn",
      clearBtnId: "paymentAiClearBtn",
      analyzeHandler: analyzePaymentDocumentWithAi
    });

    function bindAiUploadUi(config) {
      const fileInput = document.getElementById(config.fileInputId);
      const pasteZone = document.getElementById(config.pasteZoneId);
      const previewWrap = document.getElementById(config.previewWrapId);
      const previewImg = document.getElementById(config.previewImgId);
      const statusBox = document.getElementById(config.statusId);
      const analyzeBtn = document.getElementById(config.analyzeBtnId);
      const clearBtn = document.getElementById(config.clearBtnId);

      if (!fileInput || !pasteZone || !previewWrap || !previewImg || !statusBox || !analyzeBtn || !clearBtn) {
        return;
      }

      const setStatus = (html) => {
        statusBox.innerHTML = html;
      };

      const setPreview = (dataUrl) => {
        aiDocAssist[config.kind].imageDataUrl = dataUrl || "";
        previewImg.src = dataUrl || "";
        previewWrap.classList.toggle("hidden", !dataUrl);

        if (dataUrl) {
          setStatus("Image ready. Click <strong>Analyze with AI</strong> to fill the form.");
        } else {
          setStatus("Nothing uploaded yet.");
        }
      };

      fileInput.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          const dataUrl = await aiFileToDataUrl(file);
          setPreview(dataUrl);
        } catch (error) {
          alert(error.message || "Could not read the image.");
        }
      });

      pasteZone.addEventListener("paste", async (event) => {
        const items = [...(event.clipboardData?.items || [])];
        const imageItem = items.find((item) => item.type.startsWith("image/"));

        if (!imageItem) {
          setStatus("No image found in clipboard. Use Snipping Tool, copy the image, click this box, then press <strong>Ctrl + V</strong>.");
          return;
        }

        event.preventDefault();

        const file = imageItem.getAsFile();
        if (!file) {
          setStatus("Clipboard image could not be read. Try copying the snippet again.");
          return;
        }

        try {
          const dataUrl = await aiFileToDataUrl(file);
          setPreview(dataUrl);
        } catch (error) {
          alert(error.message || "Could not read the pasted image.");
        }
      });

      pasteZone.addEventListener("click", () => pasteZone.focus());
      analyzeBtn.addEventListener("click", config.analyzeHandler);

      clearBtn.addEventListener("click", () => {
        fileInput.value = "";
        setPreview("");
      });
    }

    function aiSetBusy(kind, isBusy) {
      const analyzeBtn = document.getElementById(`${kind}AiAnalyzeBtn`);
      const clearBtn = document.getElementById(`${kind}AiClearBtn`);
      const fileInput = document.getElementById(`${kind}AiFileInput`);
      const pasteZone = document.getElementById(`${kind}AiPasteZone`);

      if (analyzeBtn) {
        analyzeBtn.disabled = isBusy;
        analyzeBtn.textContent = isBusy ? "Analyzing..." : "Analyze with AI";
      }

      if (clearBtn) clearBtn.disabled = isBusy;
      if (fileInput) fileInput.disabled = isBusy;
      if (pasteZone) pasteZone.classList.toggle("disabled", !!isBusy);
    }

    async function aiFileToDataUrl(file) {
      if (!file.type.startsWith("image/")) {
        throw new Error("Please use an image file.");
      }

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(new Error("Could not read the selected image."));
        reader.readAsDataURL(file);
      });
    }

    async function callAiDocumentAssist(payload) {
      const { data, error } = await supabaseClient.functions.invoke("ai-document-assist", {
        body: payload
      });

      if (error) {
        try {
          if (error.context) {
            const rawText = await error.context.text();

            try {
              const parsed = JSON.parse(rawText);
              throw new Error(
                parsed?.error ||
                parsed?.details ||
                parsed?.message ||
                rawText ||
                error.message ||
                "AI function call failed."
              );
            } catch (jsonParseError) {
              throw new Error(rawText || error.message || "AI function call failed.");
            }
          }

          throw new Error(error.message || "AI function call failed.");
        } catch (innerError) {
          throw new Error(innerError.message || error.message || "AI function call failed.");
        }
      }

      if (!data?.ok) {
        throw new Error(data?.error || "AI extraction failed.");
      }

      return data.result;
    }

    async function analyzeInvoiceDocumentWithAi() {
      if (!canUseAiAssist()) {
        alert("Only owner can use AI Assist.");
        return;
      }

      const statusBox = document.getElementById("invoiceAiStatus");
      const imageDataUrl = aiDocAssist.invoice.imageDataUrl;
      const customer = getSelectedCustomer();

      if (!customer) {
        alert("Please select a customer first.");
        return;
      }

      if (!imageDataUrl) {
        alert("Upload or paste an invoice image first.");
        return;
      }

      aiSetBusy("invoice", true);
      statusBox.innerHTML = "Analyzing invoice image...";

      try {
        const result = await callAiDocumentAssist({
          mode: "invoice",
          imageDataUrl,
          customerName: customer.name || null
        });

        applyInvoiceAiResult(result);
      } catch (error) {
        statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> ${escapeHtml(error.message || "Unknown error")}</span>`;
      } finally {
        aiSetBusy("invoice", false);
      }
    }

    function applyInvoiceAiResult(result) {
      const statusBox = document.getElementById("invoiceAiStatus");

      if (!result || typeof result !== "object") {
        statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> Invalid response.</span>`;
        return;
      }

      if (result.invoice_number) el.invoiceNumber.value = String(result.invoice_number);
      if (result.invoice_date) el.invoiceDate.value = String(result.invoice_date);
      if (result.po_number) el.poNumber.value = String(result.po_number);
      if (result.reference_info) el.referenceInfo.value = String(result.reference_info);

      const items = Array.isArray(result.line_items) ? result.line_items : [];
      el.lineItemsContainer.innerHTML = "";

      items
        .filter((item) => item && (item.product_name || item.qty || item.unit_price))
        .forEach((item) => {
          addLineItemRow({
            product: item.product_name || "",
            qty: item.qty ?? "",
            price: item.unit_price ?? "",
            discountPerQty: 0
          });
        });

      if (!el.lineItemsContainer.children.length) {
        addLineItemRow();
      }

      updateInvoiceTotal();

      const editorState = getInvoiceEditorState();
      const detectedTotal = Number(result.total_amount || 0);
      const appTotal = Number(editorState.totalAmount || 0);
      const hasTotalMismatch =
        detectedTotal > 0 &&
        Math.abs(round2(detectedTotal) - round2(appTotal)) > 0.01;

      const warnings = Array.isArray(result.warnings) ? result.warnings : [];
      const warningHtml = [
        ...(hasTotalMismatch
          ? [`Detected total ${formatPeso(detectedTotal)} does not match app total ${formatPeso(appTotal)}.`]
          : []),
        ...warnings
      ]
        .map((warning) => `• ${escapeHtml(warning)}`)
        .join("<br>");

      statusBox.innerHTML = `
        <strong>AI filled the invoice form.</strong><br>
        Document type: <strong>${escapeHtml(result.document_type || "unknown")}</strong><br>
        Confidence: <strong>${escapeHtml(result.confidence || "unknown")}</strong><br>
        Detected Invoice #: <strong>${escapeHtml(result.invoice_number || "-")}</strong><br>
        Detected Date: <strong>${escapeHtml(result.invoice_date || "-")}</strong><br>
        Detected Total: <strong>${result.total_amount ? formatPeso(result.total_amount) : "-"}</strong><br>
        Line items added: <strong>${items.length}</strong><br>
        Review every field before saving.
        ${warningHtml ? `<div style="margin-top:10px;color:#8a5a00;">${warningHtml}</div>` : ""}
      `;
    }

    async function analyzePaymentDocumentWithAi() {
      if (!canUseAiAssist()) {
        alert("Only owner can use AI Assist.");
        return;
      }

      const statusBox = document.getElementById("paymentAiStatus");
      const imageDataUrl = aiDocAssist.payment.imageDataUrl;
      const customer = getSelectedCustomer();

      if (!state.paymentDraft) {
        alert("Open the payment details step first.");
        return;
      }

      if (!customer) {
        alert("Please select a customer first.");
        return;
      }

      if (!imageDataUrl) {
        alert("Upload or paste a payment proof image first.");
        return;
      }

      aiSetBusy("payment", true);
      statusBox.innerHTML = "Analyzing payment proof...";

      try {
        const result = await callAiDocumentAssist({
          mode: "payment",
          imageDataUrl,
          customerName: customer.name || null,
          draftAmount: Number(state.paymentDraft.amount || 0),
          draftInvoices: (state.paymentDraft.allocations || []).map((alloc) => {
            const invoice = state.invoices.find((inv) => inv.id === alloc.invoiceId);
            return {
              invoice_number: invoice?.invoice_number || null,
              allocated_amount: alloc.amount
            };
          })
        });

        applyPaymentAiResult(result);
      } catch (error) {
        statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> ${escapeHtml(error.message || "Unknown error")}</span>`;
      } finally {
        aiSetBusy("payment", false);
      }
    }

    function applyPaymentAiResult(result) {
      const statusBox = document.getElementById("paymentAiStatus");

      if (!result || typeof result !== "object") {
        statusBox.innerHTML = `<span style="color:#c73636;"><strong>AI failed:</strong> Invalid response.</span>`;
        return;
      }

      const suggestedMethod = result.payment_method_suggestion || "";

      if (suggestedMethod === "Cheque" || suggestedMethod === "Online" || suggestedMethod === "Cash") {
        el.paymentMethodSelect.value = suggestedMethod;
        renderPaymentMethodFields();
      }

      if (suggestedMethod === "Cheque") {
        if (result.cheque_number) el.chequeNumberInput.value = String(result.cheque_number);
        if (result.cheque_date) el.chequeDateInput.value = String(result.cheque_date);

        if (typeof result.is_post_dated === "boolean") {
          el.chequePostDatedInput.checked = result.is_post_dated;
        } else if (result.cheque_date) {
          el.chequePostDatedInput.checked = result.cheque_date > todayStr();
        }
      }

      if (suggestedMethod === "Online") {
        if (result.reference_number) el.onlineReferenceInput.value = String(result.reference_number);
        if (result.platform_name) el.onlinePlatformInput.value = String(result.platform_name);
      }

      if (suggestedMethod === "Cash" && result.bank_account_number) {
        el.cashBankAccountInput.value = String(result.bank_account_number);
      }

      renderPaymentMethodFields();
      renderPaymentReviewBox();

      const warnings = Array.isArray(result.warnings) ? result.warnings.slice() : [];
      const detectedAmount = Number(result.amount || 0);
      const draftAmount = Number(state.paymentDraft?.amount || 0);

      if (detectedAmount > 0 && draftAmount > 0 && Math.abs(round2(detectedAmount) - round2(draftAmount)) > 0.01) {
        warnings.unshift(`Detected amount ${formatPeso(detectedAmount)} does not match your prepared payment amount ${formatPeso(draftAmount)}.`);
      }

      const warningHtml = warnings.map((warning) => `• ${escapeHtml(warning)}`).join("<br>");

      statusBox.innerHTML = `
        <strong>AI filled the payment details.</strong><br>
        Document type: <strong>${escapeHtml(result.document_type || "unknown")}</strong><br>
        Confidence: <strong>${escapeHtml(result.confidence || "unknown")}</strong><br>
        Suggested method: <strong>${escapeHtml(result.payment_method_suggestion || "-")}</strong><br>
        Detected Amount: <strong>${result.amount ? formatPeso(result.amount) : "-"}</strong><br>
        Detected Reference: <strong>${escapeHtml(result.reference_number || result.cheque_number || "-")}</strong><br>
        Review the payment method and all extracted fields before saving.
        ${warningHtml ? `<div style="margin-top:10px;color:#8a5a00;">${warningHtml}</div>` : ""}
        <div style="margin-top:10px;">Invoice allocation and withholding tax still stay under your control.</div>
      `;
    }

    return aiDocAssist;
  }

  window.AKY_AI_DOCUMENT_ASSIST = Object.freeze({
    initAiDocumentAssist
  });
})();
