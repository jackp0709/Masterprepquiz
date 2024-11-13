let questions = [];
let currentQuestion = 0;
let answers = [];
let timer;
let timeLeft = 10800;
let testSubmitted = false; // Flag to check if the user is submitting intentionally

// Fetch questions from MongoDB when the page loads
window.onload = async function () {
    try {
        const collectionName='cmat_mock2'
        const response = await fetch(`http://localhost:3000/api/questions/${collectionName}`);
        questions = await response.json();
        loadQuestion(0); 
        generateQuestionMap();
        startTimer(); 
        //monitorTabSwitch(); // Start monitoring for tab switches
    } catch (err) {
        console.error('Error fetching questions:', err);
    }
};

// Monitor tab switches and auto-submit if the user cheats
function monitorTabSwitch() {
    document.addEventListener('visibilitychange', function() {
        if (document.hidden && !testSubmitted) { // Only trigger if the test hasn't been submitted
            alert('You switched tabs! The test will be automatically submitted.');
            submitTest(); // Automatically submit the test if the user switches tabs
        }
    });
}

// Load a specific question
function loadQuestion(index) {
    const questionContainer = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options');
    const questionNumber = document.getElementById('question-number');
    const passageContainer = document.getElementById('passage');
    const questionBox =document.getElementById('question-container');
    // Handle passage if it exists
    if (questions[index].passage) {
        passageContainer.style.display = 'block';
        passageContainer.textContent = questions[index].passage;
        questionBox.style.marginTop='200px';
    } else {
        passageContainer.style.display = 'none';
        questionBox.style.marginTop='20px'
    }

    // Set the question text and number
    questionNumber.textContent = `Question ${index + 1} of ${questions.length}`;
    questionContainer.textContent = questions[index].question;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Add the options as checkboxes
    questions[index].options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.innerHTML = `
            <label>
                <input type="checkbox" name="option" class="circular-checkbox" value="${i}" ${answers[index] === i ? 'checked' : ''}>
                ${option}
            </label>
        `;

        const checkbox = optionElement.querySelector('input[type="checkbox"]');

        // Ensure only one checkbox can be selected per question
        checkbox.addEventListener('change', function() {
            // Uncheck all other checkboxes for this question
            const checkboxes = document.querySelectorAll('input[name="option"]');
            checkboxes.forEach((cb) => {
                if (cb !== this) {
                    cb.checked = false;
                }
            });

            // Update the selected answer for the current question
            answers[index] = this.checked ? parseInt(this.value) : null;
            generateQuestionMap(); // Update the question map when answer changes
        });

        optionsContainer.appendChild(optionElement);
    });

    document.getElementById('prev-btn').disabled = index === 0;
    document.getElementById('submit-btn').style.display = 'inline-block';
    document.getElementById('next-btn').disabled = index === questions.length - 1;
}

function generateQuestionMap() {
    const questionMap = document.getElementById('grid-container');
    questionMap.innerHTML = '';

    questions.forEach((_, index) => {
        const questionMapElement = document.createElement('span');
        questionMapElement.textContent = index + 1;
        questionMapElement.className = answers[index] != null ? 'answered' : 'unanswered';
        questionMapElement.onclick = () => {
            currentQuestion = index;
            loadQuestion(index);
        };
        questionMap.appendChild(questionMapElement);
    });
}



function confirmSubmit() {
    const confirmSubmission = confirm("Are you sure you want to submit the test?");
    if (confirmSubmission) {
        submitTest(); // Call the submitTest function if confirmed
    }
}
// Navigate to the next question
function nextQuestion() {
    saveAnswer();
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion(currentQuestion);
    }
}

// Navigate to the previous question
function prevQuestion() {
    saveAnswer();
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion(currentQuestion);
    }
}

// Save the selected answer for the current question
function saveAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    answers[currentQuestion] = selectedOption ? parseInt(selectedOption.value) : null;
    generateQuestionMap();
}

// Generate the question map showing progress
/*function generateQuestionMap() {
    const questionMap = document.getElementById('question-map');
    questionMap.innerHTML = '';

    questions.forEach((_, index) => {
        const questionMapElement = document.createElement('span');
        questionMapElement.textContent = index + 1;
        questionMapElement.className = answers[index] != null ? 'answered' : 'unanswered';
        questionMapElement.onclick = () => {
            currentQuestion=(index);
            loadQuestion(index);
        };
        questionMap.appendChild(questionMapElement);
    });
}*/

// Calculate topic-wise correct counts
function calculateTopicCorrectCount() {
    const topicCount = {};
    questions.forEach((question, index) => {
        if (answers[index] === question.correct_option) {
            topicCount[question.topic] = (topicCount[question.topic] || 0) + 1;
        }
    });
    return topicCount;
}

// Calculate topic-wise total counts
function calculateTopicTotalCount() {
    const topicCount = {};
    questions.forEach((question) => {
        topicCount[question.topic] = (topicCount[question.topic] || 0) + 1;
    });
    return topicCount;
}

// Submit the test and calculate results
function submitTest() {
    testSubmitted = true; // Mark the test as intentionally submitted
    saveAnswer();
    
    let correctCount = 0;
    let incorrectCount = 0;
    let unattempted = [];
    let incorrectAnswers = [];
    let answerKey = {};
    
    // Create an object to store correct counts by topic
    const topicCorrectCounts = {};

    questions.forEach((question, index) => {
        if (answers[index] == null) {
            unattempted.push(question);
        } else if (answers[index] == question.correct_option) {
            correctCount++;
            // Increment the correct count for the specific topic
            topicCorrectCounts[question.topic] = (topicCorrectCounts[question.topic] || 0) + 1;
        }
        else {
            // Combine both conditions
            incorrectCount++;
            incorrectAnswers.push({
                question: question.question,
                attempted: question.options[answers[index]],
                correct: question.options[question.correct_option]
            });
        }
        answerKey[index + 1] = question.options[question.correct_option];
    });
    const marks = (correctCount * 4) - (incorrectCount * 1); 
    const topicTotalCounts = calculateTopicTotalCount();
    // Store the counts in localStorage
    localStorage.setItem('correctCount', correctCount);
    localStorage.setItem('totalQuestions', questions.length);
    localStorage.setItem('unattempted', JSON.stringify(unattempted));
    localStorage.setItem('incorrectAnswers', JSON.stringify(incorrectAnswers));
    localStorage.setItem('topicCorrectCounts', JSON.stringify(topicCorrectCounts));
    localStorage.setItem('answerKey', JSON.stringify(answerKey));
    localStorage.setItem('topicTotalCounts', JSON.stringify(topicTotalCounts));
    localStorage.setItem('marks', marks); 
 // Save topic correct counts

    window.location.href = 'cmat_result.html'; // Redirect to results page
}


// Start the timer
function startTimer() {
    const timerElement = document.getElementById('timer');
    
    timer = setInterval(function() {
        const hours = Math.floor(timeLeft / 3600); // Calculate hours
        const minutes = Math.floor((timeLeft % 3600) / 60); // Calculate minutes
        const seconds = timeLeft % 60; // Calculate seconds

        // Update the timer element with hours, minutes, and seconds
        timerElement.textContent = `Time left: ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitTest(); // Automatically submit the test when time is up
        } else {
            timeLeft--;
        }
    }, 1000);
}




