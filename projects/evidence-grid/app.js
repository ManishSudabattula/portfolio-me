const scenarios = {
  policy: {
    questions: "What controls should a team use before releasing a high-impact generative AI assistant?",
    answer: "Before release, the team should document intended use and risk tolerance, test for confabulation and harmful output, require claim-level evidence for high-impact answers, monitor production traces, and define human escalation paths. A reviewed failure dataset should drive repeated evaluation after prompt, model, or retrieval changes.",
    claims: [
      ["Document intended use and risk tolerance.", 0.98, "NIST AI 600-1"],
      ["Test for confabulation and harmful output before release.", 0.94, "NIST AI 600-1"],
      ["Require claim-level evidence for high-impact answers.", 0.86, "RAGAS + release policy"],
      ["Monitor production traces and define escalation paths.", 0.91, "NIST AI 600-1"],
      ["Re-evaluate after prompt, model, or retrieval changes.", 0.88, "Evaluation lifecycle design"]
    ],
    sources: [["NIST AI 600-1: Measure 2.5", .96], ["NIST AI 600-1: confabulation risk", .93], ["RAGAS evaluation dimensions", .89], ["AI RMF lifecycle controls", .82], ["Internal release policy", .74], ["Generic model card", .55], ["Unreviewed forum note", .31], ["Vendor overview", .27]]
  },
  incident: {
    questions: "What should happen when a critical revenue table fails freshness checks?",
    answer: "The pipeline should stop downstream publication, identify affected assets through lineage, notify the owning team with the failed contract and last healthy timestamp, and serve the last verified snapshot where policy permits. Recovery should include root-cause evidence and a replay validation before the incident is closed.",
    claims: [["Stop downstream publication.", .96, "Critical data runbook"], ["Use lineage to identify affected assets.", .93, "OpenLineage operating model"], ["Notify owners with contract evidence.", .91, "Incident policy"], ["Serve a verified snapshot only when policy permits.", .79, "Continuity policy"], ["Validate replay before closure.", .88, "Recovery checklist"]],
    sources: [["Critical table incident runbook", .97], ["Revenue data contract", .94], ["Column lineage snapshot", .91], ["On-call ownership registry", .87], ["Recovery validation checklist", .82], ["Historical incident note", .61], ["Generic ETL guide", .35], ["Chat transcript", .22]]
  },
  energy: {
    questions: "How can flexible AI workloads reduce electricity impact without missing deadlines?",
    answer: "Teams can classify training, evaluation, and batch inference by deadline flexibility, forecast hourly grid carbon and price, and schedule movable jobs into cleaner windows. The scheduler should preserve hard deadlines, report emissions and cost deltas against a baseline, and avoid shifting work when forecast confidence is low.",
    claims: [["Classify workloads by deadline flexibility.", .90, "Scheduling design"], ["Use hourly grid carbon and price forecasts.", .92, "Energy data model"], ["Move flexible jobs into cleaner windows.", .95, "Carbon-aware scheduling"], ["Preserve deadlines and compare with a baseline.", .91, "Optimization policy"], ["Avoid shifts under low forecast confidence.", .77, "Safety constraint"]],
    sources: [["IEA Energy and AI demand outlook", .96], ["Hourly grid intensity dataset", .93], ["Workload deadline registry", .90], ["Cloud price schedule", .85], ["Forecast confidence policy", .73], ["Annual sustainability report", .58], ["General energy article", .33], ["Marketing estimate", .24]]
  }
};

let strategy = "hybrid";
const $ = (selector) => document.querySelector(selector);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

document.querySelectorAll(".strategy").forEach((button) => button.addEventListener("click", () => {
  document.querySelectorAll(".strategy").forEach((item) => item.classList.remove("active"));
  button.classList.add("active");
  strategy = button.dataset.strategy;
}));

$("#scenario").addEventListener("change", (event) => { $("#question").value = scenarios[event.target.value].questions; });
$("#top-k").addEventListener("input", (event) => { $("#top-k-value").textContent = event.target.value; });
$("#strictness").addEventListener("input", (event) => { $("#strictness-value").textContent = `${event.target.value}%`; });

function runEvaluation() {
  const data = scenarios[$("#scenario").value];
  const topK = Number($("#top-k").value);
  const strictness = Number($("#strictness").value) / 100;
  const strategyBoost = { hybrid: .06, vector: .02, keyword: -.03 }[strategy];
  const selectedSources = data.sources.slice(0, topK);
  const relevance = clamp(selectedSources.reduce((sum, item) => sum + item[1], 0) / selectedSources.length + strategyBoost - Math.max(0, topK - 5) * .018, 0, 1);
  const adjustedClaims = data.claims.map((claim, index) => [claim[0], clamp(claim[1] + strategyBoost - Math.max(0, index + 2 - topK) * .055, 0, 1), claim[2]]);
  const faithfulness = adjustedClaims.reduce((sum, claim) => sum + claim[1], 0) / adjustedClaims.length;
  const latency = Math.round(410 + topK * 88 + (strategy === "hybrid" ? 170 : strategy === "vector" ? 90 : 35));
  const cost = (1.45 + topK * .31 + (strategy === "hybrid" ? .52 : .18)).toFixed(2);
  const pass = faithfulness >= strictness && relevance >= strictness - .08;

  $("#faithfulness").textContent = `${Math.round(faithfulness * 100)}%`;
  $("#relevance").textContent = `${Math.round(relevance * 100)}%`;
  $("#latency").textContent = `${latency}ms`;
  $("#cost").textContent = `$${cost}`;
  $("#answer").textContent = data.answer;
  $("#release-status").textContent = pass ? "release gate passed" : "review required";
  $("#release-status").className = `pill ${pass ? "status-pass" : "status-warn"}`;
  $("#claim-summary").textContent = `${adjustedClaims.filter((claim) => claim[1] >= strictness).length}/${adjustedClaims.length} supported`;

  $("#claims").innerHTML = adjustedClaims.map((claim) => {
    const supported = claim[1] >= strictness;
    return `<div class="claim-row"><div><p>${claim[0]}</p><small>${claim[2]}</small></div><span class="${supported ? "status-pass" : "status-warn"}">${supported ? "SUPPORTED" : "REVIEW"} ${Math.round(claim[1] * 100)}%</span></div>`;
  }).join("");
  $("#sources").innerHTML = selectedSources.map((source, index) => `<div class="source-row"><span class="source-rank">0${index + 1}</span><div>${source[0]}<div class="bar"><i style="--value:${Math.round(source[1] * 100)}%"></i></div></div><span>${Math.round(source[1] * 100)}%</span></div>`).join("");
}

$("#run").addEventListener("click", runEvaluation);
runEvaluation();
