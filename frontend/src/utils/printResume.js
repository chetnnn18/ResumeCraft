// Reliable resume printing — clones the resume doc into a clean print container
// so zoom transforms / drawers / hidden states never break the PDF output.
export function printResume() {
  // there may be more than one preview in the DOM (desktop + mobile drawer);
  // pick the one that is actually visible / rendered.
  const candidates = Array.from(document.querySelectorAll("#resume-doc, .resume-doc"));
  const source =
    candidates.find((el) => el.getClientRects().length > 0) || candidates[0];

  if (!source) {
    window.print();
    return;
  }

  // remove any previous print container
  const old = document.getElementById("print-root");
  if (old) old.remove();

  // build a fresh container with a clean clone (no transforms / scaling)
  const container = document.createElement("div");
  container.id = "print-root";

  const clone = source.cloneNode(true);
  clone.style.transform = "none";
  clone.style.width = "100%";
  clone.style.maxWidth = "100%";
  clone.style.aspectRatio = "auto";
  clone.style.boxShadow = "none";
  clone.style.border = "none";

  container.appendChild(clone);
  document.body.appendChild(container);
  document.body.classList.add("printing");

  const cleanup = () => {
    document.body.classList.remove("printing");
    const node = document.getElementById("print-root");
    if (node) node.remove();
    window.removeEventListener("afterprint", cleanup);
  };

  window.addEventListener("afterprint", cleanup);

  // give the browser a tick to paint the clone before printing
  setTimeout(() => {
    window.print();
    // safety cleanup in case afterprint doesn't fire (some browsers)
    setTimeout(cleanup, 1000);
  }, 100);
}
