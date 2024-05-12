const team1 = localStorage.getItem('team1');
const team2 = localStorage.getItem('team2');
document.getElementById('team1_name').textContent = team1;
document.getElementById('team2_name').textContent = team2;

const team1_sets = document.getElementById("team1_sets_container").getElementsByClassName("set_circle");
const team2_sets = document.getElementById("team2_sets_container").getElementsByClassName("set_circle");
const timer = document.getElementById("timer")

let timeout_at_8 = false;
let timeout_at_16 = false;

let timeout_seconds = 60;

let team_1_score = 0;
let team_2_score = 0;

let team_1_sets_won = 0;
let team_2_sets_won = 0;

let team_1_sum_points = 0;
let team_2_sum_points = 0;

const randomNumber = Math.random();

let serving_team = document.getElementById('serving_team')
serving_team.textContent = Math.round(randomNumber) === 0 ? team1: team2;



document.querySelector("#team1_score_button").addEventListener("click", incrementHomeTeamScore);
document.querySelector("#team2_score_button").addEventListener("click", incrementAwayTeamScore);
document.querySelector("#timeout_button").addEventListener("click", startTimeout);

function incrementHomeTeamScore(){
    team_1_score +=1;
    document.getElementById('team1_score').textContent = (team_1_score).toString();
    let game_points = team_1_sets_won + team_2_sets_won < 4 ? 25 : 15

    serving_team.textContent = team1;

    if(team_1_score >= game_points && team_1_score >= team_2_score && team_1_score-team_2_score>=2) {
        team_1_sets_won += 1;
        team1_sets.item(team1_sets.length - team_1_sets_won).classList.remove('no_set')
        team1_sets.item(team1_sets.length - team_1_sets_won).classList.add('set')
        resetTeamScores()

        if(team_1_sets_won === 3){
            openPopup(team1);
        }
    }

    if(team_1_score === 8 && !timeout_at_8){
        timeout_at_8 = true;
        // startTimeout()
    }

    if(team_1_score === 16 && !timeout_at_16){
        timeout_at_16 = true;
        // startTimeout()
    }


}

function incrementAwayTeamScore(){
    team_2_score += 1;
    document.getElementById('team2_score').textContent = (team_2_score).toString();
    let game_points = team_1_sets_won + team_2_sets_won < 4 ? 25 : 15

    serving_team.textContent = team2;

    if (team_2_score >= game_points && team_2_score >= team_1_score && team_2_score - team_1_score >= 2) {
        team_2_sets_won += 1;
        team2_sets.item(team_2_sets_won - 1).classList.remove('no_set')
        team2_sets.item(team_2_sets_won - 1).classList.add('set')
        resetTeamScores()

        if (team_2_sets_won === 3) {
            openPopup(team2);
        }
    }

    if(team_2_score === 8 && !timeout_at_8){
        timeout_at_8 = true
        // startTimeout()
    }

    if(team_2_score === 16 && !timeout_at_16){
        timeout_at_16 = true
        // startTimeout()
    }
}

function resetTeamScores() {
    team_1_sum_points += team_1_score;
    team_2_sum_points += team_2_score;

    team_1_score = 0;
    team_2_score = 0;

    document.getElementById('team1_score').textContent = (team_1_score).toString();
    document.getElementById('team2_score').textContent = (team_2_score).toString();
    timeout_at_8 = false;
    timeout_at_16 = false;
}

function startTimeout(){
    let score_buttons = document.getElementsByClassName("score_button");

    for (let currentButton of score_buttons) {
        currentButton.disabled = true;
        currentButton.classList.add("disabled_state")
    }

    updateTimer()
}

function resetTimeout() {
    timer.textContent = "-";
    timeout_seconds = 60;
    let score_buttons = document.getElementsByClassName("score_button");

    for (let currentButton of score_buttons) {
        currentButton.disabled = false;
        currentButton.classList.remove("disabled_state")
    }
}

function updateTimer() {
    const remainingTimeInSeconds = Math.max(0, timeout_seconds);

    timer.textContent = remainingTimeInSeconds.toString();

    if (remainingTimeInSeconds > 0) {
        // Decrement the countdown time
        timeout_seconds--;
        setTimeout(updateTimer, 1000);
    } else {
        resetTimeout()
    }
}

function exportGameResults() {
    const data = [
        ['HomeTeam', 'AwayTeam', 'HomeSets', 'AwaySets', 'HomePoints', 'AwayPoints'],
        [team1, team2, team_1_sets_won, team_2_sets_won, team_1_sum_points, team_2_sum_points]
    ];

    const csvContent = data.map(row => row.join(',')).join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Create a download link
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(blob);
    downloadLink.download = 'exported_data.csv';

    // Append the link to the body and click it to initiate the download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.location.href = './index.html';
}

function createGameOverPopup(team) {
    let html = `
    <div class="overlay_window" id="game_over_window">
      <div class="overlay_content content box">
        <div class="overlay_header">
            <iconify-icon icon="mingcute:close-fill" class="close_overlay_button"></iconify-icon>
        </div>
        <div class="game_information">
            <h1>Game over</h1>
            <h2>Winner: ${team}</h2>
            <div class="stats_container box">
                <div class="team_names">
                    <p>${team1}</p>
                    <p>${team2}</p>
                </div>
                <div class="stats">
                    <div class="team1_stats team_stats">
                        <p>Sets: ${team_1_sets_won}</p>
                        <p>Total points: ${team_1_sum_points}</p>
                    </div>
                    <div class="team2_stats team_stats">
                        <p>Sets: ${team_2_sets_won}</p>
                        <p>Total points: ${team_2_sum_points}</p>
                    </div>
                </div>
            </div>
            
        </div>
        <div class="export_data_button_container">
            <button id="export_data_button">Export data</button>
        </div>
      </div>
    </div>
    `;
    return new DOMParser().parseFromString(html, "text/html").body.firstElementChild;
}

function openPopup(team) {
    let game_over_popup = createGameOverPopup(team)
    document.body.appendChild(game_over_popup);
    document.querySelector("#export_data_button").addEventListener("click", exportGameResults);
    game_over_popup.addEventListener("click", (e) => {
        if (e.target.classList.contains("overlay_window") || e.target.classList.contains("close_overlay_button")) {
            game_over_popup.remove();
            window.location.href = './index.html';
        }
    });
    document.querySelector("#export_data_button").addEventListener("click", exportGameResults);
}