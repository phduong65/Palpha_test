export function extractData(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

export function formatToApiDateTime(value) {
  if (!value) {
    return "";
  }

  const normalized = value.trim().replace("T", " ");
  return normalized.length === 16 ? `${normalized}:00` : normalized;
}

export function formatDisplayDateTime(value) {
  if (!value) {
    return "";
  }

  const parsed = new Date(value.replace(" ", "T"));
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString("vi-VN");
}

export function getErrorMessage(error, fallback = "Yêu cầu thất bại") {
  const errors = error?.response?.data?.errors;

  if (errors && typeof errors === "object") {
    const firstField = Object.values(errors)[0];
    if (Array.isArray(firstField) && firstField.length > 0) {
      return firstField[0];
    }
  }

  return error?.response?.data?.message || error?.message || fallback;
}
