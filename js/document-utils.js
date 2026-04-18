(function () {
  "use strict";

  const IMAGE_UPLOAD_MAX_BYTES = 6 * 1024 * 1024;
  const IMAGE_UPLOAD_MAX_LABEL = "6MB";

  function validateImageFile(file, maxBytes = IMAGE_UPLOAD_MAX_BYTES) {
    if (!file || typeof file !== "object") {
      throw new Error("Please choose an image file.");
    }

    if (!file.type || !String(file.type).startsWith("image/")) {
      throw new Error("Please upload an image file only.");
    }

    if (Number(file.size || 0) > maxBytes) {
      throw new Error(`Please keep the image under ${IMAGE_UPLOAD_MAX_LABEL}.`);
    }

    return file;
  }

  function applyPreviewFile(state, options) {
    const { file, previewWrap, previewImg, source = "upload" } = options || {};

    validateImageFile(file);

    if (state?.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);

    if (state) {
      state.file = file;
      state.source = source;
      state.previewUrl = previewUrl;
    }

    if (previewImg) {
      previewImg.src = previewUrl;
    }

    if (previewWrap) {
      previewWrap.classList.remove("hidden");
    }

    return previewUrl;
  }

  function resetPreviewState(state, options) {
    const {
      fileInput,
      previewWrap,
      previewImg,
      source = "upload",
      onReset
    } = options || {};

    if (state?.previewUrl) {
      URL.revokeObjectURL(state.previewUrl);
    }

    if (state) {
      state.file = null;
      state.source = source;
      state.previewUrl = "";
    }

    if (fileInput) {
      fileInput.value = "";
    }

    if (previewImg) {
      previewImg.src = "";
    }

    if (previewWrap) {
      previewWrap.classList.add("hidden");
    }

    if (typeof onReset === "function") {
      onReset();
    }
  }

  function safeStorageFileName(fileName, fallbackFileName) {
    const cleaned = String(fileName || fallbackFileName || "document.png")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    return cleaned || fallbackFileName || `document-${Date.now()}.png`;
  }

  function setStatusMessage(statusNode, message, isError) {
    if (!statusNode) return;

    statusNode.textContent = String(message || "");
    statusNode.classList.toggle("doc-status-error", !!isError);
    statusNode.classList.toggle("doc-status-success", !isError);
  }

  function formatBytes(bytes) {
    const value = Number(bytes || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  }

  async function fileToBase64(file) {
    validateImageFile(file);

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = String(reader.result || "");
        const commaIndex = result.indexOf(",");
        if (commaIndex === -1) {
          reject(new Error("Could not convert file to base64."));
          return;
        }
        resolve(result.slice(commaIndex + 1));
      };

      reader.onerror = () => {
        reject(new Error("Could not convert file to base64."));
      };

      reader.readAsDataURL(file);
    });
  }

  function base64ToUint8Array(base64) {
    const normalized = String(base64 || "").trim();
    if (!normalized) {
      throw new Error("Missing file content.");
    }

    const binary = atob(normalized);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  }

  function buildCustomerDocumentStoragePath(options) {
    const {
      customerId,
      category,
      linkedId,
      fileName
    } = options || {};

    const safeName = safeStorageFileName(fileName, "document.png");
    const safeCustomerId = String(customerId || "unknown-customer");
    const safeCategory = String(category || "other").trim() || "other";
    const safeLinkedId = linkedId ? String(linkedId).trim() : "";
    const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

    const parts = ["customers", safeCustomerId, safeCategory];
    if (safeLinkedId) {
      parts.push(safeLinkedId);
    }
    parts.push(`${stamp}-${safeName}`);

    return parts.join("/");
  }

  function buildCustomerDocumentInsertPayload(payload, storagePath) {
  const action = String(payload?.action || "");
  const customerId = payload?.customer_id || null;
  const fileName = payload?.file_name || "document.png";
  const mimeType = payload?.mime_type || "image/png";
  const fileSize = Number(payload?.file_size || 0);
  const source = payload?.source || "upload";
  const notes = payload?.notes || null;
  const uploadedBy = payload?.uploaded_by || null;

  if (!customerId) {
    throw new Error("Missing customer_id.");
  }

  if (!storagePath) {
    throw new Error("Missing storage path.");
  }

  if (!uploadedBy) {
    throw new Error("Missing uploaded_by.");
  }

  let originScreen = String(payload?.origin_screen || "").trim();
  if (!originScreen) {
    if (action === "create_invoice_document") {
      originScreen = "invoice_modal";
    } else if (action === "create_payment_document") {
      originScreen = "payment_modal";
    } else {
      originScreen = "customer_vault";
    }
  }

  if (!["customer_vault", "invoice_modal", "payment_modal"].includes(originScreen)) {
    throw new Error("Invalid origin_screen.");
  }

  const basePayload = {
    customer_id: customerId,
    notes,
    source,
    file_name: fileName,
    mime_type: mimeType,
    file_size: fileSize,
    storage_path: storagePath,
    uploaded_by: uploadedBy,
    origin_screen: originScreen
  };

  if (action === "create_invoice_document") {
    return {
      ...basePayload,
      invoice_id: payload.invoice_id || null,
      category: "invoice",
      title: payload.invoice_number || fileName,
      reference_code: payload.invoice_number || null
    };
  }

  if (action === "create_payment_document") {
    return {
      ...basePayload,
      payment_id: payload.payment_id || null,
      category: "payment_proof",
      title: payload.payment_title || fileName,
      reference_code: payload.payment_reference_code || null
    };
  }

  if (action === "create_customer_document") {
    return {
      ...basePayload,
      category: payload.category || "other",
      title: payload.title || fileName,
      reference_code: payload.reference_code || null
    };
  }

  throw new Error("Unsupported customer document action.");
}

  async function writeCustomerDocumentDirect(options) {
    const {
      supabaseClient,
      payload
    } = options || {};

    if (!supabaseClient) {
      throw new Error("Supabase client is unavailable.");
    }

    const action = String(payload?.action || "");

    if (action === "delete_customer_document") {
      const { data: existingDoc, error: fetchError } = await supabaseClient
        .from("customer_documents")
        .select("id, storage_path")
        .eq("id", payload.document_id)
        .maybeSingle();

      if (fetchError) {
        throw new Error(fetchError.message || "Could not find document.");
      }

      if (!existingDoc?.id) {
        throw new Error("Document not found.");
      }

      if (existingDoc.storage_path) {
        const { error: storageError } = await supabaseClient.storage
          .from("customer-documents")
          .remove([existingDoc.storage_path]);

        if (storageError) {
          console.warn("[AKY] customer document storage remove warning:", storageError);
        }
      }

      const { error: deleteError } = await supabaseClient
        .from("customer_documents")
        .delete()
        .eq("id", existingDoc.id);

      if (deleteError) {
        throw new Error(deleteError.message || "Could not delete document.");
      }

      return {
        ok: true,
        document_id: existingDoc.id
      };
    }

    const fileBytes = base64ToUint8Array(payload?.file_base64);
    const storageCategory =
      action === "create_invoice_document"
        ? "invoice"
        : action === "create_payment_document"
          ? "payment_proof"
          : (payload?.category || "other");

    const linkedId = payload?.invoice_id || payload?.payment_id || null;
    const storagePath = buildCustomerDocumentStoragePath({
      customerId: payload?.customer_id,
      category: storageCategory,
      linkedId,
      fileName: payload?.file_name
    });

    const { error: uploadError } = await supabaseClient.storage
      .from("customer-documents")
      .upload(storagePath, fileBytes, {
        contentType: payload?.mime_type || "image/png",
        upsert: false
      });

    if (uploadError) {
      throw new Error(uploadError.message || "Could not upload document.");
    }

    const insertPayload = buildCustomerDocumentInsertPayload(payload, storagePath);

    const { data: insertedDoc, error: insertError } = await supabaseClient
      .from("customer_documents")
      .insert(insertPayload)
      .select("id")
      .single();

    if (insertError) {
      await supabaseClient.storage
        .from("customer-documents")
        .remove([storagePath]);

      throw new Error(insertError.message || "Could not save document record.");
    }

    return {
      ok: true,
      document_id: insertedDoc.id
    };
  }

  window.AKY_DOCUMENT_UTILS = Object.freeze({
    IMAGE_UPLOAD_MAX_BYTES,
    IMAGE_UPLOAD_MAX_LABEL,
    validateImageFile,
    applyPreviewFile,
    resetPreviewState,
    safeStorageFileName,
    setStatusMessage,
    formatBytes,
    fileToBase64,
    writeCustomerDocumentDirect
  });
})();
