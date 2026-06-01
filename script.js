(function () {
  const params = new URLSearchParams(window.location.search);
  const chapterId = params.get("id") || "ch01";

  const chapterTitle = document.getElementById("chapter-title");
  const tabsEl = document.getElementById("tabs");
  const container = document.getElementById("questions-container");

  let allSections = [];
  let activeType = null;

  fetch(`data/${chapterId}.json`)
    .then(r => {
      if (!r.ok) throw new Error("Not found");
      return r.json();
    })
    .then(data => {
      chapterTitle.textContent = `第${data.id.slice(2)}章 ${data.title}`;
      allSections = data.sections;

      if (allSections.length === 0) {
        container.innerHTML = '<div class="empty-state">本章暂无题目</div>';
        return;
      }

      // Render tab buttons
      allSections.forEach(s => {
        const btn = document.createElement("button");
        btn.className = "tab-btn";
        btn.textContent = `${s.type} (${s.questions.length})`;
        btn.dataset.type = s.type;
        btn.addEventListener("click", () => switchSection(s.type));
        tabsEl.appendChild(btn);
      });

      // Activate first non-empty section
      const first = allSections.find(s => s.questions.length > 0) || allSections[0];
      switchSection(first.type);
    })
    .catch(() => {
      chapterTitle.textContent = "章节未找到";
      container.innerHTML = '<div class="empty-state">请从首页选择有效章节</div>';
    });

  function switchSection(type) {
    activeType = type;

    // Update tabs
    document.querySelectorAll(".tab-btn").forEach(b => {
      b.classList.toggle("active", b.dataset.type === type);
    });

    const section = allSections.find(s => s.type === type);
    if (!section || section.questions.length === 0) {
      container.innerHTML = '<div class="empty-state">本章无此题型题目</div>';
      return;
    }

    container.innerHTML = "";
    section.questions.forEach(q => {
      const card = document.createElement("div");
      card.className = "question-card";

      const textDiv = document.createElement("div");
      textDiv.className = "question-text";
      textDiv.textContent = q.text;
      card.appendChild(textDiv);

      const btn = document.createElement("button");
      btn.className = "answer-btn";
      btn.textContent = "显示答案";
      btn.addEventListener("click", () => {
        const isRevealed = btn.classList.toggle("revealed");
        btn.textContent = isRevealed ? "隐藏答案" : "显示答案";
        ansEl.classList.toggle("visible", isRevealed);
      });
      card.appendChild(btn);

      const ansEl = document.createElement("div");
      ansEl.className = "answer-content";
      ansEl.textContent = q.answer || "（本题无答案）";
      card.appendChild(ansEl);

      container.appendChild(card);
    });
  }
})();
