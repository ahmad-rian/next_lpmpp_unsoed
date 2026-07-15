import { addToast } from "@heroui/toast";

/**
 * App-wide toast helpers. Use these instead of native alert() so every
 * create/update/delete/upload result is reported consistently (HeroUI toast,
 * top-right, theme-aware). For inline form validation use a HeroUI <Alert>,
 * not a toast.
 */

export function notifySuccess(description: string, title = "Berhasil") {
  return addToast({ title, description, color: "success" });
}

export function notifyError(description: string, title = "Gagal") {
  return addToast({ title, description, color: "danger" });
}

export function notifyWarning(description: string, title = "Perhatian") {
  return addToast({ title, description, color: "warning" });
}

export function notifyInfo(description: string, title = "Info") {
  return addToast({ title, description, color: "primary" });
}
