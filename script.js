const quizQuestions = [
    { question: "What is 1.3 + 1.7 ?", options: [2, 2.5, 3, 3.5], answer: 2 },
    { question: "What is the capital of america?", options: ["London", "Washington DC", "Berlin", "Rome"], answer: 1 },
    { question: "What is the largest planet in our solar system?", options: ["Earth", "Jupiter", "Mars", "Venus"], answer: 1 },
    { question: "What is the boiling point of water?", options: [90, 100, 110, 120], answer: 1 },
    { question: "Which element has the chemical symbol 'O'?", options: ["Gold", "Oxygen", "Osmium", "Oganesson"], answer: 1 }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

function toggleAuth() {
    document.getElementById('login-form').style.display = document.getElementById('login-form').style.display === 'none' ? 'block' : 'none';
    document.getElementById('signup-form').style.display = document.getElementById('signup-form').style.display === 'none' ? 'block' : 'none';
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function signup() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    if (validateEmail(email) && password.length >= 6) {
        localStorage.setItem(email, password);
        alert('Signup successful');
        toggleAuth();
    } else {
        alert('Invalid signup details');
    }
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    if (localStorage.getItem(email) === password) {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('logout-button').style.display = 'block'; // Show logout button
        shuffleArray(quizQuestions); // Shuffle questions on login
        startQuiz();
    } else {
        alert('Invalid login credentials');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('result-container').style.display = 'none';
    loadQuestion();
    startTimer();
}


function loadQuestion() {
    const questionData = quizQuestions[currentQuestionIndex];
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `<h3>${questionData.question}</h3>`;
    questionData.options.forEach((option, index) => {
        questionContainer.innerHTML += `<button class="option-btn" onclick="selectAnswer(${index})">${option}</button>`;
    });
    updateProgress();
    
    document.getElementById('next-question').style.display = currentQuestionIndex < 4 ? 'block' : 'none';
}
function selectAnswer(selectedOption) {
    const correctOption = quizQuestions[currentQuestionIndex].answer;
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((button, index) => {
        button.disabled = true;
        if (index === correctOption) {
            button.classList.add('correct');
        }
        if (index === selectedOption && index !== correctOption) {
            button.classList.add('wrong');
        }
    });
    if (selectedOption === correctOption) {
        score++;
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
        startTimer();
    } else {
        showResult();
    }
}

function showResult() {
    document.getElementById('question-container').innerHTML = '';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('score').innerText = score;
    document.getElementById('total-questions').innerText = quizQuestions.length;
    const scorePercent = (score / quizQuestions.length) * 100;
    document.getElementById('score-bar').style.width = `${scorePercent}%`;
    document.getElementById('next-question').style.display = 'none'; // Hide next question button on result
}

function updateProgress() {
    const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    document.getElementById('progress').style.width = `${progressPercent}%`;
}

function startTimer() {
    clearInterval(timer);
    timeLeft = 10;
    document.getElementById('time').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.style.color = document.body.classList.contains('dark-theme') ? '#ffffff' : '#000000';
    });
}

function logout() {
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('logout-button').style.display = 'none'; // Hide logout button
    clearInterval(timer); // Clear the timer when logging out
}