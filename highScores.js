let highScoresList = document.getElementById('highScoresList')
let highScores = JSON.parse(localStorage.getItem('highscores')) || []

highScoresList.innerHTML = highScores
    .map(score => `<li class='high-score'>${score.name} &nbsp; <span id='pgscore'>${score.score}</span></li>`)
    .join("")

