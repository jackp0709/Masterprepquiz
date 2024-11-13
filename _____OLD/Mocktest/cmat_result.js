

window.onload = function() {
    const correctCount = parseInt(localStorage.getItem('correctCount')) || 0;
    const totalQuestions = parseInt(localStorage.getItem('totalQuestions')) || 1; // Avoid division by zero
    const incorrectCount = JSON.parse(localStorage.getItem('incorrectAnswers'))?.length || 0;
    const unattemptedCount = JSON.parse(localStorage.getItem('unattempted'))?.length || 0;
    const marks = parseInt(localStorage.getItem('marks')) || 0;

    // Update summary
    document.getElementById('correct-answers').textContent = `Correct Answers: ${correctCount}`;
    document.getElementById('total-questions').textContent = `Total Questions: ${totalQuestions}`;
    document.getElementById('percentage').textContent = `Percentage: ${((correctCount / totalQuestions) * 100).toFixed(2)}%`;
    document.getElementById('marks').textContent = `Marks: ${marks} out of 400`; 
    // Create pie chart for Correct, Incorrect, and Unattempted
    const ctx = document.getElementById('results-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Correct', 'Incorrect', 'Unattempted'],
            datasets: [{
                data: [correctCount, incorrectCount, unattemptedCount],
                backgroundColor: ['#28A745', '#DC3545', '#6C757D']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ' + context.raw + ' (' + ((context.raw / totalQuestions) * 100).toFixed(2) + '%)';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });

    

    // Create bar graph for topic-wise correct answers
    const topicCorrectCounts = JSON.parse(localStorage.getItem('topicCorrectCounts')) || {};
    const colors = ['blue','green','yellow','orange','purple'];
    
    const barCtx = document.getElementById('topic-bar-chart').getContext('2d');
    
    // Prepare the dataset with colors
    const barColors = Object.keys(topicCorrectCounts).map((_, index) => colors[index % colors.length]);
    
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(topicCorrectCounts), // Topic names
            datasets: [{
                data: Object.values(topicCorrectCounts), // Correct counts per topic
                backgroundColor: barColors,
                barThickness: 60,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 20 // Change this to your desired font size
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Correct Answers'
                    },
                    ticks: {
                        stepSize: 5, // Set the step size
                        max: 50, // Maximum value of y axis
                        callback: function(value) {
                            return value; // Display each tick value
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // This hides the legend if it’s still appearing
                }
            }
        }
    });
    const answerList = document.getElementById('answer-list');
console.log(answerList);  // Check if this returns a valid element
answerList.innerHTML = '';
const answerKey = JSON.parse(localStorage.getItem('answerKey')) || {};
    Object.entries(answerKey).forEach(([questionNo, correctOption]) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${questionNo}: ${correctOption}`;
        answerList.appendChild(listItem)});

        const topicSummary = document.getElementById('topic-summary');
        topicSummary.innerHTML = '<h6>Topic-wise Results</h6>'; // Header for the summary
    
        const topicTotalCounts = JSON.parse(localStorage.getItem('topicTotalCounts')) || {};

        Object.keys(topicCorrectCounts).forEach((topic) => {
            const correctAnswers = topicCorrectCounts[topic] || 0;
            const totalQuestionsForTopic = topicTotalCounts[topic] || 0;
            const topicItem = document.createElement('p');
            topicItem.textContent = `${topic}: ${correctAnswers} correct out of ${totalQuestionsForTopic} questions`;
            topicSummary.appendChild(topicItem);
        });








};

