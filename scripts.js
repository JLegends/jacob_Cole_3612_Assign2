document.addEventListener('DOMContentLoaded', () => init()); 

let container, homeView, raceView, titles, header;
let round_container, race_table, seasonSelect;

function init()
{
    container = document.querySelector("#main");
    homeView = document.querySelector("#home");
    raceView = document.querySelector("#races_container")
    titles = document.querySelector(".titles")
    header = document.querySelector("header");

    round_container = document.querySelector("#round_container");
    race_table = document.querySelector("#races");

    seasonSelect = document.querySelector("#season-select");
    seasonSelect.addEventListener("change", (e) => {
        const selectedSeason = e.target.value;
        if (selectedSeason) {
            loadView("races", selectedSeason);
        }
    });

    loadView("home");
}



function loadView(view, season = null) {

    if (view === "home") {
        showNavButtons(false);
        setVisibility(homeView, true);
        setVisibility(raceView, false);
    }

    if (view === "races") {
        setVisibility(homeView, false);
        setVisibility(raceView, true);
        showNavButtons(true);

        /* Just a testing array to see if things are working properly */
        const racesArray = [{year: 2020, round: 1, name:"Italian Grand Prix"}, 
            {year: 2021, round: 1, name:"British Grand Prix"}, 
            {year: 2021, round: 2, name:"German Grand Prix"},
            {year: 2021, round: 3, name:"France Grand Prix"}];

        list_season_races(season, racesArray);
        list_grandprix_results(container, season, racesArray);
    }
}

function setVisibility(node, value)
{
    if(value)
    {
        node.classList.remove("hidden");
        node.classList.add("visible");
    }
    else
    {
        node.classList.remove("visible");
        node.classList.add("hidden");
    }
}

/*------------------------------------------------------------------------------------------------------*/
// Name: showNavButtons
// Purpose: shows and hides the navigation buttons depending on the current view
/*------------------------------------------------------------------------------------------------------*/
function showNavButtons(show) {
    nav_buttons = ["Home", "Favorites"];
    
    if (show) {
        for (let nav_item of nav_buttons) {
            const button = document.createElement("button");

            button.id = nav_item;
            button.textContent = nav_item;
            button.fontWeight = 900;
            if (nav_item === "Home") {
                button.onclick = () => loadView('home');
            }
            header.appendChild(button);
        }
    }
    else {
        for (let nav_item of nav_buttons) {
            const button = document.querySelector(`#${nav_item}`);
            if (button) {
                header.removeChild(button);

            }
        }
    }
}


/*--------------------------------------------------------------------------------------------------------
// Name: list_season_races
// Purpose: it creates the DOM elements for the season races block
/*------------------------------------------------------------------------------------------------------*/
function list_season_races(season, racesArray) {
    container.style.border ="none";


    titles.textContent = `${season} Races`;
    generate_rounds_table(round_container, table, season, racesArray);

}

/*--------------------------------------------------------------------------------------------------------
// Name: generate_rounds_table
// Purpose: generates the table of rounds that took place in a season
/*------------------------------------------------------------------------------------------------------*/
function generate_rounds_table(round_container, table, season, racesArray) {
    for (let race of racesArray) {
        if (race.year == season) {
            const row = document.createElement("tr");
            row.className = "round_rows";

            const round = document.createElement("td");
            const name = document.createElement("td");
            /* needed for button later */
            const results = document.createElement("td");
            const resultsButton = document.createElement("button");
            results.class = "";

            round.textContent = race.round;
            name.textContent = race.name;
            resultsButton.textContent = "Results";


            row.appendChild(round);
            row.appendChild(name);

            results.appendChild(resultsButton);
            row.appendChild(results);

            round_container.appendChild(row)

            table.appendChild(round_container);
        }
    }
}

/*--------------------------------------------------------------------------------------------------------
// Name: list_grandprix_results
// Purpose: creates the DOM content for the selection grand prix results
/*------------------------------------------------------------------------------------------------------*/
function list_grandprix_results(container, season, racesArray) {
    const results_container = document.createElement("div");
    results_container.id = "results_container";

    const resultTitle = document.createElement("h3");
    resultTitle.className = "titles";
    resultTitle.textContent = `Results for ${season} Italian Grand Prix`;

    description = document.createElement("p");
    description.textContent = "Race Name, Round #, year, Circuit Name, Date URL (clean this up later)";

    const race_info_container = document.createElement("div");
    race_info_container.id = "race_info_container";

    const qualifying = document.createElement("div");
    qualifying.id = "qualifying";
    qualifying.textContent = "Qualifying";

    const results = document.createElement("div");
    results.id = "results";
    results.textContent = "Results";


    results_container.appendChild(resultTitle);
    results_container.appendChild(description);

    /*
    generate_qualify_table(); 
    generate_results_table();
*/
    race_info_container.appendChild(qualifying);
    race_info_container.appendChild(results);

    results_container.appendChild(race_info_container);

    container.appendChild(results_container);
}

/*--------------------------------------------------------------------------------------------------------
// Name: generate_qualify_table
// Purpose: generates the table of qualifying drivers in a grand prix
/*------------------------------------------------------------------------------------------------------*/
function generate_qualify_table(qualifying, table, season, racesArray) {
    for (let race of racesArray) {
        if (race.year == season) {
            const row = document.createElement("tr");
            row.className = "round_rows";

            const round = document.createElement("td");
            const name = document.createElement("td");
            /* needed for button later */
            const results = document.createElement("td");
            const resultsButton = document.createElement("button");
            results.class = "";

            round.textContent = race.round;
            name.textContent = race.name;
            resultsButton.textContent = "Results";


            row.appendChild(round);
            row.appendChild(name);

            results.appendChild(resultsButton);
            row.appendChild(results);

            round_container.appendChild(row)

            table.appendChild(round_container);
        }
    }
}

/*--------------------------------------------------------------------------------------------------------
// Name: generate_results_table
// Purpose: generates the table of individual results in a grand prix
/*------------------------------------------------------------------------------------------------------*/
function generate_results_table(results, table, season, racesArray) {
    for (let race of racesArray) {
        if (race.year == season) {
            const row = document.createElement("tr");
            row.className = "round_rows";

            const round = document.createElement("td");
            const name = document.createElement("td");
            /* needed for button later */
            const results = document.createElement("td");
            const resultsButton = document.createElement("button");
            results.class = "";

            round.textContent = race.round;
            name.textContent = race.name;
            resultsButton.textContent = "Results";


            row.appendChild(round);
            row.appendChild(name);

            results.appendChild(resultsButton);
            row.appendChild(results);

            round_container.appendChild(row)

            table.appendChild(round_container);
        }
    }
}