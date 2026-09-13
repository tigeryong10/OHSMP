const copyButtons = document.querySelectorAll("[data-copy]");
const toast = document.querySelector(".toast");
let toastTimer;

copyButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("input");
      input.value = value;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    const label = button.querySelector(".copy-label");
    if (label) {
      const original = label.textContent;
      label.textContent = "Copied!";
      window.setTimeout(() => { label.textContent = original; }, 1400);
    }

    window.clearTimeout(toastTimer);
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 1800);
  });
});

const searchInput = document.querySelector("#mod-search");
const modCards = [...document.querySelectorAll(".mod-card")];
const count = document.querySelector("#mod-count");
const emptyState = document.querySelector("#empty-state");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;

  modCards.forEach((card) => {
    const matches = card.textContent.toLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });

  count.textContent = visible;
  emptyState.hidden = visible !== 0;
});
