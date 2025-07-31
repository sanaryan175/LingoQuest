document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'lesen' in English?",
      options: ["to sing", "to dance", "to read", "to swim"],
      answer: "to read",
      explanation: "'lesen' means 'to read'.",
    },
    {
      question: "Translate 'to play football' into German.",
      options: ["Fußball spielen", "lesen", "kochen", "tanzen"],
      answer: "Fußball spielen",
      explanation: "'Fußball spielen' means 'to play football'.",
    },
    {
      question: "What does 'schwimmen' mean?",
      options: ["to paint", "to sing", "to swim", "to draw"],
      answer: "to swim",
      explanation: "'schwimmen' means 'to swim'.",
    },
    {
      question: "What is 'to dance' in German?",
      options: ["tanzen", "schlafen", "hören", "schreiben"],
      answer: "tanzen",
      explanation: "'tanzen' means 'to dance'.",
    },
    {
      question: "Translate 'to cook' into German.",
      options: ["kochen", "lesen", "reisen", "laufen"],
      answer: "kochen",
      explanation: "'kochen' means 'to cook'.",
    },
    {
      question: "What does 'zeichnen' mean?",
      options: ["to draw", "to sleep", "to study", "to travel"],
      answer: "to draw",
      explanation: "'zeichnen' means 'to draw'.",
    }
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson4")) || 0;
  let lives = 3;
  let waiting = false;

  const questionElem = document.getElementById("question");
  const optionsElem = document.getElementById("options");
  const xpElem = document.getElementById("xp");
  const livesElem = document.getElementById("lives");
  const feedbackElem = document.getElementById("feedback");
  const popup = document.getElementById("gameOverPopup");
  const victoryPopup = document.getElementById("victoryPopup");
  const popupFinalXP = document.getElementById("popupFinalXP");
  const xpBar = document.getElementById("xpBar");

  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  const loseSound = document.getElementById("loseSound");

  function updateXPBar() {
    const percent = Math.min((xp / (questions.length * 10)) * 100, 100);
    xpBar.style.width = `${percent}%`;
  }

  function showNextButton() {
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next →";
    nextBtn.classList.add("next-btn");
    nextBtn.onclick = () => {
      currentQuestion++;
      waiting = false;
      loadQuestion();
    };
    feedbackElem.appendChild(document.createElement("br"));
    feedbackElem.appendChild(nextBtn);
  }

  function checkAnswer(selected, btn) {
    if (waiting) return;
    waiting = true;

    const current = questions[currentQuestion];
    const buttons = document.querySelectorAll(".options button");

    buttons.forEach(button => {
      button.disabled = true;
      if (button.innerText === current.answer) {
        button.classList.add("correct");
      } else if (button === btn) {
        button.classList.add("wrong");
      }
    });

    if (selected === current.answer) {
      xp += 10;
      feedbackElem.innerText = "✅ Correct!";
      correctSound && correctSound.play();
    } else {
      lives -= 1;
      feedbackElem.innerText = `❌ Wrong! ${current.explanation}`;
      wrongSound && wrongSound.play();
    }

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    localStorage.setItem("xpLesson4", xp);

    if (lives <= 0) {
      loseSound && loseSound.play();
      setTimeout(() => popup.style.display = "flex", 800);
    } else if (currentQuestion === questions.length - 1) {
      setTimeout(() => {
        document.getElementById("lesson").style.display = "none";
        popupFinalXP.innerText = xp;
        victoryPopup.style.display = "flex";
      }, 800);
    } else {
      showNextButton();
    }
  }

  function loadQuestion() {
    if (currentQuestion >= questions.length) return;

    const current = questions[currentQuestion];
    questionElem.innerText = current.question;
    optionsElem.innerHTML = "";
    feedbackElem.innerText = "";

    current.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.innerText = opt;
      btn.onclick = () => checkAnswer(opt, btn);
      optionsElem.appendChild(btn);
    });

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
  }

  loadQuestion();
});

// Controls
function restartLesson() {
  localStorage.removeItem("xpLesson4");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson5.html"; // optional
}

function returnToCourseList() {
  window.location.href = "../index.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson4");
  location.reload();
}
