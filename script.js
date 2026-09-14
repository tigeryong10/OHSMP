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

const serverStatusPanel = document.querySelector("#server-status");
const serverStatusText = document.querySelector("#server-status-text");
const serverPlayerCount = document.querySelector("#server-player-count");
const serverPlayerLabel = document.querySelector("#server-player-label");
const serverPlayerCapacity = document.querySelector("#server-player-capacity");
const serverStatusEndpoint = "https://api.mcstatus.io/v2/status/java/play.ohsmp.com?query=false&timeout=5";

async function refreshServerStatus() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(serverStatusEndpoint, {
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) throw new Error(`Status request failed: ${response.status}`);

    const status = await response.json();
    if (!status.online) {
      serverStatusPanel.dataset.status = "offline";
      serverStatusText.textContent = "Server offline";
      serverPlayerCount.textContent = "0";
      serverPlayerLabel.textContent = "players online";
      serverPlayerCapacity.textContent = "Check back soon";
      return;
    }

    const onlinePlayers = Number(status.players?.online ?? 0);
    const maxPlayers = Number(status.players?.max ?? 0);
    serverStatusPanel.dataset.status = "online";
    serverStatusText.textContent = "Server online";
    serverPlayerCount.textContent = String(onlinePlayers);
    serverPlayerLabel.textContent = onlinePlayers === 1 ? "player online" : "players online";
    serverPlayerCapacity.textContent = maxPlayers > 0 ? `of ${maxPlayers} slots` : "Ready to join";
  } catch {
    serverStatusPanel.dataset.status = "unavailable";
    serverStatusText.textContent = "Status unavailable";
    serverPlayerCount.textContent = "—";
    serverPlayerLabel.textContent = "players online";
    serverPlayerCapacity.textContent = "Try again shortly";
  } finally {
    window.clearTimeout(timeout);
  }
}

refreshServerStatus();
window.setInterval(() => {
  if (document.visibilityState === "visible") refreshServerStatus();
}, 60000);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshServerStatus();
});
