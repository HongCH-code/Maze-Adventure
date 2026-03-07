/**
 * Creates an HTML <input> positioned over the Phaser canvas
 * to trigger the mobile keyboard. Uses the canvas bounding rect
 * and game scale to align correctly on any device.
 */
export function createMobileInput(
  scene: Phaser.Scene,
  gameX: number,
  gameY: number,
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

  // Convert game coordinates to screen coordinates
  const canvas = scene.game.canvas;
  const rect = canvas.getBoundingClientRect();
  const scaleX = rect.width / scene.cameras.main.width;
  const scaleY = rect.height / scene.cameras.main.height;
  const screenX = rect.left + gameX * scaleX;
  const screenY = rect.top + gameY * scaleY;
  const inputW = 280 * scaleX;
  const inputH = 44 * scaleY;

  Object.assign(input.style, {
    position: "fixed",
    left: `${screenX - inputW / 2}px`,
    top: `${screenY - inputH / 2}px`,
    width: `${inputW}px`,
    height: `${inputH}px`,
    fontSize: `${Math.round(22 * scaleY)}px`,
    textAlign: "center",
    background: "rgba(51,51,85,0.95)",
    color: "#ffffff",
    border: "2px solid #4a90d9",
    borderRadius: `${Math.round(8 * scaleX)}px`,
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
