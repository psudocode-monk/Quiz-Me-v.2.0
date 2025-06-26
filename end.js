let username = document.getElementById('username')
let saveScoreBtn = document.getElementById('saveScoreBtn')
let finalScore = document.getElementById('finalScore')

let mostRecentScore = localStorage.getItem('mostRecentScore')
const highScores = JSON.parse(localStorage.getItem('highscores', JSON.stringify([]))) || []

let MAX_HIGH_SCORES = 5

finalScore.innerText = mostRecentScore

username.addEventListener('keyup', () => {
    saveScoreBtn.disabled = !username.value
})

let saveHighScore = (e) => {
    e.preventDefault()
    let score = {
        score: mostRecentScore,
        name: username.value
    }
    highScores.push(score)
    highScores.sort((a, b) => b.score - a.score)
    highScores.splice(5)

    localStorage.setItem('highscores', JSON.stringify(highScores))
    window.location.assign('index.html')

}