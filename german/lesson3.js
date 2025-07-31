document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'Father' in German?",
      options: ["Mutter", "Vater", "Bruder", "Opa"],
      answer: "Vater",
      explanation: "'Vater' means Father.",
    },
    {
      question: "Translate 'Mother' into German.",
      options: ["Tante", "Oma", "Mutter", "Schwester"],
      answer: "Mutter",
      explanation: "'Mutter' means Mother.",
    },
    {
      question: "What does 'Bruder' mean?",
      options: ["Cousin", "Sister", "Brother", "Uncle"],
      answer: "Brother",
      explanation: "'Bruder' means Brother.",
    },
    {
      question: "What is 'Sister' in German?",
      options: ["Tochter", "Schwester", "Enkelin", "Oma"],
      answer: "Schwester",
      explanation: "'Schwester' means Sister.",
    },
    {
      question: "What is 'Oma' in English?",
      options: ["Uncle", "Grandmother", "Cousin", "Niece"],
      answer: "Grandmother",
      explanation: "'Oma' is a casual word for Grandmother.",
    },
    {
      question: "What is 'Onkel' in English?",
      options: ["Uncle", "Aunt", "Nephew", "Brother"],
      answer: "Uncle",
      explanation: "'Onkel' means Uncle.",
    },
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson3")) || 0;
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
      if (correctSound) correctSound.play();
    } else {
      lives -= 1;
      feedbackElem.innerText = `❌ Wrong! ${current.explanation}`;
      if (wrongSound) wrongSound.play();
    }

    xpElem.innerText = xp;
    livesElem.innerText = lives;
    updateXPBar();
    localStorage.setItem("xpLesson3", xp);

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

// Controls
function restartLesson() {
  localStorage.removeItem("xpLesson3");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson4.html"; // optional
}

function returnToCourseList() {
  window.location.href = "../index.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson3");
  location.reload();
}
