document.addEventListener("DOMContentLoaded", function () {
  const questions = [
    {
      question: "How do you say 'How are you?' in German?",
      options: ["Wie geht's?", "Was ist das?", "Wo bist du?", "Wann ist das?"],
      answer: "Wie geht's?",
      explanation: "'Wie geht's?' means 'How are you?' in German."
    },
    {
      question: "What does 'Ich heiße Anna' mean?",
      options: ["I am Anna", "My name is Anna", "I have a cat", "I live in Anna"],
      answer: "My name is Anna",
      explanation: "'Ich heiße Anna' translates to 'My name is Anna'."
    },
    {
      question: "Translate to German: 'Nice to meet you'",
      options: ["Schön dich zu treffen", "Guten Tag", "Willkommen", "Danke"],
      answer: "Schön dich zu treffen",
      explanation: "'Schön dich zu treffen' means 'Nice to meet you'."
    },
    {
      question: "What is 'Where do you live?' in German?",
      options: ["Wo wohnst du?", "Wie alt bist du?", "Was machst du?", "Wann kommst du?"],
      answer: "Wo wohnst du?",
      explanation: "'Wo wohnst du?' means 'Where do you live?'."
    },
    {
      question: "Choose the German phrase for 'I don't understand'.",
      options: ["Ich verstehe nicht", "Ich habe Hunger", "Ich bin müde", "Ich mag Musik"],
      answer: "Ich verstehe nicht",
      explanation: "'Ich verstehe nicht' means 'I don't understand'."
    },
    {
      question: "How do you say 'Please speak slowly'?",
      options: ["Bitte sprechen Sie langsam", "Sprechen Sie schnell", "Ich verstehe", "Ich weiß nicht"],
      answer: "Bitte sprechen Sie langsam",
      explanation: "'Bitte sprechen Sie langsam' means 'Please speak slowly'."
    },
    {
      question: "Translate 'Do you speak English?' into German.",
      options: ["Sprechen Sie Englisch?", "Kannst du Deutsch?", "Magst du Englisch?", "Verstehst du das?"],
      answer: "Sprechen Sie Englisch?",
      explanation: "'Sprechen Sie Englisch?' means 'Do you speak English?'."
    },
    {
      question: "What does 'Ich komme aus Indien' mean?",
      options: ["I live in India", "I am from India", "I love India", "I travel to India"],
      answer: "I am from India",
      explanation: "'Ich komme aus Indien' means 'I am from India'."
    },
    {
      question: "Choose the correct German for 'I’m learning German'.",
      options: ["Ich lerne Deutsch", "Ich spreche Englisch", "Ich wohne in Berlin", "Ich heiße Hans"],
      answer: "Ich lerne Deutsch",
      explanation: "'Ich lerne Deutsch' means 'I’m learning German'."
    },
    {
      question: "Translate 'Can you help me?'",
      options: ["Können Sie mir helfen?", "Kann ich gehen?", "Wie geht’s dir?", "Was ist das?"],
      answer: "Können Sie mir helfen?",
      explanation: "'Können Sie mir helfen?' means 'Can you help me?'."
    },
    {
      question: "What does 'Ich habe eine Frage' mean?",
      options: ["I have a question", "I need food", "I am late", "I like football"],
      answer: "I have a question",
      explanation: "'Ich habe eine Frage' means 'I have a question'."
    },
    {
      question: "Translate 'What time is it?'",
      options: ["Wie spät ist es?", "Wo ist es?", "Was kostet das?", "Was machst du?"],
      answer: "Wie spät ist es?",
      explanation: "'Wie spät ist es?' means 'What time is it?'."
    },
    {
      question: "What is 'Good night' in German?",
      options: ["Gute Nacht", "Guten Morgen", "Guten Abend", "Hallo"],
      answer: "Gute Nacht",
      explanation: "'Gute Nacht' means 'Good night'."
    },
    {
      question: "How do you say 'Excuse me' in German?",
      options: ["Entschuldigung", "Achtung", "Bitte", "Gerne"],
      answer: "Entschuldigung",
      explanation: "'Entschuldigung' means 'Excuse me'."
    },
    {
      question: "Translate to German: 'I'm sorry'",
      options: ["Es tut mir leid", "Bitte sehr", "Keine Ursache", "Willkommen"],
      answer: "Es tut mir leid",
      explanation: "'Es tut mir leid' means 'I'm sorry'."
    }
  ];

  let currentQuestion = 0;
  let xp = parseInt(localStorage.getItem("xpLesson10")) || 0;
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
    localStorage.setItem("xpLesson10", xp);

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
  localStorage.removeItem("xpLesson10");
  location.reload();
}

function goToNextLesson() {
  window.location.href = "index.html";
}

function returnToCourseList() {
  window.location.href = "index.html";
}

function restartQuiz() {
  localStorage.removeItem("xpLesson10");
  location.reload();
}
