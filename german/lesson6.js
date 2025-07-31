document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What does 'Wer' mean?",
      options: ["Where", "Why", "Who", "When"],
      answer: "Who",
      explanation: "'Wer' means 'Who' in German.",
    },
    {
      question: "What does 'Wo' mean?",
      options: ["Why", "Where", "How", "When"],
      answer: "Where",
      explanation: "'Wo' means 'Where'.",
    },
    {
      question: "Which is a personal pronoun?",
      options: ["der", "ich", "Haus", "haben"],
      answer: "ich",
      explanation: "'ich' means 'I' and is a personal pronoun.",
    },
    {
      question: "What is the plural of 'Kind'?",
      options: ["Kinden", "Kinder", "Kinds", "Kindenen"],
      answer: "Kinder",
      explanation: "The plural of 'Kind' (child) is 'Kinder' (children).",
    },
    {
      question: "What does 'du hast' mean?",
      options: ["You are", "You have", "You go", "You like"],
      answer: "You have",
      explanation: "'du hast' is 'you have'.",
    },
    {
      question: "Choose the correct form of 'sein' (to be) for 'er':",
      options: ["bin", "ist", "seid", "bist"],
      answer: "ist",
      explanation: "'Er ist' = He is.",
    },
    {
      question: "What article goes with 'Apfel' (apple)?",
      options: ["die", "der", "das", "den"],
      answer: "der",
      explanation: "'der Apfel' is the correct form.",
    },
    {
      question: "Which sentence is grammatically correct?",
      options: ["Ich sind müde", "Du bin müde", "Ich bin müde", "Sie bist müde"],
      answer: "Ich bin müde",
      explanation: "Correct conjugation: Ich bin = I am.",
    },
    {
      question: "Which is the indefinite article for 'Mädchen' (girl)?",
      options: ["ein", "eine", "einen", "einem"],
      answer: "ein",
      explanation: "'Mädchen' is neuter, so use 'ein'.",
    },
    {
      question: "What is 'We have' in German?",
      options: ["Wir habt", "Wir haben", "Wir sein", "Wir bist"],
      answer: "Wir haben",
      explanation: "'Wir haben' means 'We have'.",
    },
    {
      question: "Which verb means 'to be'?",
      options: ["haben", "machen", "sein", "gehen"],
      answer: "sein",
      explanation: "'sein' means 'to be'.",
    },
    {
      question: "What is the plural of 'Auto'?",
      options: ["Autos", "Autoen", "Autoes", "Auten"],
      answer: "Autos",
      explanation: "The plural is 'Autos'.",
    },
    {
      question: "What does 'Warum' mean?",
      options: ["When", "How", "Why", "Who"],
      answer: "Why",
      explanation: "'Warum' means 'Why'.",
    },
    {
      question: "How do you say 'They are'?",
      options: ["Sie sind", "Sie seid", "Sie bist", "Sie ist"],
      answer: "Sie sind",
      explanation: "'Sie sind' = They are.",
    },
    {
      question: "Which is a simple German sentence?",
      options: ["Haus groß ist", "Ich habe ein Buch", "Bin ich gut", "Guten Morgen bin ich"],
      answer: "Ich habe ein Buch",
      explanation: "'Ich habe ein Buch' = I have a book.",
    },
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson6")) || 0;
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
    localStorage.setItem("xpLesson6", xp);

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
  localStorage.removeItem("xpLesson6");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson7.html";
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson6");
  location.reload();
}
