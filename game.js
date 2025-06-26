const question = document.getElementById('question')
const choices = Array.from(document.getElementsByClassName('choice-text'))
let progressText = document.getElementById('progressText')
let scoreText = document.getElementById('score')
let progressBarFull = document.getElementById('progress-bar-full')

let loader = document.getElementById('loader')
let game = document.getElementById('game')

let currentQuestion = {}
let acceptingAnswers = false
let score = 0
let questionCounter = 0
let availableQuesions = []

let questions = []

function decodeHTML(html) {
    const txt = document.createElement("textarea")
    txt.innerHTML = html
    return txt.value
}


fetch(
    'https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple'
)
    .then((res) => {
        return res.json()
    })
    .then((loadedQuestions) => {
        questions = loadedQuestions.results.map((loadedQuestion) => {
            const formattedQuestion = {
                question: decodeHTML(loadedQuestion.question),
            }

            const answerChoices = [...loadedQuestion.incorrect_answers.map(decodeHTML)]
            const correctAnswer = decodeHTML(loadedQuestion.correct_answer)

            formattedQuestion.answer = Math.floor(Math.random() * 4) + 1
            answerChoices.splice(formattedQuestion.answer - 1, 0, correctAnswer)

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice
            })

            return formattedQuestion
        })
        setTimeout(() => {
            startGame();
            game.classList.remove('hidden')
            loader.classList.add('hidden')
        }, 3000);
    })

    .catch((err) => {
        console.error(err);
    })

const CORRECT_BONUS = 10
const INCORRECT_DEDUCT = -5
const MAX_QUESTIONS = 10

startGame = () => {
    questionCounter = 0
    score = 0
    availableQuesions = [...questions]
    getNewQuestion()
    game.classList.remove('hidden')
    loader.classList.add('hidden')
};

getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score)
        return window.location.assign('/end.html')
    }
    questionCounter++
    progressText.innerHTML = `Question: <b>${questionCounter}/${MAX_QUESTIONS}</b>`
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`
    const questionIndex = Math.floor(Math.random() * availableQuesions.length)
    currentQuestion = availableQuesions[questionIndex]
    question.innerText = currentQuestion.question

    choices.forEach((choice) => {
        const number = choice.dataset['number']
        choice.innerText = currentQuestion['choice' + number]
    })

    availableQuesions.splice(questionIndex, 1)
    acceptingAnswers = true
};

choices.forEach((choice) => {
    choice.addEventListener('click', (e) => {
        if (!acceptingAnswers) return

        acceptingAnswers = false
        const selectedChoice = e.target
        const selectedAnswer = selectedChoice.dataset['number']

        let classToApply = 'incorrect'
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = 'correct'
        }
        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS)
        } else {
            decrementScore(INCORRECT_DEDUCT)
        }
        selectedChoice.parentElement.classList.add(classToApply)
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply)
            getNewQuestion()
        }, 2000)
    })
})

incrementScore = num => {
    score += num
    scoreText.innerText = score
}
decrementScore = num => {
    score += num
    scoreText.innerText = score
}