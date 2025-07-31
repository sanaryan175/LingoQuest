document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'Hello' in German?",
      options: ["Hallo", "Tschüss", "Bitte", "Danke"],
      answer: "Hallo",
      explanation: "'Hallo' means Hello in German.",
    },
    {
      question: "How do you say 'Thank you'?",
      options: ["Bitte", "Hallo", "Danke", "Nein"],
      answer: "Danke",
      explanation: "'Danke' means Thank you in German.",
    },
    {
      question: "What is 'Goodbye' in German?",
      options: ["Guten Morgen", "Tschüss", "Ja", "Willkommen"],
      answer: "Tschüss",
      explanation: "'Tschüss' is commonly used for Goodbye.",
    },
    {
      question: "What does 'Guten Morgen' mean?",
      options: ["Good Night", "Good Morning", "How are you?", "Goodbye"],
      answer: "Good Morning",
      explanation: "'Guten Morgen' means Good Morning.",
    },
    {
      question: "Translate 'Yes' in German.",
      options: ["Nein", "Ja", "Bitte", "Guten Tag"],
      answer: "Ja",
      explanation: "'Ja' means Yes.",
    },
    {
      question: "How do you say 'Please'?",
      options: ["Danke", "Willkommen", "Bitte", "Hallo"],
      answer: "Bitte",
      explanation: "'Bitte' means Please or You're welcome.",
    },
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson1")) || 0;
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
    const percent = (xp / (questions.length * 10)) * 100;
    xpBar.style.width = `${percent}%`;
  }

  function showNextButton() {
    const nextBtn = document.createElement("button");
    nextBtn.innerText = "Next →";
    nextBtn.style.marginTop = "1rem";
    nextBtn.onclick = () => {
      currentQuestion++;
      waiting = false;
      loadQuestion();
    };
    feedbackElem.appendChild(document.createElement("br"));
    feedbackElem.appendChild(nextBtn);
  }

  function checkAnswer(selected) {
    if (waiting) return;

    const current = questions[currentQuestion];
    waiting = true;

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
    localStorage.setItem("xpLesson1", xp);

    if (lives <= 0) {
      if (loseSound) loseSound.play();
      setTimeout(() => {
        popup.style.display = "flex";
      }, 800);
    } else if (currentQuestion === questions.length - 1) {
      // All questions completed
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
      btn.onclick = () => checkAnswer(opt);
      optionsElem.appendChild(btn);
    });

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
  }

  loadQuestion();
});

// Buttons
function restartLesson() {
  localStorage.removeItem("xpLesson1");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson2.html";
}

function returnToCourseList() {
  window.location.href = "index.html";
}


