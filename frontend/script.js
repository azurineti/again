document.getElementById('start-quiz').addEventListener('click', async () => {
    await fetch('/start', { method: 'POST' });
    loadQuestion();
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function loadQuestion() {
    const response = await fetch('/question');
    const data = await response.json();

    if (data.question) {
        document.getElementById('start-quiz').style.display = 'none'; // Скрыть кнопку "Start Quiz"
        document.getElementById('question-container').style.display = 'block';
        document.getElementById('question').innerText = data.question;
        const answersContainer = document.getElementById('answers');
        answersContainer.innerHTML = '';

        // Перемешать ответы
        shuffleArray(data.answers);

        data.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer;
            button.className = 'btn btn-outline-primary mr-2';
            button.addEventListener('click', () => checkAnswer(answer));
            answersContainer.appendChild(button);
        });
    } else {
        showResults();
    }
}

async function checkAnswer(answer) {
    const response = await fetch('/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer })
    });
    const data = await response.json();
    document.getElementById('result').innerText = `${data.result}! The correct answer was: ${data.correct_answer}`;
    document.getElementById('next-question').style.display = 'block';
}

document.getElementById('next-question').addEventListener('click', async () => {
    document.getElementById('next-question').style.display = 'none';
    document.getElementById('result').innerText = '';
    loadQuestion();
});

async function showResults() {
    const response = await fetch('/results');
    const data = await response.json();
    document.getElementById('question-container').innerHTML = `<h2>You answered ${data.correct_answers} out of ${data.total_questions} questions correctly!</h2>`;
}
