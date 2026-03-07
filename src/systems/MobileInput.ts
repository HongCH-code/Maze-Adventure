/**
 * Creates a hidden HTML <input> to trigger the mobile keyboard.
 * Syncs typed text back via onChange callback.
 */
export function createMobileInput(
  onChange: (value: string) => void,
  onSubmit: () => void,
  maxLength = 8
): HTMLInputElement {
  const input = document.createElement("input");
  input.type = "text";
  input.maxLength = maxLength;
  input.autocomplete = "off";
  input.autocapitalize = "off";
  input.spellcheck = false;

  // Position over the canvas but make it visually transparent
  Object.assign(input.style, {
    position: "fixed",
    left: "50%",
    top: "40%",
    transform: "translate(-50%, -50%)",
    width: "280px",
    height: "44px",
    fontSize: "24px",
    textAlign: "center",
    background: "rgba(51,51,85,0.95)",
    color: "#ffffff",
    border: "2px solid #4a90d9",
    borderRadius: "8px",
    outline: "none",
    zIndex: "9999",
    fontFamily: "Arial, sans-serif",
    caretColor: "#ffffff",
  });

  document.body.appendChild(input);

  input.addEventListener("input", () => {
    onChange(input.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  });

  // Focus to trigger keyboard on mobile
  setTimeout(() => input.focus(), 50);

  return input;
}

export function removeMobileInput(input: HTMLInputElement | null): void {
  if (input && input.parentNode) {
    input.parentNode.removeChild(input);
  }
}
