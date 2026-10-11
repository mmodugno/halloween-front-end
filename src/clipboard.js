// Copies text, falling back to the old execCommand for browsers (or
// non-https pages) without the clipboard API. Resolves to true on success.
export async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

// Opens the phone's share menu (WhatsApp, etc.) when there is one; otherwise
// copies the text. Resolves to "shared", "copied" or "failed".
export async function share(text) {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (e) {
      if (e.name === "AbortError") return "cancelled";
    }
  }
  return (await copy(text)) ? "copied" : "failed";
}
