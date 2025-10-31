/* Basic client-side app shell */
(async function(){
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const els = {
    btnRandom: document.getElementById("btn-random"),
    next: document.getElementById("next-problem"),
    topic: document.getElementById("problem-topic"),
    diff: document.getElementById("problem-difficulty"),
    stem: document.getElementById("problem-stem"),
    choices: document.getElementById("problem-choices"),
    showAnswer: document.getElementById("show-answer"),
    showSolution: document.getElementById("show-solution"),
    answer: document.getElementById("answer"),
    solution: document.getElementById("solution"),
    topicFilter: document.getElementById("topic-filter"),
    diffFilter: document.getElementById("difficulty-filter"),
  };

  let problems = [];
  try {
    const res = await fetch("data/problems.json");
    problems = await res.json();
  } catch(e){
    console.warn("Could not load problems.json", e);
  }

  // Populate topic filter
  const topics = Array.from(new Set(problems.map(p => p.topic))).sort();
  topics.forEach(t => {
    const opt = document.createElement("option");
    opt.value = t; opt.textContent = t;
    els.topicFilter.appendChild(opt);
  });

  function stars(d){ return "★ ".repeat(d).trim(); }
  function pickProblem(){
    const filterTopic = els.topicFilter.value;
    const filterDiff = Number(els.diffFilter.value);
    const pool = problems.filter(p => (filterTopic==="all"||p.topic===filterTopic) && p.difficulty<=filterDiff+1 && p.difficulty>=filterDiff-1);
    if (pool.length===0) return null;
    return pool[Math.floor(Math.random()*pool.length)];
  }

  function renderProblem(p){
    els.answer.classList.add("hidden");
    els.solution.classList.add("hidden");
    els.answer.textContent = "";
    els.solution.textContent = "";

    if (!p){
      els.topic.textContent = "Topic";
      els.diff.textContent = "★ ★ ★";
      els.stem.textContent = "No problems match this filter. Try widening your range.";
      els.choices.innerHTML = "";
      return;
    }
    els.topic.textContent = p.topic;
    els.diff.textContent = stars(p.difficulty);
    els.stem.textContent = p.stem;
    els.choices.innerHTML = "";
    (p.choices||[]).forEach((c,i)=>{
      const li = document.createElement("li");
      li.textContent = c;
      els.choices.appendChild(li);
    });
    els.answer.textContent = "Answer: " + (p.answer ?? "—");
    els.solution.textContent = p.solution || "Solution not provided yet.";
  }

  let current = null;
  function next(){
    current = pickProblem();
    renderProblem(current);
  }

  els.btnRandom?.addEventListener("click", next);
  els.next?.addEventListener("click", next);
  els.showAnswer?.addEventListener("click", ()=>els.answer.classList.toggle("hidden"));
  els.showSolution?.addEventListener("click", ()=>els.solution.classList.toggle("hidden"));

  // First paint
  renderProblem(null);
})();