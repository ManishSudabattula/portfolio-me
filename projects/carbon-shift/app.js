const signal = [
  { hour: "Now", carbon: 486, price: 92, confidence: 96 }, { hour: "+1h", carbon: 472, price: 88, confidence: 95 },
  { hour: "+2h", carbon: 451, price: 83, confidence: 94 }, { hour: "+3h", carbon: 422, price: 78, confidence: 93 },
  { hour: "+4h", carbon: 390, price: 72, confidence: 92 }, { hour: "+5h", carbon: 344, price: 68, confidence: 91 },
  { hour: "+6h", carbon: 301, price: 61, confidence: 90 }, { hour: "+7h", carbon: 268, price: 57, confidence: 89 },
  { hour: "+8h", carbon: 231, price: 52, confidence: 88 }, { hour: "+9h", carbon: 205, price: 49, confidence: 86 },
  { hour: "+10h", carbon: 194, price: 47, confidence: 84 }, { hour: "+11h", carbon: 188, price: 46, confidence: 82 },
  { hour: "+12h", carbon: 202, price: 48, confidence: 80 }, { hour: "+13h", carbon: 226, price: 54, confidence: 78 },
  { hour: "+14h", carbon: 259, price: 62, confidence: 76 }, { hour: "+15h", carbon: 305, price: 71, confidence: 74 },
  { hour: "+16h", carbon: 363, price: 84, confidence: 72 }, { hour: "+17h", carbon: 421, price: 96, confidence: 70 },
  { hour: "+18h", carbon: 468, price: 100, confidence: 68 }, { hour: "+19h", carbon: 492, price: 98, confidence: 66 },
  { hour: "+20h", carbon: 477, price: 91, confidence: 64 }, { hour: "+21h", carbon: 443, price: 83, confidence: 62 },
  { hour: "+22h", carbon: 408, price: 77, confidence: 60 }, { hour: "+23h", carbon: 382, price: 73, confidence: 58 }
];

const workloads = { eval: { power: 2.4, name: "RAG evaluation batch" }, inference: { power: 4.2, name: "Document inference queue" }, finetune: { power: 7.8, name: "Small-model fine-tune" } };
const $ = (selector) => document.querySelector(selector);
[["duration", "duration-value", "h"], ["carbon", "carbon-value", "%"], ["cost", "cost-value", "%"]].forEach(([input, output, suffix]) => $("#" + input).addEventListener("input", (event) => { $("#" + output).textContent = `${event.target.value}${suffix}`; }));

function average(items, key) { return items.reduce((sum, item) => sum + item[key], 0) / items.length; }

function optimize() {
  const duration = Number($("#duration").value);
  const deadline = Number($("#deadline").value);
  const carbonWeight = Number($("#carbon").value) / 100;
  const costWeight = Number($("#cost").value) / 100;
  const confidenceWeight = Math.max(0.1, 1 - Math.min(.9, carbonWeight + costWeight));
  const maxStart = Math.max(0, deadline - duration);
  const candidates = [];

  for (let start = 0; start <= maxStart; start += 1) {
    const window = signal.slice(start, start + duration);
    const carbon = average(window, "carbon");
    const price = average(window, "price");
    const confidence = average(window, "confidence");
    const score = carbonWeight * (carbon / 500) + costWeight * (price / 100) + confidenceWeight * (1 - confidence / 100);
    candidates.push({ start, window, carbon, price, confidence, score });
  }

  candidates.sort((a, b) => a.score - b.score);
  const best = candidates[0];
  const baselineWindow = signal.slice(0, duration);
  const baselineCarbon = average(baselineWindow, "carbon");
  const baselinePrice = average(baselineWindow, "price");
  const carbonReduction = Math.round((1 - best.carbon / baselineCarbon) * 100);
  const costReduction = Math.round((1 - best.price / baselinePrice) * 100);
  const buffer = deadline - (best.start + duration);
  const workload = workloads[$("#workload").value];
  const energy = workload.power * duration;
  const emissions = energy * best.carbon / 1000;

  $("#co2-reduction").textContent = `${carbonReduction}%`;
  $("#cost-reduction").textContent = `${costReduction}%`;
  $("#start").textContent = best.start === 0 ? "Now" : `+${best.start}h`;
  $("#buffer").textContent = `${buffer}h`;
  $("#plan-status").textContent = "deadline protected";
  $("#plan-status").className = "pill status-pass";
  $("#schedule").innerHTML = `<div class="schedule-row"><div class="panel-head"><p>${workload.name}</p><span class="status-pass">SCHEDULED</span></div><p>Start ${best.start === 0 ? "now" : `in ${best.start} hours`} | Run ${duration}h | Energy ${energy.toFixed(1)} kWh | Estimated emissions ${emissions.toFixed(1)} kgCO2e</p></div>`;
  $("#explanation").textContent = `The selected window has average carbon intensity of ${Math.round(best.carbon)} gCO2/kWh and price index ${Math.round(best.price)}. It reduces modeled emissions by ${carbonReduction}% and cost by ${costReduction}% versus running immediately, while retaining a ${buffer}-hour deadline buffer. Forecast confidence across the window is ${Math.round(best.confidence)}%.`;

  const selected = new Set(best.window.map((item) => item.hour));
  $("#forecast").innerHTML = signal.slice(0, deadline).map((item) => `<tr><td>${item.hour}</td><td>${item.carbon}</td><td>${item.price}</td><td>${item.confidence}%</td><td class="${selected.has(item.hour) ? "status-pass" : ""}">${selected.has(item.hour) ? "RUN" : "hold"}</td></tr>`).join("");
}

$("#optimize").addEventListener("click", optimize);
optimize();
