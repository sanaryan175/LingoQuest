document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'Father' in Japanese?",
      options: ["おばあさん", "おじさん", "おとうさん", "あね"],
      answer: "おとうさん",
      explanation: "'おとうさん' (otōsan) means Father.",
    },
    {
      question: "What does 'おかあさん' mean?",
      options: ["Mother", "Grandmother", "Aunt", "Sister"],
      answer: "Mother",
      explanation: "'おかあさん' (okāsan) means Mother.",
    },
    {
      question: "Translate 'おにいさん' into English.",
      options: ["Father", "Younger brother", "Older brother", "Uncle"],
      answer: "Older brother",
      explanation: "'おにいさん' (onīsan) means Older Brother.",
    },
    {
      question: "What is 'Younger sister' in Japanese?",
      options: ["いもうと", "あね", "おば", "おじ"],
      answer: "いもうと",
      explanation: "'いもうと' (imōto) means Younger Sister.",
    },
    {
      question: "What does 'あね' mean?",
      options: ["Grandmother", "Older sister", "Mother", "Niece"],
      answer: "Older sister",
      explanation: "'あね' (ane) means Older Sister.",
    },
    {
      question: "Translate 'おじいさん' to English.",
      options: ["Uncle", "Grandfather", "Father", "Brother"],
      answer: "Grandfather",
      explanation: "'おじいさん' (ojīsan) means Grandfather.",
    },
    {
      question: "What is 'おばあさん' in English?",
      options: ["Mother", "Aunt", "Grandmother", "Sister"],
      answer: "Grandmother",
      explanation: "'おばあさん' (obāsan) means Grandmother.",
    },
    {
      question: "What is 'Uncle' in Japanese?",
      options: ["おじさん", "おにいさん", "いもうと", "おとうさん"],
      answer: "おじさん",
      explanation: "'おじさん' (ojisan) means Uncle.",
    },
    {
      question: "What is 'Cousin' in Japanese?",
      options: ["いとこ", "おば", "あに", "はは"],
      answer: "いとこ",
      explanation: "'いとこ' (itoko) means Cousin.",
    },
    {
      question: "What does 'おばさん' mean?",
      options: ["Sister", "Aunt", "Niece", "Grandmother"],
      answer: "Aunt",
      explanation: "'おばさん' (obasan) means Aunt.",
    },
  ];

  let xp = parseInt(localStorage.getItem("xpLesson3")) || 0;
  let currentQuestion = parseInt(localStorage.getItem("currentQuestionLesson3")) || 0;
  let lives = parseInt(localStorage.getItem("livesLesson3")) || 3;
  let waiting = false;
  let selectedOption = null;
  let selectedBtn = null;

  const skipPenalty = false;

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
    localStorage.setItem("xpLesson3", xp);
    localStorage.setItem("currentQuestionLesson3", currentQuestion);
    localStorage.setItem("livesLesson3", lives);
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

function restartLesson() {
  localStorage.removeItem("xpLesson3");
  localStorage.removeItem("currentQuestionLesson3");
  localStorage.removeItem("livesLesson3");
  location.reload();
}
function goToNextLesson() {
  window.location.href = "lesson4_article.html";
}
function returnToCourseList() {
  window.location.href = "index.html";
}
function restartQuiz() {
  restartLesson();
}
