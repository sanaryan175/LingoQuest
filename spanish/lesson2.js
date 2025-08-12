document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    { question: "What is 'One' in Spanish?", options: ["Uno", "Dos", "Tres", "Cuatro"], answer: "Uno", explanation: "'Uno' means One." },
    { question: "What is 'Three' in Spanish?", options: ["Tres", "Diez", "Ocho", "Cinco"], answer: "Tres", explanation: "'Tres' means Three." },
    { question: "Translate 'Five' into Spanish.", options: ["Seis", "Cinco", "Cuatro", "Siete"], answer: "Cinco", explanation: "'Cinco' means Five." },
    { question: "What is 'Diez' in English?", options: ["Six", "Nine", "Ten", "Four"], answer: "Ten", explanation: "'Diez' means Ten." },
    { question: "What is 'Siete'?", options: ["Seven", "Six", "Eight", "Nine"], answer: "Seven", explanation: "'Siete' means Seven." },
    { question: "How do you say 'Two' in Spanish?", options: ["Nueve", "Dos", "Ocho", "Tres"], answer: "Dos", explanation: "'Dos' means Two." }
  ];

  let xp = parseInt(localStorage.getItem("xpLesson2Spanish")) || 0;
  let currentQuestion = parseInt(localStorage.getItem("currentQuestionLesson2Spanish")) || 0;
  let lives = parseInt(localStorage.getItem("livesLesson2Spanish")) || 3;
  let quizPassed = localStorage.getItem("quizPassedLesson2Spanish") === "true";

  const questionElem = document.getElementById("question");
  const optionsElem = document.getElementById("options");
  const xpElem = document.getElementById("xp");
  const livesElem = document.getElementById("lives");
  const feedbackElem = document.getElementById("feedback");
  const xpBar = document.getElementById("xpBar");

  const gameContainer = document.getElementById("gameContainer");
  const gameOverPopup = document.getElementById("gameOverPopup");
  const victoryPopup = document.getElementById("victoryPopup");
  const passedPopup = document.getElementById("passedPopup");
  const popupFinalXP = document.getElementById("popupFinalXP");

  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  const loseSound = document.getElementById("loseSound");
  const victorySound = document.getElementById("victorySound");

  const skipBtn = document.getElementById("skipBtn");
  const checkBtn = document.getElementById("checkBtn");
  const continueBtn = document.getElementById("continueBtn");

  const svgContainer = document.getElementById("svgReactionContainer");

  let waiting = false;
  let selectedOption = null;
  let selectedBtn = null;

  const skipPenalty = false;

  if (quizPassed) {
    gameContainer.style.display = "none";
    passedPopup.style.display = "flex";
    return;
  }

  function updateXPBar() {
    const percent = Math.min((xp / (questions.length * 10)) * 100, 100);
    xpBar.style.width = `${percent}%`;
  }

  function showAnswerButtons() {
    skipBtn.style.display = "inline-block";
    checkBtn.style.display = "inline-block";
    continueBtn.style.display = "none";
  }

  function showContinueButton() {
    skipBtn.style.display = "none";
    checkBtn.style.display = "none";
    continueBtn.style.display = "inline-block";
  }

  function hideControlButtons() {
    skipBtn.style.display = "none";
    checkBtn.style.display = "none";
    continueBtn.style.display = "none";
  }

  function saveProgress() {
    localStorage.setItem("xpLesson2Spanish", xp);
    localStorage.setItem("currentQuestionLesson2Spanish", currentQuestion);
    localStorage.setItem("livesLesson2Spanish", lives);
  }

  function showSVGReaction(type) {
    if (!svgContainer) return;
    let svg = "";

    if (type === "wrong") {
      svg = `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#ff4d4f" stroke-width="5" fill="none"/>
        <line x1="35" y1="35" x2="65" y2="65" stroke="#ff4d4f" stroke-width="5"/>
        <line x1="65" y1="35" x2="35" y2="65" stroke="#ff4d4f" stroke-width="5"/>
      </svg>`;
    } else if (type === "victory") {
      svg = `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#00c853" stroke-width="5" fill="none"/>
        <polyline points="30,55 45,70 70,35" fill="none" stroke="#00c853" stroke-width="5"/>
      </svg>`;
    } else if (type === "gameover") {
      svg = `<svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#ff1744" stroke-width="5" fill="none"/>
        <path d="M35,40 Q50,60 65,40" fill="none" stroke="#ff1744" stroke-width="5"/>
      </svg>`;
    }

    svgContainer.innerHTML = svg;
    svgContainer.classList.add("show");
    setTimeout(() => {
      svgContainer.classList.remove("show");
      svgContainer.innerHTML = "";
    }, 1200);
  }

  function checkAnswer(selected, btn) {
    if (waiting) return;
    waiting = true;

    const current = questions[currentQuestion];
    const buttons = document.querySelectorAll(".options button");

    buttons.forEach(button => {
      button.disabled = true;
      button.classList.remove("selected");
      if (button.innerText === current.answer) {
        button.classList.add("correct");
      } else if (button === btn) {
        button.classList.add("wrong");
      }
    });

    if (selected === current.answer) {
      xp += 10;
      feedbackElem.innerText = "✅ Correct!";
      btn.classList.add("bounce");
      correctSound?.cloneNode(true).play();
    } else {
      lives -= 1;
      feedbackElem.innerText = `❌ Wrong! ${current.explanation}`;
      wrongSound?.cloneNode(true).play();
      showSVGReaction("wrong");
    }

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    saveProgress();

    if (lives <= 0) {
      hideControlButtons();
      loseSound?.cloneNode(true).play();
      showSVGReaction("gameover");
      setTimeout(() => gameOverPopup.style.display = "flex", 800);
    } else if (currentQuestion === questions.length - 1) {
      hideControlButtons();
      localStorage.setItem("quizPassedLesson2Spanish", "true");
      setTimeout(() => {
        popupFinalXP.innerText = xp;
        victoryPopup.style.display = "flex";
        confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
        victorySound?.cloneNode(true).play();
        showSVGReaction("victory");
      }, 800);
    } else {
      showContinueButton();
    }
  }

  function loadQuestion() {
    if (currentQuestion >= questions.length) return;

    waiting = false;
    selectedOption = null;
    selectedBtn = null;

    const current = questions[currentQuestion];
    questionElem.innerText = current.question;
    optionsElem.innerHTML = "";
    feedbackElem.innerText = "";

    current.options.forEach(opt => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.classList.remove("selected", "correct", "wrong");
      btn.onclick = () => {
        selectedOption = opt;
        selectedBtn = btn;
        document.querySelectorAll(".options button").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
      };
      optionsElem.appendChild(btn);
    });

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    showAnswerButtons();
    saveProgress();
  }

  skipBtn.addEventListener("click", () => {
    if (skipPenalty) {
      lives -= 1;
      if (lives <= 0) {
        saveProgress();
        hideControlButtons();
        loseSound?.cloneNode(true).play();
        showSVGReaction("gameover");
        return setTimeout(() => gameOverPopup.style.display = "flex", 800);
      }
    }

    currentQuestion++;
    if (currentQuestion >= questions.length) {
      hideControlButtons();
      localStorage.setItem("quizPassedLesson2Spanish", "true");
      popupFinalXP.innerText = xp;
      victoryPopup.style.display = "flex";
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
      victorySound?.cloneNode(true).play();
      showSVGReaction("victory");
    } else {
      loadQuestion();
    }
  });

  checkBtn.addEventListener("click", () => {
    if (!selectedOption) {
      alert("Please select an option first!");
      return;
    }
    checkAnswer(selectedOption, selectedBtn);
  });

  continueBtn.addEventListener("click", () => {
    currentQuestion++;
    loadQuestion();
  });

  loadQuestion();
});

// Global controls
function restartLessonSpanish() {
  localStorage.removeItem("xpLesson2Spanish");
  localStorage.removeItem("currentQuestionLesson2Spanish");
  localStorage.removeItem("livesLesson2Spanish");
  localStorage.removeItem("quizPassedLesson2Spanish");
  location.reload();
}

function goToNextLessonSpanish() {
  window.location.href = "lesson3_article.html"; // Adjust if needed
}

function returnToCourseListSpanish() {
  window.location.href = "index.html";
}

function restartQuizSpanish() {
  restartLessonSpanish();
}
