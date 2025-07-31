document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "What is 'One' in German?",
      options: ["Eins", "Zwei", "Drei", "Vier"],
      answer: "Eins",
      explanation: "'Eins' means One.",
    },
    {
      question: "What is 'Three' in German?",
      options: ["Drei", "Zehn", "Acht", "Fünf"],
      answer: "Drei",
      explanation: "'Drei' means Three.",
    },
    {
      question: "Translate 'Five' into German.",
      options: ["Sechs", "Fünf", "Vier", "Sieben"],
      answer: "Fünf",
      explanation: "'Fünf' means Five.",
    },
    {
      question: "What is 'Zehn' in English?",
      options: ["Six", "Nine", "Ten", "Four"],
      answer: "Ten",
      explanation: "'Zehn' means Ten.",
    },
    {
      question: "What is 'Sieben'?",
      options: ["Seven", "Six", "Eight", "Nine"],
      answer: "Seven",
      explanation: "'Sieben' means Seven.",
    },
    {
      question: "How do you say 'Two' in German?",
      options: ["Neun", "Zwei", "Acht", "Drei"],
      answer: "Zwei",
      explanation: "'Zwei' means Two.",
    },
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson2")) || 0;
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
    localStorage.setItem("xpLesson2", xp);

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

// Global Control
function restartLesson() {
  localStorage.removeItem("xpLesson2");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson3.html"; // You can change this later
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson2");
  location.reload();
}
