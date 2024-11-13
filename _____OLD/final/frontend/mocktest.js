// /Scripts/mocktest.js

let timeLeft = 60 * 30; // 30 minutes
const timerElement = document.getElementById('timer');

// Update timer every second
function updateTimer() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(timerInterval);
        submitQuiz(); // Auto-submit when time runs out
    }
}
const timerInterval = setInterval(updateTimer, 1000);

// Navigate questions
let currentQuestionIndex = 0;
const questions = document.querySelectorAll('.question-item');

function showQuestion(index) {
    questions.forEach((q, idx) => {
        q.style.display = (idx === index) ? 'block' : 'none';
    });
}

function navigateQuestion(direction) {
    currentQuestionIndex += direction;
    currentQuestionIndex = Math.max(0, Math.min(currentQuestionIndex, questions.length - 1));
    showQuestion(currentQuestionIndex);
}

document.addEventListener('DOMContentLoaded', () => {
    showQuestion(currentQuestionIndex);
});

// Fetch questions from MongoDB (via API)
fetch('/api/questions/nimcet_maths') // Use the correct collection
    .then(response => response.json())
    .then(data => {
        // Render questions here
        // Example: 
        const questionContainer = document.getElementById('questionContainer');
        data.forEach((question, index) => {
            // Create and append question elements
        });
    });

// Cheating prevention (auto-submit on tab change)
window.addEventListener('blur', function() {
    alert("You switched tabs! Test will be auto-submitted.");
    submitQuiz();
});

// Auto-submit function
function submitQuiz() {
    // Logic for submitting the test
    console.log('Test submitted');
}
