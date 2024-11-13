/* Known Issues 

    Some of the data grabbed from the API has weird characters will probably have to ask about this.


    ==== TO DO =====
    Need to ask for more clarification about the local storage thing

    sorting by the selected table header

    the dialog popups HTML + the needed js and api requests for that data

*/
document.addEventListener('DOMContentLoaded', init);

function init()
{
const url = "https://www.randyconnolly.com/funwebdev/3rd/api/f1";
const  home = document.querySelector("#home_button"); 
const  favorites = document.querySelector("#favorites_button");

    
const  container = document.querySelector("#container");
const    homeView = document.querySelector("#home_view");
const   raceView = document.querySelector("#race_view")
const    roundTitle = document.querySelector("#round_title")

const    roundContainer = document.querySelector("#round_container");
const    raceTable = document.querySelector("#races");

const    qualifying = document.querySelector("#qualifying");
const    qualifyContainer = document.querySelector("#qualify_container");

const    resultsContainer = document.querySelector("#results_container");
const    resultTitle = document.querySelector("#results_title");
const    raceInfoContainer = document.querySelector("#race_info_container");
const    results = document.querySelector("#results");
const   preResultsMessage = document.querySelector("#pre_results_message");
const    driverContainer = document.querySelector("#driver_container");

const    pdImg1 = document.querySelector("#pd1");
const    pdImg2 = document.querySelector("#pd2");
const    pdImg3 = document.querySelector("#pd3");

const    seasonSelect = document.querySelector("#season-select");

const    circuit = document.querySelector("#circuit");


    
    add_event_handlers();

    load_view("home");


function fetch_race_season(season)
{
    let request = `${url}/races.php?season=${season}`;
    return fetch_store_API_data(request); /*Returns a promise object*/
}

function fetch_race_qualify(raceID)
{
    let request = `${url}/qualifying.php?race=${raceID}`;
    return fetch_store_API_data(request);
}

function fetch_race_results(raceID)
{
    let request = `${url}/results.php?race=${raceID}`;
    return fetch_store_API_data(request);
}



async function fetch_store_API_data(request)
{
    const storedData = localStorage.getItem(request);

    if(storedData){   /*Check if data is in local storage before grabbing it*/
        return JSON.parse(storedData);
    }
    else
    {
        try {
            const response = await fetch(request);
            const data = await response.json();
            
            if(request.includes("/races.php?season=") || request.includes("results.php?season=") || request.includes("/qualifying.php?season="))
            {
                localStorage.setItem(request, JSON.stringify(data)); // Save data to local storage as a JSON string
                console.log("Data stored in local storage! request:" + request);
            }
            return data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
}

function load_view(view, season = null) {

    if (view === "home") {
        show_nav_buttons(false);
        set_visibility(homeView, true);
        set_visibility(raceView, false);
        set_visibility(resultsContainer, false);
        set_visibility(preResultsMessage, true);
    }

    if (view === "races") {
        set_visibility(homeView, false);
        set_visibility(raceView, true);
        show_nav_buttons(true);
        list_season_races(season);
    }
}

function set_visibility(node, value)
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

function add_event_handlers()
{
    home.onclick = () => load_view("home");

    seasonSelect.addEventListener("change", (e) => {
        const selectedSeason = e.target.value;
        if (selectedSeason && selectedSeason != "SELECT A SEASON") {
            load_view("races", selectedSeason);
        }
    });

    favorites.addEventListener("click", () => { /* change this to the right popup later, this was just to test how it worked */
        circuit.showModal();
    }); 
    
}

/*------------------------------------------------------------------------------------------------------*/
// Name: showNavButtons
// Purpose: shows and hides the navigation buttons depending on the current view
/*------------------------------------------------------------------------------------------------------*/
function show_nav_buttons(show) {
   if(show)
   {
        favorites.classList.add("visibleFlex");
        favorites.classList.remove("hidden");
        home.classList.add("visibleFlex");
        home.classList.remove("hidden");
    }
    else
    {
        favorites.classList.remove("visibleFlex");
        favorites.classList.add("hidden");
        home.classList.remove("visibleFlex");
        home.classList.add("hidden");
    }
}


/*--------------------------------------------------------------------------------------------------------
// Name: list_season_races
// Purpose: it creates the DOM elements for the season races block
/*------------------------------------------------------------------------------------------------------*/
function list_season_races(season) {
    /*container.style.border ="none";*/
    roundTitle.textContent = `${season} Races`;
    roundContainer.textContent = "";

    const headerRow = document.createElement("tr");

    const roundColumn = document.createElement("th");
    roundColumn.textContent = "Round";

    const nameColumn = document.createElement("th");
    nameColumn.textContent = "Name";

    headerRow.appendChild(roundColumn);
    headerRow.appendChild(nameColumn);

    roundContainer.appendChild(headerRow)

    raceTable.appendChild(round_container);

    fetch_race_season(season).then(data => {
        generate_rounds_table(roundContainer, raceTable, season, data);
        console.log(data);                               
    });

    
}

/*--------------------------------------------------------------------------------------------------------
// Name: generate_rounds_table
// Purpose: generates the table of rounds that took place in a season
/*------------------------------------------------------------------------------------------------------*/
function generate_rounds_table(round_container, table, season, racesArray) {
    let i = 1;
    for (let race of racesArray) {

        const row = document.createElement("tr");
        row.className = "round_rows";

        const round = document.createElement("td");
        const name = document.createElement("td");
        /* needed for button later */
        const results = document.createElement("td");
        const resultsButton = document.createElement("button");
        results.class = "";

        round.textContent = i++;
        name.textContent = race.name;
        resultsButton.textContent = "Results";


        resultsButton.setAttribute("raceId", race.id); /*Stores the raceID as a attribute in the button so we know what race to get results for*/
        resultsButton.addEventListener("click", () => { list_grandprix_results(race.id, race.name, season); });

        row.appendChild(round);
        row.appendChild(name);

        results.appendChild(resultsButton);
        row.appendChild(results);

        round_container.appendChild(row)

        table.appendChild(round_container);
        
    }
}

/*--------------------------------------------------------------------------------------------------------
// Name: list_grandprix_results
// Purpose: creates the DOM content for the selection grand prix results
/*------------------------------------------------------------------------------------------------------*/
function list_grandprix_results(raceID, raceName, season) {

    qualifyContainer.textContent = "";
    driverContainer.textContent = "";

    resultTitle.textContent = `Results for ${season}, ${raceName}`;

    set_visibility(qualifying, true);

    fetch_race_qualify(raceID).then(data => {
        console.log(data);
        generate_qualify_table(data);                             
    });

    set_visibility(resultsContainer, true);
    set_visibility(preResultsMessage, false);

    fetch_race_results(raceID).then(data => {
        console.log(data);
        generate_results_table(data)                               
        pdImg1.src = `data/images/drivers/${data[0].driver.ref}.avif`;
        pdImg2.src = `data/images/drivers/${data[1].driver.ref}.avif`;
        pdImg3.src = `data/images/drivers/${data[2].driver.ref}.avif`;

    });

}

/*--------------------------------------------------------------------------------------------------------
// Name: generate_qualify_table
// Purpose: generates the table of qualifying drivers in a grand prix
/*------------------------------------------------------------------------------------------------------*/
function generate_qualify_table(qualifying) {
    for (let qualify of qualifying) {
        const row = document.createElement("tr");

        const pos = document.createElement("td");
        pos.textContent = qualify.position;
        row.appendChild(pos);

        const name = document.createElement("td");
        name.textContent = qualify.driver.forename + " " + qualify.driver.surname;
        row.appendChild(name);

        const constructor = document.createElement("td");
        constructor.textContent = qualify.constructor.name;
        row.appendChild(constructor); 

        const q1 = document.createElement("td");
        q1.textContent = qualify.q1;
        row.appendChild(q1);

        const q2 = document.createElement("td");
        q2.textContent = qualify.q2;
        row.appendChild(q2);

        const q3 = document.createElement("td");
        q3.textContent = qualify.q3;
        row.appendChild(q3);
    
        qualifyContainer.appendChild(row);
    }
}

/*--------------------------------------------------------------------------------------------------------
// Name: generate_results_table
// Purpose: generates the table of individual results in a grand prix
/*------------------------------------------------------------------------------------------------------*/
function generate_results_table(results) {
    for (let result of results) {
        const row = document.createElement("tr");
        
        const pos = document.createElement("td");
        pos.textContent = result.position;
        row.appendChild(pos);

        const name = document.createElement("td");
        name.textContent = result.driver.forename + " " + result.driver.surname;
        add_type_and_id(name, "driver", result.driver.ref);

        row.appendChild(name);

        const constructor = document.createElement("td");
        constructor.textContent = result.constructor.name;
        row.appendChild(constructor); 

        const laps = document.createElement("td");
        laps.textContent = result.laps;
        row.appendChild(laps);
        
        const pts = document.createElement("td");
        pts.textContent = result.points;
        row.appendChild(pts); 

        driverContainer.appendChild(row);
        driverContainer.addEventListener("click", load_popup);
    }
}


/*--------------------------------------------------------------------------------------------------------
// Name: add_type_and_ref
// Purpose: assigns a type and an id for a specified node, this is used so that information
can be looked up for a specific node when clicked. For example within generate_results_table: 
add_type_and_id(name, "driver", result.driver.id)
/*------------------------------------------------------------------------------------------------------*/
function add_type_and_id(node, type, ref)
{
    node.setAttribute("type", type);
    node.setAttribute("ref", ref);
}

function load_popup(e){
    console.log(e.target);
    
    if(e.target.type == "driver")
    {
        console.log("YAYYAYAY");
    }

}  
}


