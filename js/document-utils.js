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
  window.AKY_DOCUMENT_UTILS = Object.freeze({
  IMAGE_UPLOAD_MAX_BYTES,
  IMAGE_UPLOAD_MAX_LABEL,
  validateImageFile,
  applyPreviewFile,
  resetPreviewState,
  safeStorageFileName,
  setStatusMessage,
  formatBytes,
  fileToBase64
});
})();
