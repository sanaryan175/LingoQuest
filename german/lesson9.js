document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'North' in German?",
      options: ["Norden", "Süden", "Osten", "Westen"],
      answer: "Norden",
      explanation: "'Norden' means North.",
    },
    {
      question: "Translate 'South' into German.",
      options: ["Osten", "Westen", "Süden", "Morgen"],
      answer: "Süden",
      explanation: "'Süden' means South.",
    },
    {
      question: "How do you say 'East' in German?",
      options: ["Osten", "Norden", "Mittag", "Westen"],
      answer: "Osten",
      explanation: "'Osten' means East.",
    },
    {
      question: "Translate 'West' into German.",
      options: ["Westen", "Osten", "Süden", "Nacht"],
      answer: "Westen",
      explanation: "'Westen' means West.",
    },
    {
      question: "What is the German word for 'Morning'?",
      options: ["Abend", "Mittag", "Morgen", "Nacht"],
      answer: "Morgen",
      explanation: "'Morgen' means Morning.",
    },
    {
      question: "What does 'Abend' mean?",
      options: ["Afternoon", "Evening", "Morning", "Night"],
      answer: "Evening",
      explanation: "'Abend' means Evening.",
    },
    {
      question: "What is 'Night' in German?",
      options: ["Morgen", "Mittag", "Nacht", "Abend"],
      answer: "Nacht",
      explanation: "'Nacht' means Night.",
    },
    {
      question: "How do you say 'Afternoon' in German?",
      options: ["Nachmittag", "Morgen", "Nacht", "Mittag"],
      answer: "Nachmittag",
      explanation: "'Nachmittag' means Afternoon.",
    },
    {
      question: "What does 'Mittag' mean?",
      options: ["Midnight", "Midday/Noon", "Evening", "Morning"],
      answer: "Midday/Noon",
      explanation: "'Mittag' means Midday or Noon.",
    },
    {
      question: "Which of the following means 'Direction' in German?",
      options: ["Richtung", "Phase", "Weg", "Stadt"],
      answer: "Richtung",
      explanation: "'Richtung' means Direction.",
    }
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson9")) || 0;
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
    localStorage.setItem("xpLesson9", xp);

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
  localStorage.removeItem("xpLesson9");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson10.html";
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson9");
  location.reload();
}
