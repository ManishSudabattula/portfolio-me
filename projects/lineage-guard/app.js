const changes = {
  rename: { base: 88, assets: 7, owners: 4, duration: "2.5h", title: "Rename orders.customer_id", impacts: [["executive_revenue_dashboard", "CRITICAL", "Join key becomes unavailable"], ["customer_360", "CRITICAL", "Identity model references original column"], ["churn_feature_view", "HIGH", "Feature transformation fails"], ["daily_orders", "HIGH", "dbt test expects customer_id"], ["support_case_enrichment", "MEDIUM", "Lookup loses customer mapping"], ["orders_quality_monitor", "MEDIUM", "Contract path changes"], ["ad_hoc_sales_model", "LOW", "Deprecated notebook reference"]], plan: ["Add customer_key as a nullable alias.", "Backfill and validate equality with customer_id.", "Update seven downstream references in dependency order.", "Run dual-column compatibility for one release cycle.", "Notify Analytics, ML, Finance, and Support owners.", "Remove customer_id only after zero-read verification."] },
  type: { base: 79, assets: 5, owners: 3, duration: "3h", title: "Change payments.amount to INTEGER", impacts: [["net_revenue_metric", "CRITICAL", "Decimal precision would be lost"], ["finance_close_model", "CRITICAL", "Contract requires NUMERIC(18,2)"], ["refund_anomaly_model", "HIGH", "Feature distribution shifts"], ["payment_reconciliation", "HIGH", "Rounding creates mismatches"], ["payment_export", "MEDIUM", "Consumer schema mismatch"]], plan: ["Reject direct narrowing conversion.", "Create amount_minor_units as INTEGER.", "Backfill with explicit currency scaling.", "Reconcile totals and distribution drift.", "Migrate consumers with versioned contracts.", "Retire amount only after finance approval."] },
  drop: { base: 84, assets: 6, owners: 4, duration: "4h", title: "Drop customers.region", impacts: [["regional_sales_dashboard", "CRITICAL", "Primary grouping dimension removed"], ["territory_quota_model", "CRITICAL", "Allocation rule loses region"], ["shipping_eta_feature", "HIGH", "Location proxy unavailable"], ["campaign_segmentation", "HIGH", "Audience rule references region"], ["customer_360", "MEDIUM", "Profile field disappears"], ["privacy_export", "LOW", "Export schema changes"]], plan: ["Confirm semantic replacement for region.", "Introduce canonical_geo_region from address model.", "Measure null and mapping rates by market.", "Migrate critical dashboards and quota logic first.", "Publish a deprecation event for two release cycles.", "Drop only after lineage reads reach zero."] },
  add: { base: 22, assets: 2, owners: 1, duration: "45m", title: "Add orders.risk_score", impacts: [["orders_schema_contract", "LOW", "Additive nullable field is compatible"], ["warehouse_cost_monitor", "LOW", "Minor storage increase"]], plan: ["Add risk_score as nullable FLOAT.", "Document scale, owner, and model version.", "Add range and null-rate quality checks.", "Backfill in bounded partitions.", "Expose only after monitoring stabilizes."] }
};

let environment = "production";
const $ = (selector) => document.querySelector(selector);
document.querySelectorAll(".environment").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".environment").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  environment = button.dataset.environment;
}));
$("#traffic").addEventListener("input", (event) => { $("#traffic-value").textContent = `${event.target.value}%`; });

function analyze() {
  const data = changes[$("#change").value];
  const traffic = Number($("#traffic").value);
  const windowType = $("#window").value;
  const envFactor = environment === "production" ? 1 : .68;
  const windowAdjustment = { now: 8, offpeak: -8, dual: -17 }[windowType];
  const risk = Math.max(5, Math.min(99, Math.round((data.base + traffic * .08 + windowAdjustment) * envFactor)));
  const blocked = risk >= 70;
  const caution = risk >= 40 && risk < 70;
  $("#risk").textContent = `${risk}/100`;
  $("#assets").textContent = data.assets;
  $("#owners").textContent = data.owners;
  $("#duration").textContent = data.duration;
  $("#decision").textContent = blocked ? "deployment blocked" : caution ? "approval required" : "compatible change";
  $("#decision").className = `pill ${blocked ? "status-fail" : caution ? "status-warn" : "status-pass"}`;
  $("#summary").textContent = blocked ? `${data.title} has a high downstream blast radius. A direct ${environment} deployment would violate one or more critical contracts. Use the migration plan before merging.` : caution ? `${data.title} is conditionally compatible, but owner approval and staged validation are required.` : `${data.title} is additive and backward compatible under the current contract policy.`;
  $("#impacts").innerHTML = data.impacts.map((impact) => `<div class="impact-row"><div class="panel-head"><p>${impact[0]}</p><span class="${impact[1] === "CRITICAL" ? "status-fail" : impact[1] === "HIGH" ? "status-warn" : impact[1] === "LOW" ? "status-pass" : ""}">${impact[1]}</span></div><p>${impact[2]}</p></div>`).join("");
  $("#plan").textContent = data.plan.map((step, index) => `${String(index + 1).padStart(2, "0")}  ${step}`).join("\n");
}

$("#analyze").addEventListener("click", analyze);
analyze();
