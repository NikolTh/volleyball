document.querySelector("form#team_names").addEventListener("submit", submitForm);
function submitForm(e) {
    e.preventDefault()
    // Get input values
    var team1 = document.getElementById('team1').value;
    var team2 = document.getElementById('team2').value;

    // Store input values in localStorage (you can also use localStorage)
    localStorage.setItem('team1', team1);
    localStorage.setItem('team2', team2);

    // Redirect to the next page
    window.location.href = './game.html';
}