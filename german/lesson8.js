document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'bread' in German?",
      options: ["Milch", "Brot", "Käse", "Wasser"],
      answer: "Brot",
      explanation: "'Brot' means bread in German.",
    },
    {
      question: "How do you say 'milk'?",
      options: ["Milch", "Saft", "Fisch", "Tee"],
      answer: "Milch",
      explanation: "'Milch' means milk.",
    },
    {
      question: "What is the German word for 'cheese'?",
      options: ["Käse", "Ei", "Fleisch", "Reis"],
      answer: "Käse",
      explanation: "'Käse' means cheese.",
    },
    {
      question: "Translate 'water' into German.",
      options: ["Wasser", "Suppe", "Wein", "Salat"],
      answer: "Wasser",
      explanation: "'Wasser' is the German word for water.",
    },
    {
      question: "What is 'apple' in German?",
      options: ["Apfel", "Brot", "Kartoffel", "Zucker"],
      answer: "Apfel",
      explanation: "'Apfel' means apple.",
    },
    {
      question: "How do you say 'tea' in German?",
      options: ["Tee", "Milch", "Kaffee", "Saft"],
      answer: "Tee",
      explanation: "'Tee' means tea in German.",
    }
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson8")) || 0;
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

  function disableAllButtons() {
    const buttons = document.querySelectorAll(".options button");
    buttons.forEach(btn => btn.disabled = true);
  }

  function showNextButton() {
    if (document.querySelector(".next-btn")) return;
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next →";
    nextBtn.classList.add("next-btn");
    nextBtn.style.marginTop = "1rem";
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
      if (correctSound) correctSound.play();
    } else {
      lives -= 1;
      feedbackElem.innerText = `❌ Wrong! ${current.explanation}`;
      if (wrongSound) wrongSound.play();
    }

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    localStorage.setItem("xpLesson8", xp);

    if (lives <= 0) {
      if (loseSound) loseSound.play();
      setTimeout(() => {
        popup.style.display = "flex";
      }, 800);
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

// Global control buttons
function restartLesson() {
  localStorage.removeItem("xpLesson8");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson9.html";
}

function returnToCourseList() {
  window.location.href = "../german.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson8");
  location.reload();
}
