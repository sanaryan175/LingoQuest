document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is the German word for 'house'?",
      options: ["Haus", "Baum", "Auto", "Stuhl"],
      answer: "Haus",
      explanation: "'Haus' means 'house' in German.",
    },
    {
      question: "What is 'kitchen' in German?",
      options: ["Küche", "Zimmer", "Fenster", "Tür"],
      answer: "Küche",
      explanation: "'Küche' means 'kitchen' in German.",
    },
    {
      question: "What does 'Fenster' mean?",
      options: ["Window", "Door", "Roof", "Wall"],
      answer: "Window",
      explanation: "'Fenster' means 'window' in German.",
    },
    {
      question: "Translate: 'The bathroom is clean.'",
      options: [
        "Das Badezimmer ist sauber.",
        "Die Küche ist schmutzig.",
        "Das Wohnzimmer ist klein.",
        "Der Garten ist schön."
      ],
      answer: "Das Badezimmer ist sauber.",
      explanation: "‘Das Badezimmer ist sauber’ means ‘The bathroom is clean.’",
    },
    {
      question: "What is 'Schlafzimmer'?",
      options: ["Bedroom", "Living room", "Bathroom", "Garage"],
      answer: "Bedroom",
      explanation: "'Schlafzimmer' means 'bedroom' in German.",
    }
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson7")) || 0;
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
    localStorage.setItem("xpLesson7", xp);

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
  localStorage.removeItem("xpLesson7");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson8.html";
}

function returnToCourseList() {
  window.location.href = "../german.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson7");
  location.reload();
}
