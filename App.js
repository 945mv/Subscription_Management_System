const storageKey = "subsPilotSubscriptions";
const defaultSubscriptions = [
  {
    id: 1,
    name: "Netflix",
    amount: 15.99,
    interval: "Monthly",
    renewal: "2026-07-15",
    category: "Entertainment"
  },
  {
    id: 2,
    name: "Adobe Creative Cloud",
    amount: 59.99,
    interval: "Monthly",
    renewal: "2026-07-22",
    category: "Work"
  },
  {
    id: 3,
    name: "Spotify",
    amount: 10.99,
    interval: "Monthly",
    renewal: "2026-08-01",
    category: "Music"
  }
];

let subscriptions = JSON.parse(localStorage.getItem(storageKey)) || defaultSubscriptions;

const form = document.getElementById("subscriptionForm");
const list = document.getElementById("subscriptionList");
const activeCount = document.getElementById("activeCount");
const monthlySpend = document.getElementById("monthlySpend");
const nextRenewal = document.getElementById("nextRenewal");
const serviceCount = document.getElementById("serviceCount");
const yearlySpend = document.getElementById("yearlySpend");
const renewalCount = document.getElementById("renewalCount");

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function renderSubscriptions() {
  if (!subscriptions.length) {
    list.innerHTML = '<div class="small">No subscriptions yet. Add your first one.</div>';
    return;
  }

  list.innerHTML = subscriptions
    .map((item) => {
      const monthlyAmount = item.interval === "Yearly" ? item.amount / 12 : item.amount;
      return `
        <div class="subscription-item">
          <div>
            <strong>${item.name}</strong>
            <div class="meta">${item.category} • ${item.interval} • Renewal ${item.renewal}</div>
          </div>
          <div style="text-align:right;">
            <div><strong>${formatCurrency(monthlyAmount)}</strong></div>
            <div class="meta">${item.amount > 0 ? formatCurrency(item.amount) : "Free"}</div>
            <button class="delete-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateSummary() {
  const totalMonthly = subscriptions.reduce((sum, item) => {
    return sum + (item.interval === "Yearly" ? item.amount / 12 : item.amount);
  }, 0);

  const yearly = totalMonthly * 12;
  const next = [...subscriptions].sort((a, b) => a.renewal.localeCompare(b.renewal))[0];
  const soon = subscriptions.filter((item) => item.renewal <= new Date().toISOString().slice(0, 10)).length;

  activeCount.textContent = subscriptions.length;
  monthlySpend.textContent = formatCurrency(totalMonthly);
  nextRenewal.textContent = next ? next.name : "No data";
  serviceCount.textContent = subscriptions.length;
  yearlySpend.textContent = formatCurrency(yearly);
  renewalCount.textContent = soon;
}

function saveSubscriptions() {
  localStorage.setItem(storageKey, JSON.stringify(subscriptions));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const newSubscription = {
    id: Date.now(),
    name: document.getElementById("name").value.trim(),
    amount: Number(document.getElementById("amount").value),
    interval: document.getElementById("interval").value,
    renewal: document.getElementById("renewal").value,
    category: document.getElementById("category").value.trim()
  };

  subscriptions.unshift(newSubscription);
  saveSubscriptions();
  renderSubscriptions();
  updateSummary();
  form.reset();
});

list.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-btn")) {
    const id = Number(event.target.dataset.id);
    subscriptions = subscriptions.filter((item) => item.id !== id);
    saveSubscriptions();
    renderSubscriptions();
    updateSummary();
  }
});

// Initial load
renderSubscriptions();
updateSummary();