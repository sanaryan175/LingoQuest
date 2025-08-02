document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    { question: "What is 'Hello' in German?", options: ["Hallo", "Tschüss", "Bitte", "Danke"], answer: "Hallo", explanation: "'Hallo' means Hello in German." },
    { question: "How do you say 'Thank you'?", options: ["Bitte", "Hallo", "Danke", "Nein"], answer: "Danke", explanation: "'Danke' means Thank you in German." },
    { question: "What is 'Bye' in German?", options: ["Guten Morgen", "Tschüss", "Ja", "Willkommen"], answer: "Tschüss", explanation: "'Tschüss' is commonly used for Goodbye." },
    { question: "What does 'Guten Morgen' mean?", options: ["Good Night", "Good Morning", "How are you?", "Goodbye"], answer: "Good Morning", explanation: "'Guten Morgen' means Good Morning." },
    { question: "Translate 'Yes' in German.", options: ["Nein", "Ja", "Bitte", "Guten Tag"], answer: "Ja", explanation: "'Ja' means Yes." },
    { question: "How do you say 'Please'?", options: ["Danke", "Willkommen", "Bitte", "Hallo"], answer: "Bitte", explanation: "'Bitte' means Please or You're welcome." }
  ];

    let xp = parseInt(localStorage.getItem("xpLesson1")) || 0;
  let currentQuestion = parseInt(localStorage.getItem("currentQuestionLesson1")) || 0;
  let lives = parseInt(localStorage.getItem("livesLesson1")) || 3;
  let waiting = false;
  let selectedOption = null;
  let selectedBtn = null;

  const skipPenalty = false; // Change to true if skip should cost a life

  // DOM elements
  const questionElem = document.getElementById("question");
  const optionsElem = document.getElementById("options");
  const xpElem = document.getElementById("xp");
  const livesElem = document.getElementById("lives");
  const feedbackElem = document.getElementById("feedback");

  const gameOverPopup = document.getElementById("gameOverPopup");
  const victoryPopup = document.getElementById("victoryPopup");
  const passedPopup = document.getElementById("passedPopup");
  const popupFinalXP = document.getElementById("popupFinalXP");
  const xpBar = document.getElementById("xpBar");

  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  const loseSound = document.getElementById("loseSound");

  const skipBtn = document.getElementById("skipBtn");
  const checkBtn = document.getElementById("checkBtn");
  const continueBtn = document.getElementById("continueBtn");

  // Already completed check
  if (xp >= questions.length * 10 && currentQuestion >= questions.length) {
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
    localStorage.setItem("xpLesson1", xp);
    localStorage.setItem("currentQuestionLesson1", currentQuestion);
    localStorage.setItem("livesLesson1", lives);
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
      if (correctSound) { correctSound.currentTime = 0; correctSound.play(); }
    } else {
      lives -= 1;
      feedbackElem.innerText = `❌ Wrong! ${current.explanation}`;
      if (wrongSound) { wrongSound.currentTime = 0; wrongSound.play(); }
    }

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    saveProgress();

    if (lives <= 0) {
      hideControlButtons();
      if (loseSound) { loseSound.currentTime = 0; loseSound.play(); }
      setTimeout(() => gameOverPopup.style.display = "flex", 800);
    } else if (currentQuestion === questions.length - 1) {
      hideControlButtons();
      setTimeout(() => {
        popupFinalXP.innerText = xp;
        victoryPopup.style.display = "flex";
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

    current.options.forEach((opt) => {
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

  skipBtn.addEventListener("click", function () {
    if (skipPenalty) {
      lives -= 1;
      if (lives <= 0) {
        saveProgress();
        hideControlButtons();
        if (loseSound) { loseSound.currentTime = 0; loseSound.play(); }
        return setTimeout(() => gameOverPopup.style.display = "flex", 800);
      }
    }
    currentQuestion++;
    if (currentQuestion >= questions.length) {
      hideControlButtons();
      popupFinalXP.innerText = xp;
      victoryPopup.style.display = "flex";
    } else {
      loadQuestion();
    }
  });

  checkBtn.addEventListener("click", function () {
    if (!selectedOption) {
      alert("Please select an option first!");
      return;
    }
    checkAnswer(selectedOption, selectedBtn);
  });

  continueBtn.addEventListener("click", function () {
    currentQuestion++;
    loadQuestion();
  });

  loadQuestion();
});

// Global controls
function restartLesson() {
  localStorage.removeItem("xpLesson1");
  localStorage.removeItem("currentQuestionLesson1");
  localStorage.removeItem("livesLesson1");
  location.reload();
}
function goToNextLesson() {
  window.location.href = "lesson2_article.html";
}
function returnToCourseList() {
  window.location.href = "index.html";
}
function restartQuiz() {
  restartLesson();
}



