(function () {
  "use strict";

  function initCustomerDocumentVault(deps) {
        const {
      supabaseClient,
      canUploadCustomerDocuments,
      canDeleteCustomerDocuments,
      getSelectedCustomer,
      getCurrentUser,
      escapeHtml
    } = deps || {};

    const AKY_DOCUMENT_UTILS = window.AKY_DOCUMENT_UTILS;
    const documentVaultState = {
      file: null,
      source: "upload",
      previewUrl: "",
      currentCustomerId: null,
      documents: []
    };
async function createCustomerDocumentViaServer(payload) {
  const fallbackWrite = window.AKY_DOCUMENT_UTILS?.writeCustomerDocumentDirect;

  try {
    const { data, error } = await supabaseClient.functions.invoke("customer-document-write", {
      body: payload
    });

    if (error) {
      throw error;
    }

    if (!data?.ok) {
      throw new Error(data?.error || "Customer document write failed.");
    }

    return data;
  } catch (error) {
    console.warn("[AKY] customer-document-write failed. Falling back to direct document write.", error);

    if (typeof fallbackWrite !== "function") {
      throw new Error(error?.message || "Customer document write failed.");
    }

    return fallbackWrite({
      supabaseClient,
      payload
    });
  }
}
    initDocumentVault();

    function initDocumentVault() {
      const fileInput = document.getElementById("customerDocumentFileInput");
      const saveBtn = document.getElementById("saveCustomerDocumentBtn");
      const clearBtn = document.getElementById("clearCustomerDocumentBtn");
      const docsTableBody = document.getElementById("customerDocumentsTableBody");

      if (!fileInput || !saveBtn || !clearBtn || !docsTableBody) {
        return;
      }

      ensureDocVaultPopupShell();

      fileInput.addEventListener("change", async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
          applyDocumentVaultFile(file, "upload");
        } catch (error) {
          setDocumentVaultStatus(error.message || "Could not use that file.", true);
          fileInput.value = "";
        }
      });

      saveBtn.addEventListener("click", saveCustomerDocument);
      clearBtn.addEventListener("click", () => clearDocumentVaultDraft(true));

      docsTableBody.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-doc-action]");
        if (!button) return;

        const action = button.getAttribute("data-doc-action");
        const docId = button.getAttribute("data-doc-id");
        if (!action || !docId) return;

        if (action === "view") {
          await openCustomerDocument(docId);
        }

        if (action === "delete") {
          await deleteCustomerDocument(docId);
        }
      });

      syncDocumentVaultCustomer();
    }

    function ensureDocVaultStandaloneButton() {
      const hint = document.getElementById("docVaultCustomerHint");
      if (!hint) return null;

      let bar = document.getElementById("docVaultHeaderBar");
      if (!bar) {
        bar = document.createElement("div");
        bar.id = "docVaultHeaderBar";
        bar.style.display = "flex";
        bar.style.justifyContent = "flex-end";
        bar.style.alignItems = "center";
        bar.style.gap = "10px";
        bar.style.margin = "8px 0 12px";
        hint.insertAdjacentElement("afterend", bar);
      }

      let btn = document.getElementById("docVaultStandaloneBtn");
      if (!btn) {
        btn = document.createElement("button");
        btn.type = "button";
        btn.id = "docVaultStandaloneBtn";
        btn.className = "btn btn-light small-btn";
        btn.style.padding = "8px 12px";
        btn.style.borderRadius = "10px";
        btn.textContent = "+ Other Document";
        bar.appendChild(btn);
      }

      return btn;
    }

    function ensureDocVaultPopupShell() {
      const uploader = document.getElementById("docVaultUploader");
      if (!uploader) return null;

      let overlay = document.getElementById("docVaultPopupOverlay");
      let panel = document.getElementById("docVaultPopupPanel");

      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "docVaultPopupOverlay";
        overlay.className = "hidden";
        overlay.style.position = "fixed";
        overlay.style.inset = "0";
        overlay.style.background = "rgba(15, 23, 42, 0.45)";
        overlay.style.zIndex = "9999";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.padding = "20px";

        panel = document.createElement("div");
        panel.id = "docVaultPopupPanel";
        panel.style.width = "100%";
        panel.style.maxWidth = "720px";
        panel.style.maxHeight = "90vh";
        panel.style.overflowY = "auto";
        panel.style.background = "#ffffff";
        panel.style.borderRadius = "18px";
        panel.style.boxShadow = "0 24px 70px rgba(0,0,0,0.18)";
        panel.style.padding = "18px";

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        overlay.addEventListener("click", (event) => {
          if (event.target === overlay) {
            closeDocVaultPopup();
          }
        });
      }

      if (panel && uploader.parentElement !== panel) {
        panel.appendChild(uploader);
      }

      uploader.classList.remove("hidden");
      uploader.style.margin = "0";
      uploader.style.padding = "0";
      uploader.style.border = "0";
      uploader.style.background = "transparent";
      uploader.style.boxShadow = "none";

      let popupHeader = document.getElementById("docVaultPopupHeader");
      if (!popupHeader) {
        popupHeader = document.createElement("div");
        popupHeader.id = "docVaultPopupHeader";
        popupHeader.style.display = "flex";
        popupHeader.style.justifyContent = "space-between";
        popupHeader.style.alignItems = "center";
        popupHeader.style.gap = "12px";
        popupHeader.style.marginBottom = "14px";
        popupHeader.innerHTML = `
          <h3 style="margin:0;font-size:20px;">Other Customer Document</h3>
          <button type="button" id="closeDocVaultPopupBtn" class="icon-btn">&times;</button>
        `;
        uploader.prepend(popupHeader);
        document.getElementById("closeDocVaultPopupBtn")?.addEventListener("click", closeDocVaultPopup);
      }

      const pasteZone = document.getElementById("customerDocumentPasteZone");
      if (pasteZone) {
        pasteZone.classList.add("hidden");
      }

      const notesInput = document.getElementById("customerDocumentNotes");
      const notesField = notesInput?.closest(".field");
      if (notesInput) notesInput.value = "";
      if (notesField) notesField.classList.add("hidden");

      const previewWrap = document.getElementById("customerDocumentPreviewWrap");
      if (previewWrap) {
        previewWrap.style.maxWidth = "280px";
      }

      const chooseWrap =
        document.getElementById("customerDocumentFileInput")?.closest(".field") ||
        document.getElementById("customerDocumentFileInput")?.parentElement;
      if (chooseWrap) {
        chooseWrap.style.maxWidth = "220px";
        chooseWrap.style.marginLeft = "auto";
      }

      return overlay;
    }

    function openDocVaultPopup() {
      const overlay = ensureDocVaultPopupShell();
      if (!overlay) return;

      documentVaultState.standaloneOpen = true;
      overlay.classList.remove("hidden");
      document.body.style.overflow = "hidden";

      setDocumentVaultStatus("Upload an image for a rare standalone customer document. Max 6MB.", false);
    }

    function closeDocVaultPopup() {
      const overlay = document.getElementById("docVaultPopupOverlay");
      if (overlay) overlay.classList.add("hidden");

      documentVaultState.standaloneOpen = false;
      document.body.style.overflow = "";
      clearDocumentVaultDraft(false);
    }

    function syncDocumentVaultCustomer() {
      if (typeof getSelectedCustomer !== "function") return;

      const customer = getSelectedCustomer();
      const customerId = customer?.id || null;

      const uploader = document.getElementById("docVaultUploader");
      const hint = document.getElementById("docVaultCustomerHint");
      const tableBody = document.getElementById("customerDocumentsTableBody");
      const standaloneBtn = ensureDocVaultStandaloneButton();

      if (!uploader || !hint || !tableBody) return;

      const canUploadStandalone = !!customerId && canUploadCustomerDocuments();

      if (standaloneBtn) {
        standaloneBtn.classList.toggle("hidden", !canUploadStandalone);
        standaloneBtn.textContent = "+ Other Document";
        standaloneBtn.onclick = () => openDocVaultPopup();
      }

      uploader.classList.toggle("hidden", !documentVaultState.standaloneOpen);

      if (!customerId) {
        hint.textContent = "Select a customer to view saved supporting documents.";
        tableBody.innerHTML = `<tr><td colspan="7" class="muted">Select a customer first.</td></tr>`;

        if (documentVaultState.currentCustomerId !== null) {
          documentVaultState.currentCustomerId = null;
          documentVaultState.documents = [];
          documentVaultState.standaloneOpen = false;
          closeDocVaultPopup();
        }

        return;
      }

      hint.textContent = `Saved documents for ${customer.name || "selected customer"}. Invoice and payment uploads appear here automatically.`;

      if (documentVaultState.currentCustomerId !== customerId) {
        documentVaultState.currentCustomerId = customerId;
        closeDocVaultPopup();
        loadCustomerDocuments();
      }
    }

    function applyDocumentVaultFile(file, source) {
      const previewWrap = document.getElementById("customerDocumentPreviewWrap");
      const previewImg = document.getElementById("customerDocumentPreviewImg");
      const titleInput = document.getElementById("customerDocumentTitle");

      AKY_DOCUMENT_UTILS.applyPreviewFile(documentVaultState, {
        file,
        previewWrap,
        previewImg,
        source: source || "upload"
      });

      if (titleInput && !titleInput.value.trim()) {
        titleInput.value = docVaultTitleFromFile(file.name);
      }

      setDocumentVaultStatus("Image ready. Review details, then click Save Document.", false);
    }

    function clearDocumentVaultDraft(resetStatus) {
      const fileInput = document.getElementById("customerDocumentFileInput");
      const previewWrap = document.getElementById("customerDocumentPreviewWrap");
      const previewImg = document.getElementById("customerDocumentPreviewImg");
      const titleInput = document.getElementById("customerDocumentTitle");
      const referenceInput = document.getElementById("customerDocumentReference");
      const notesInput = document.getElementById("customerDocumentNotes");
      const categoryInput = document.getElementById("customerDocumentCategory");

      AKY_DOCUMENT_UTILS.resetPreviewState(documentVaultState, {
        fileInput,
        previewWrap,
        previewImg,
        source: "upload",
        onReset: () => {
          if (titleInput) titleInput.value = "";
          if (referenceInput) referenceInput.value = "";
          if (notesInput) notesInput.value = "";
          if (categoryInput) categoryInput.value = "invoice";
        }
      });

      if (resetStatus) {
        setDocumentVaultStatus("Choose an image. Max 6MB.", false);
      }
    }

    function setDocumentVaultStatus(message, isError) {
      const statusBox = document.getElementById("customerDocumentStatus");
      AKY_DOCUMENT_UTILS.setStatusMessage(statusBox, message, isError);
    }

    async function saveCustomerDocument() {
      if (!canUploadCustomerDocuments()) {
        alert("Co-owner can view documents but cannot upload.");
        return;
      }

      const customer = typeof getSelectedCustomer === "function" ? getSelectedCustomer() : null;
      if (!customer?.id) {
        alert("Please select a customer first.");
        return;
      }

      if (!documentVaultState.file) {
        alert("Choose an image first.");
        return;
      }

      const categoryInput = document.getElementById("customerDocumentCategory");
      const titleInput = document.getElementById("customerDocumentTitle");
      const referenceInput = document.getElementById("customerDocumentReference");
      const notesInput = document.getElementById("customerDocumentNotes");
      const saveBtn = document.getElementById("saveCustomerDocumentBtn");
      const clearBtn = document.getElementById("clearCustomerDocumentBtn");

      const category = categoryInput?.value || "invoice";
      const title = titleInput?.value?.trim() || docVaultTitleFromFile(documentVaultState.file.name);
      const referenceCode = referenceInput?.value?.trim() || null;
      const notes = notesInput?.value?.trim() || null;

      try {
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.textContent = "Saving...";
        }
        if (clearBtn) clearBtn.disabled = true;

                await createCustomerDocumentViaServer({
  action: "create_customer_document",
  customer_id: customer.id,
  category,
  title,
  reference_code: referenceCode,
  notes,
  source: documentVaultState.source,
  uploaded_by: getCurrentUser?.()?.id || null,
  origin_screen: "customer_vault",
  file_name: documentVaultState.file.name,
  mime_type: documentVaultState.file.type || "image/png",
  file_size: documentVaultState.file.size,
  file_base64: await AKY_DOCUMENT_UTILS.fileToBase64(documentVaultState.file)
});

        clearDocumentVaultDraft(true);
        await loadCustomerDocuments();
        setDocumentVaultStatus("Document saved successfully.", false);
        closeDocVaultPopup();
      } catch (error) {
        setDocumentVaultStatus(error.message || "Could not save document.", true);
      } finally {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = "Save Document";
        }
        if (clearBtn) clearBtn.disabled = false;
      }
    }

    async function loadCustomerDocuments() {
      const customer = typeof getSelectedCustomer === "function" ? getSelectedCustomer() : null;
      const tableBody = document.getElementById("customerDocumentsTableBody");
      if (!tableBody) return;

      if (!customer?.id) {
        tableBody.innerHTML = `<tr><td colspan="7" class="muted">Select a customer first.</td></tr>`;
        return;
      }

      tableBody.innerHTML = `<tr><td colspan="7" class="muted">Loading documents...</td></tr>`;

      try {
        const { data, error } = await supabaseClient
          .from("customer_documents")
          .select("*")
          .eq("customer_id", customer.id)
          .order("uploaded_at", { ascending: false });

        if (error) {
          tableBody.innerHTML = `<tr><td colspan="7" class="muted">Could not load documents.</td></tr>`;
          return;
        }

        documentVaultState.documents = Array.isArray(data) ? data : [];
        renderCustomerDocumentsTable();
      } catch (error) {
        console.error(error);
        tableBody.innerHTML = `<tr><td colspan="7" class="muted">Could not load documents.</td></tr>`;
      }
    }

    function renderCustomerDocumentsTable() {
      const tableBody = document.getElementById("customerDocumentsTableBody");
      if (!tableBody) return;

      const canDelete = canDeleteCustomerDocuments();
      const docs = documentVaultState.documents || [];

      if (!docs.length) {
        tableBody.innerHTML = `<tr><td colspan="7" class="muted">No saved documents for this customer yet.</td></tr>`;
        return;
      }

      tableBody.innerHTML = docs.map((doc) => {
        const uploadedAt = doc.uploaded_at ? docVaultFormatDateTime(doc.uploaded_at) : "-";
        const title = doc.title || doc.file_name || "-";
        const reference = doc.reference_code || "-";
        const source = doc.source === "paste" ? "Paste" : "Upload";
        const size = docVaultFormatBytes(doc.file_size || 0);

        return `
          <tr>
            <td>${escapeHtml(uploadedAt)}</td>
            <td>${escapeHtml(docVaultPrettyCategory(doc.category))}</td>
            <td>${escapeHtml(title)}</td>
            <td>${escapeHtml(reference)}</td>
            <td>${escapeHtml(source)}</td>
            <td>${escapeHtml(size)}</td>
            <td>
              <div class="doc-action-row">
                <button class="btn btn-light small-btn" type="button" data-doc-action="view" data-doc-id="${doc.id}">View</button>
                ${canDelete ? `<button class="btn btn-danger small-btn" type="button" data-doc-action="delete" data-doc-id="${doc.id}">Delete</button>` : ""}
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    async function openCustomerDocument(docId) {
      const doc = documentVaultState.documents.find((item) => item.id === docId);
      if (!doc) return;

      try {
        const { data, error } = await supabaseClient.storage
          .from("customer-documents")
          .download(doc.storage_path);

        if (error || !data) {
          throw new Error(error?.message || "Could not open document.");
        }

        const blobUrl = URL.createObjectURL(data);
        window.open(blobUrl, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      } catch (error) {
        alert(error.message || "Could not open document.");
      }
    }

    async function deleteCustomerDocument(docId) {
      if (!canDeleteCustomerDocuments()) {
        alert("Only owner and admin can delete documents.");
        return;
      }

      const doc = documentVaultState.documents.find((item) => item.id === docId);
      if (!doc) return;

      const confirmed = confirm(`Delete this document?\n\n${doc.title || doc.file_name || "Untitled document"}`);
      if (!confirmed) return;

      try {
        const { data, error } = await supabaseClient.functions.invoke("customer-document-write", {
  body: {
    action: "delete_customer_document",
    document_id: doc.id
  }
});

if (error) {
  throw new Error(error.message || "Could not delete document.");
}

if (!data?.ok) {
  throw new Error(data?.error || "Could not delete document.");
}

await loadCustomerDocuments();
setDocumentVaultStatus("Document deleted successfully.", false);
      } catch (error) {
        setDocumentVaultStatus(error.message || "Could not delete document.", true);
      }
    }

    function docVaultPrettyCategory(value) {
      if (value === "invoice") return "Invoice";
      if (value === "payment_proof") return "Payment Proof";
      if (value === "cheque") return "Cheque";
      return "Other";
    }

    function docVaultTitleFromFile(fileName) {
      return String(fileName || "Document")
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]+/g, " ")
        .trim() || "Document";
    }

    function docVaultSafeFileName(fileName) {
      return AKY_DOCUMENT_UTILS.safeStorageFileName(fileName, "document.png");
    }

    function docVaultFormatBytes(bytes) {
      return AKY_DOCUMENT_UTILS.formatBytes(bytes);
    }

    function docVaultFormatDateTime(value) {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return "-";

      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }

    return {
      syncCustomer: syncDocumentVaultCustomer,
      loadDocuments: loadCustomerDocuments,
      clearDraft: clearDocumentVaultDraft,
      state: documentVaultState
    };
  }

  window.AKY_CUSTOMER_DOCUMENT_VAULT = Object.freeze({
    initCustomerDocumentVault
  });
})();
