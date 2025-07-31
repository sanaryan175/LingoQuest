document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    { question: "What is 'Monday' in German?", options: ["Montag", "Dienstag", "Mittwoch", "Donnerstag"], answer: "Montag", explanation: "'Montag' means Monday." },
    { question: "Translate 'Friday' to German.", options: ["Freitag", "Samstag", "Sonntag", "Donnerstag"], answer: "Freitag", explanation: "'Freitag' is Friday in German." },
    { question: "What does 'Sonntag' mean?", options: ["Saturday", "Sunday", "Thursday", "Friday"], answer: "Sunday", explanation: "'Sonntag' is Sunday." },
    { question: "What is 'Wednesday' in German?", options: ["Dienstag", "Mittwoch", "Freitag", "Montag"], answer: "Mittwoch", explanation: "'Mittwoch' is Wednesday." },
    { question: "Translate 'July' to German.", options: ["Mai", "Juli", "Januar", "August"], answer: "Juli", explanation: "'Juli' is July in German." },
    { question: "What does 'Dezember' mean?", options: ["November", "October", "December", "January"], answer: "December", explanation: "'Dezember' means December." },
    { question: "Translate 'Spring' to German.", options: ["Sommer", "Frühling", "Herbst", "Winter"], answer: "Frühling", explanation: "'Frühling' is Spring." },
    { question: "What is 'Herbst' in English?", options: ["Winter", "Summer", "Autumn", "Spring"], answer: "Autumn", explanation: "'Herbst' means Autumn." },
    { question: "Translate 'August' to German.", options: ["August", "Oktober", "April", "Juni"], answer: "August", explanation: "'August' stays the same in German." },
    { question: "What does 'Donnerstag' mean?", options: ["Tuesday", "Thursday", "Wednesday", "Saturday"], answer: "Thursday", explanation: "'Donnerstag' is Thursday." },
    { question: "Translate 'January' to German.", options: ["Februar", "Dezember", "Januar", "März"], answer: "Januar", explanation: "'Januar' is January." },
    { question: "What is 'Sommer' in English?", options: ["Winter", "Spring", "Autumn", "Summer"], answer: "Summer", explanation: "'Sommer' means Summer." },
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson5")) || 0;
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
    localStorage.setItem("xpLesson5", xp);

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

function restartLesson() {
  localStorage.removeItem("xpLesson5");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "lesson6.html"; // update if needed
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson5");
  location.reload();
}
