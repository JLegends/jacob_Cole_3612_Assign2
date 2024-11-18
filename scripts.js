/* Known Issues 

    Some of the data grabbed from the API has weird characters will probably have to ask about this.

    ==== TO DO =====
    sorting by the selected table header

    theres a bug where the event listeners recopy their successful clicks for adding to favorites 

*/

const favorited =
{
    drivers: [], 
    constructors: [], 
    circuits: [],
};

let season = null; /* I need this globally accessible for the load_popup function */

document.addEventListener('DOMContentLoaded', init);

function init() { 

    const url = "https://www.randyconnolly.com/funwebdev/3rd/api/f1";
    const home = document.querySelector("#home_button");
    const favorites_button = document.querySelector("#favorites_button");


    const container = document.querySelector("#container");
    const homeView = document.querySelector("#home_view");
    const raceView = document.querySelector("#race_view")
    const roundTitle = document.querySelector("#round_title")

    const raceButtonContainer = document.querySelector("#race_button_container")
    const roundContainer = document.querySelector("#round_container");
    const raceTable = document.querySelector("#races");

    const resultsContainer = document.querySelector("#results_container");

    const qualifying = document.querySelector("#qualifying");
    const qualifyContainer = document.querySelector("#qualify_container");
    const results = document.querySelector("#results");

    const resultTitle = document.querySelector("#results_title");
    const resultSubheader = document.querySelector("#results_subheader");

    const raceInfo1 = document.querySelector("#race_info1");
    const circuitName = document.querySelector("#circuit_name");
    const raceInfo2 = document.querySelector("#race_info2");


    const resultsTab = document.querySelector("#results_button");
    const qualifyTab = document.querySelector("#qualifying_button");
    const preResultsMessage = document.querySelector("#pre_results_message");
    const driverContainer = document.querySelector("#driver_container");

    const pdImg1 = document.querySelector("#pd1");
    const pdImg2 = document.querySelector("#pd2");
    const pdImg3 = document.querySelector("#pd3");

    const seasonSelect = document.querySelector("#season-select");

    const circuit = document.querySelector("#circuit");
    const driver = document.querySelector("#driver");
    const constructor = document.querySelector("#constructor");
    const favorites = document.querySelector("#favorites");

    const favDrivers = document.querySelector("#fav_drivers");
    const favConstructors = document.querySelector("#fav_constructors");
    const favCircuits = document.querySelector("#fav_circuits");

    const addFavoriteDriver = document.querySelector("#add_favorite_driver");
    const addFavoriteConst = document.querySelector("#add_favorite_const");
    const addFavoriteCirc = document.querySelector("#add_favorite_circ");

    const constName = document.querySelector("#const_name");
    const constNationality = document.querySelector("#const_nationality");
    const constMoreInfo = document.querySelector("#const_more_info");
    const constructorTable = document.querySelector("#constructor_table");

    const driverInfo = document.querySelector("#driver_info");
    const driverNationality = document.querySelector("#driver_nationality");
    const driverMoreInfo = document.querySelector("#driver_more_info");
    const driverTable = document.querySelector("#driver_table");


    add_event_handlers();

    load_view("home");

    function fetch_race_season(season) {
        let request = `${url}/races.php?season=${season}`;
        return fetch_store_API_data(request); /*Returns a promise object*/
    }

    function fetch_circuit_name(circuitId) {
        let request = `${url}/circuits.php?id=${circuitId}`;
        return fetch_store_API_data(request);
    }

    function fetch_race_qualify(raceID) {
        let request = `${url}/qualifying.php?race=${raceID}`;
        return fetch_store_API_data(request);
    }

    function fetch_race_results(raceID) {
        let request = `${url}/results.php?race=${raceID}`;
        return fetch_store_API_data(request);
    }

    function fetch_driver(driverRef) {
        let request = `${url}/drivers.php?ref=${driverRef}`;
        return fetch_store_API_data(request);
    }

    function fetch_driver_results(driverRef, season) {
        let request = `${url}/driverResults.php?driver=${driverRef}&season=${season}`;
        return fetch_store_API_data(request);
    }

    function fetch_constructor(constructorRef) {
        let request = `${url}/constructors.php?ref=${constructorRef}`;
        return fetch_store_API_data(request);
    }

    function fetch_constructor_results(constructorRef, season) {
        let request = `${url}/constructorResults.php?constructor=${constructorRef}&season=${season}`;
        return fetch_store_API_data(request);
    }

    async function fetch_store_API_data(request) {
        const storedData = localStorage.getItem(request);

        if (storedData) {   /*Check if data is in local storage before grabbing it*/
            return JSON.parse(storedData);
        }
        else {
            try {
                const response = await fetch(request);
                const data = await response.json();

                if (request.includes("/races.php?season=") || request.includes("results.php?season=") || request.includes("/qualifying.php?season=")) {
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
            set_visibility(homeView, true);
            set_visibility(raceView, false);
            set_visibility(resultsContainer, false);
            set_visibility(preResultsMessage, true);
        }

        if (view === "races") {
            set_visibility(homeView, false);
            set_visibility(raceView, true);
            list_season_races(season);
        }
    }

    function set_visibility(node, value) {
        if (value) {
            node.classList.remove("hidden");
            node.classList.add("visible");
        }
        else {
            node.classList.remove("visible");
            node.classList.add("hidden");
        }
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: add_event_handlers
    // Purpose: 
    /*------------------------------------------------------------------------------------------------------*/
    function add_event_handlers() {
        home.onclick = () => load_view("home");

        seasonSelect.addEventListener("change", (e) => {
            const selectedSeason = e.target.value;
            if (selectedSeason && selectedSeason != "SELECT A SEASON") {
                load_view("races", selectedSeason);
                season = selectedSeason;
            }
        });
        raceButtonContainer.addEventListener("click", (e) => {
            const selectedSeason = e.target.value;
            if (selectedSeason) {
                load_view("races", selectedSeason);
            }
        })

        favorites_button.addEventListener("click", () => {
            favorites.showModal();
            generate_favorite_tables();
        });

        driverContainer.addEventListener("click", load_popup);
        roundContainer.addEventListener("click", load_popup);
        qualifyContainer.addEventListener("click", load_popup);
        circuitName.addEventListener("click", load_popup);

        /* these should go in a seperate funcion eventually*/

        addFavoriteCirc.addEventListener("click", () => {
            favorited.circuits.unshift("added circuit");
            console.log(`favorited ${favorited.circuits}`);
        });

    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: list_season_races
    // Purpose: it creates the DOM elements for the season races block
    /*------------------------------------------------------------------------------------------------------*/
    function list_season_races(season) {
        /*container.style.border ="none";*/
        set_visibility(qualifying, false)
        set_visibility(resultsContainer, false);
        set_visibility(preResultsMessage, true);
        roundTitle.textContent = `${season} Races`;
        roundContainer.textContent = "";

        const headerRow = document.createElement("tr");
        headerRow.className = "text-l text-stone-950 uppercase";
        const roundColumn = document.createElement("th");
        roundColumn.textContent = "Round";

        const nameColumn = document.createElement("th");
        nameColumn.textContent = "Name";

        headerRow.appendChild(roundColumn);
        headerRow.appendChild(nameColumn);

        roundContainer.appendChild(headerRow)


        fetch_race_season(season).then(data => {
            generate_rounds_table(roundContainer, season, data);
        });
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: generate_rounds_table
    // Purpose: generates the table of rounds that took place in a season
    /*------------------------------------------------------------------------------------------------------*/
    function generate_rounds_table(round_container, season, racesArray) {
        let i = 1;
        for (let race of racesArray) {

            const row = document.createElement("tr");
            if(i % 2 == 0)
            {
                row.className = "bg-stone-50 border-b-red-700 border-b-4";
            }
            else
            {
                row.className = "bg-stone-300 border-b-red-700 border-b-4";
            }
            const round = document.createElement("td");
            const name = document.createElement("td");

            const results = document.createElement("td");
            const resultsButton = document.createElement("button");
            const lineDiv = document.createElement("div");
            lineDiv.className = "h-4 w-[100%] bg-red-700 clip-diagonal-right"

            results.className = "";

            round.textContent = i++;
            name.textContent = race.name;
            name.className = "hover:text-white";
            add_type_and_id(name, "circuit", race.id);

            resultsButton.textContent = "Results";
            resultsButton.className = " bg-red-700 text-white px-4 py-2 rounded-t-lg hover:bg-red-600";
            resultsButton.setAttribute("raceId", race.id); /*Stores the raceID as a attribute in the button so we know what race to get results for*/
            resultsButton.addEventListener("click", () => { 
                list_grandprix_results(race.id, race.name, season, "result"); 
                generate_results_subheader(race.id, race.circuit.id, round.textContent, race.year, race.name, race.date, race.url);
                resultsTab.addEventListener("click", ()=>{
                    list_grandprix_results(race.id, race.name, season, "result"); 
                })
                qualifyTab.addEventListener("click", ()=>{
                    list_grandprix_results(race.id, race.name, season, "qualifying"); 
                })
            });

            row.appendChild(round);
            row.appendChild(name);

            results.appendChild(resultsButton);
            row.appendChild(results);

            round_container.appendChild(row)
            round_container.appendChild(lineDiv);
        }
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: list_grandprix_results
    // Purpose: creates the DOM content for the selection grand prix results
    /*------------------------------------------------------------------------------------------------------*/
    function list_grandprix_results(raceID, raceName, season, resultType) {

        qualifyContainer.textContent = "";
        driverContainer.textContent = "";

        set_visibility(preResultsMessage, false);
        set_visibility(resultsContainer, true);


        if(resultType == "qualifying")
        {
            resultTitle.textContent = `Qualifying for ${season}, ${raceName}`;
            set_visibility(qualifying, true);
            set_visibility(results, false);

            fetch_race_qualify(raceID).then(data => {
                console.log(`qualify data ${data[0].driver.ref}`);
                generate_qualify_table(data);
                pdImg1.src = `data/images/drivers/${data[0].driver.ref}.avif`;
                pdImg2.src = `data/images/drivers/${data[1].driver.ref}.avif`;
                pdImg3.src = `data/images/drivers/${data[2].driver.ref}.avif`;
            });
        }
        else if(resultType == "result")
        {
            resultTitle.textContent = `Results for ${season}, ${raceName}`;
            set_visibility(results, true);
            set_visibility(qualifying, false);

            fetch_race_results(raceID).then(data => {
                console.log(`results data ${data[0].driver.ref}`);
                generate_results_table(data);
                pdImg1.src = `data/images/drivers/${data[0].driver.ref}.avif`;
                pdImg2.src = `data/images/drivers/${data[1].driver.ref}.avif`;
                pdImg3.src = `data/images/drivers/${data[2].driver.ref}.avif`;
            });
        }
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: generate_qualify_table
    // Purpose: generates the table of qualifying drivers in a grand prix
    /*------------------------------------------------------------------------------------------------------*/
    function generate_qualify_table(qualifying) {
        for (let qualify of qualifying) {
            const row = document.createElement("tr");
            row.className = "odd: bg-stone-50 even:bg-stone-300"
            const pos = document.createElement("td");
            pos.textContent = qualify.position;
            row.appendChild(pos);

            const name = document.createElement("td");
            name.className = "hover:text-white";
            name.textContent = qualify.driver.forename + " " + qualify.driver.surname;
            add_type_and_id(name, "driver", qualify.driver.ref);
            row.appendChild(name);

            const constructor = document.createElement("td");
            constructor.className = "hover:text-white";
            constructor.textContent = qualify.constructor.name;
            add_type_and_id(constructor, "constructor", qualify.constructor.ref);
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
            row.className = "odd: bg-stone-150 even:bg-stone-300"
            const pos = document.createElement("td");
            pos.textContent = result.position;
            row.appendChild(pos);

            const name = document.createElement("td");
            name.className = "hover:text-white";
            name.textContent = result.driver.forename + " " + result.driver.surname;
            add_type_and_id(name, "driver", result.driver.ref);
            row.appendChild(name);

            const constructor = document.createElement("td");
            constructor.className = "hover:text-white";
            constructor.textContent = result.constructor.name;
            add_type_and_id(constructor, "constructor", result.constructor.ref);
            row.appendChild(constructor);

            const laps = document.createElement("td");
            laps.textContent = result.laps;
            row.appendChild(laps);

            const pts = document.createElement("td");
            pts.textContent = result.points;
            row.appendChild(pts);

            driverContainer.appendChild(row);
        }
    }


    /*--------------------------------------------------------------------------------------------------------
    // Name: add_type_and_ref
    // Purpose: assigns a type and an id for a specified node, this is used so that information
    can be looked up for a specific node when clicked. For example within generate_results_table: 
    add_type_and_id(name, "driver", result.driver.id)
    /*------------------------------------------------------------------------------------------------------*/
    function add_type_and_id(node, type, ref) {
        node.setAttribute("type", type);
        node.setAttribute("ref", ref);
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: load_popup
    // Purpose: assigns a type and an id for a specified node, this is used so that information
    can be looked up for a specific node when clicked. For example within generate_results_table: 
    add_type_and_id(name, "driver", result.driver.id)
    /*------------------------------------------------------------------------------------------------------*/
    function load_popup(e) {
        const type = e.target.getAttribute("type");
        const ref = e.target.getAttribute("ref");

        if (type == "driver") {
            driver.showModal();
            fetch_driver(ref, season).then(data => {
                assemble_driver_popup(ref, data, season);

            });
        }
        else if(type == "circuit")
        {
            circuit.showModal();
        }
        else if (type == "constructor") {
            constructor.showModal();
            fetch_constructor(ref, season).then(data => {
                assemble_constructor_popup(ref, data, season);
            });
        }
    }


    /*--------------------------------------------------------------------------------------------------------
    // Name: generate_results_subheader
    // Purpose: assigns the variables to the whole results container subheader (will soon also allow for the 
    circuit name popup on circuit name click)
    /*------------------------------------------------------------------------------------------------------*/
    function generate_results_subheader(raceId, circuitId, raceRound, raceYear, raceName, raceDate, raceUrl) {
        fetch_circuit_name(circuitId).then(data => {
            raceInfo1.textContent = `${raceName} - Round ${raceRound} - ${raceYear} - ` + " ";
            circuitName.textContent = data.name;
            add_type_and_id(circuitName, "circuit", raceId);
            raceInfo2.textContent = " " + `- ${raceDate} - ${raceUrl}`;

            resultSubheader.appendChild(raceInfo1);
            resultSubheader.appendChild(circuitName);
            resultSubheader.appendChild(raceInfo2);
        });
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: generate_favorite_tables
    // Purpose: rebuilds each of the favorite tables every time the popup is generated, to accomodate for new
    additions or removals in the lists
    /*------------------------------------------------------------------------------------------------------*/
    function generate_favorite_tables() {
        favDrivers.innerHTML = "";
        favConstructors.innerHTML = "";
        favCircuits.innerHTML = "";

        for (let driver of favorited.drivers) {
            const row = document.createElement("tr");
            row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
            const element = document.createElement("td");
            element.className = "px-6 py-6 font-medium text-gray-900 dark:text-white truncate";
            element.textContent = driver;
            row.appendChild(element);
            favDrivers.appendChild(row);
        }

        for (let constructor of favorited.constructors) {
            const row = document.createElement("tr");
            row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
            const element = document.createElement("td");
            element.className = "px-6 py-6 font-medium text-gray-900dark:text-white truncate";
            element.textContent = constructor;
            row.appendChild(element);
            favConstructors.appendChild(row);
        }

        for (let circuit of favorited.circuits) {
            const row = document.createElement("tr");
            row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
            const element = document.createElement("td");
            element.className = "px-6 py-6 font-medium text-gray-900 dark:text-white truncate";
            element.textContent = circuit;
            row.appendChild(element);
            favCircuits.appendChild(row);
        }
    }


    /*--------------------------------------------------------------------------------------------------------
    // Name: assemble_constructor_popup
    // Purpose: 
    /*------------------------------------------------------------------------------------------------------*/
    function assemble_constructor_popup(ref, data, season) {
        constName.textContent = `${data.name}`;
        constNationality.textContent = `${data.nationality}` ;
        constMoreInfo.textContent = `Learn More`;
        constMoreInfo.href = data.url;

        addFavoriteConst.onclick = null;

        addFavoriteConst.addEventListener("click", () => {
            favorited.constructors.push(data.name);
        });

        fetch_constructor_results(ref, season).then(data => { 
            constructorTable.innerHTML = "";

            for (let constructor of data) {
                const row = document.createElement("tr");
                row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
                
                const round = document.createElement("td");
                round.className = "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white";
                round.textContent = constructor.round;
                row.appendChild(round);
        
                const raceName = document.createElement("td");
                raceName.className = "px-6 py-4";
                raceName.textContent = constructor.name;
                row.appendChild(raceName);

                const driverName = document.createElement("td");
                driverName.className = "px-6 py-4";
                driverName.textContent = constructor.forename + " " + constructor.surname;
                row.appendChild(driverName);
        
                const position = document.createElement("td");
                position.className = "px-6 py-4";
                position.textContent = constructor.positionOrder;
                row.appendChild(position);
        
                constructorTable.appendChild(row);
            }
        });
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: assemble_constructor_popup
    // Purpose: 
    /*------------------------------------------------------------------------------------------------------*/
    function assemble_driver_popup(ref, data, season) {
        driverInfo.textContent = `${data.forename + " " + data.surname + " - " + data.dob}`;
        driverNationality.textContent = `${data.nationality}` ;
        driverMoreInfo.textContent = `Learn More`;
        driverMoreInfo.href = data.url;

        addFavoriteDriver.addEventListener("click", () => {
            favorited.drivers.push(data.forename + " " + data.surname);
            console.log(favorited.drivers);
        });

        fetch_driver_results(ref, season).then(data => { 
            console.log(data);
            driverTable.innerHTML = "";

            for (let driver of data) {
                const row = document.createElement("tr");
                row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
                
                const round = document.createElement("td");
                round.className = "px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white";
                round.textContent = driver.round;
                row.appendChild(round);
        
                const raceName = document.createElement("td");
                raceName.className = "px-6 py-4";
                raceName.textContent = driver.name;
                row.appendChild(raceName);
        
                const position = document.createElement("td");
                position.className = "px-6 py-4";
                position.textContent = driver.positionOrder;
                row.appendChild(position);

                const points = document.createElement("td");
                points.className = "px-6 py-4";
                points.textContent = "ask randy for this";
                row.appendChild(points);
        
                driverTable.appendChild(row);
            }
        });
    }
}
