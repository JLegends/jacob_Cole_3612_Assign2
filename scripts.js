/* Known Issues 
    ==== TO DO =====
    Fix the modal popups in small width views being offscreen

    Improve the look of the images in results, probably will use a gradient for the
    background

    Make an is favorited function and then replace the code within the modal constructors to use it, we can also use it to 
    check if an item is in favorites and then if it is add some sort of styling to it when we add data

    I need to ask him tomorrow where to find the points for DRIVER POPUP

    lastly documentation needs to be completed
*/

const storedFavorites = JSON.parse(localStorage.getItem("favorited"));
const favorited = storedFavorites || {drivers: [], constructors: [], circuits: []}; //Check if any favorites stored otherwise default to empty

let currentResults = [];
let currentQualifyData = [];

let season = null; /* I need this globally accessible for the load_popup function */

document.addEventListener('DOMContentLoaded', init);

function init() { 

    const url = "https://www.randyconnolly.com/funwebdev/3rd/api/f1";
    const home = document.querySelector("#home_button");
    const favorites_button = document.querySelector("#favorites_button");

    const homeView = document.querySelector("#home_view");
    const raceView = document.querySelector("#race_view")
    const roundTitle = document.querySelector("#round_title")

    const raceButtonContainer = document.querySelector("#race_button_container")
    const roundContainer = document.querySelector("#round_container");
    const roundDataHeader = document.querySelector("#round_data_header");

    const raceDataContainer = document.querySelector("#race_data_container");

    const results = document.querySelector("#results_page");
    const qualifying = document.querySelector("#qualify_page");
    const qualifyContainer = document.querySelector("#qualify_container");
    let qualifyDataHeader = document.querySelector("#qualify_data_header");
    
    let resultsDataHeader = document.querySelector("#results_data_header");
    
    const resultTitle = document.querySelector("#results_title");
    const resultSubheader = document.querySelector("#results_subheader");

    const raceInfo1 = document.querySelector("#race_info1");
    const circuitName = document.querySelector("#circuit_name");
    const raceInfo2 = document.querySelector("#race_info2");


    const resultsTab = document.querySelector("#results_button");
    const qualifyTab = document.querySelector("#qualifying_button");
    const preResultsMessage = document.querySelector("#pre_results_message");
    const resultsContainer = document.querySelector("#results_container");

    const pdImg1q = document.querySelector("#pd1q");
    const pdImg2q = document.querySelector("#pd2q");
    const pdImg3q = document.querySelector("#pd3q");
    const pdImg1r = document.querySelector("#pd1r");
    const pdImg2r = document.querySelector("#pd2r");
    const pdImg3r = document.querySelector("#pd3r");

    const pdNameR1 = document.querySelector("#pdNameR1");
    const pdNameR2 = document.querySelector("#pdNameR2");
    const pdNameR3 = document.querySelector("#pdNameR3");
    const pdNameQ1 = document.querySelector("#pdNameQ1");
    const pdNameQ2 = document.querySelector("#pdNameQ2");
    const pdNameQ3 = document.querySelector("#pdNameQ3");

    const seasonSelect = document.querySelector("#season-select");

    const circuit = document.querySelector("#circuit");
    const driver = document.querySelector("#driver");
    const constructor = document.querySelector("#constructor");
    const favorites = document.querySelector("#favorites");

    const favDrivers = document.querySelector("#fav_drivers");
    const favConstructors = document.querySelector("#fav_constructors");
    const favCircuits = document.querySelector("#fav_circuits");
    const emptyFavorites = document.querySelector("#empty_favorites");

    let addFavoriteDriver = document.querySelector("#add_favorite_driver");
    let addFavoriteConst = document.querySelector("#add_favorite_const");
    let addFavoriteCirc = document.querySelector("#add_favorite_circ");


    const constName = document.querySelector("#const_name");
    const constNationality = document.querySelector("#const_nationality");
    const constMoreInfo = document.querySelector("#const_more_info");
    const constructorTable = document.querySelector("#constructor_table");

    const driverInfo = document.querySelector("#driver_info");
    const driverNationality = document.querySelector("#driver_nationality");
    const driverMoreInfo = document.querySelector("#driver_more_info");
    const driverTable = document.querySelector("#driver_table");

    const popupCircuitName = document.querySelector("#popup_circuit_name");
    const popupCircuitLocation = document.querySelector("#popup_circuit_location");
    const popupCircuitCountry = document.querySelector("#popup_circuit_country");
    const popupCircuitURL = document.querySelector("#popup_circuit_url");

    add_event_handlers();

    load_view("home");

    function fetch_race_season(season) {
        let request = `${url}/races.php?season=${season}`;
        return fetch_store_API_data(request); /*Returns a promise object*/
    }

    function fetch_season_results(season) {
        let request = `${url}/results.php?season=${season}`;
        fetch_store_API_data(request);
    }

    function fetch_season_qualifying(season) {
        let request = `${url}/qualifying.php?season=${season}`;
        fetch_store_API_data(request);
    }

    function fetch_circuit_name(circuitId) {
        let request = `${url}/circuits.php?id=${circuitId}`;
        return fetch_store_API_data(request);
    }

    function fetch_race_qualify(raceID, season) {
        const qualifyingJSON = localStorage.getItem(`${url}/qualifying.php?season=${season}`);
        
        if (!qualifyingJSON) {
            console.error("Qualifying data not found in localStorage for season:", season);
            return [];
        }
    
        try {
            const qualifyingData = JSON.parse(qualifyingJSON);
    
            // Filter the data to find results matching the given raceID
            const matchingResults = qualifyingData.filter(entry => entry.race.id === raceID);
            return matchingResults;
        } catch (error) {
            console.error("Error parsing qualifying data:", error);
            return [];
        }
    }

    function fetch_race_results(raceID, season) {
        const resultsJSON = localStorage.getItem(`${url}/results.php?season=${season}`);
        
        if (!resultsJSON) {
            console.error("results data not found in localStorage for season:", season);
            return [];
        }
    
        try {
            const resultsData = JSON.parse(resultsJSON);
    
            // Filter the data to find results matching the given raceID
            const matchingResults = resultsData.filter(entry => entry.race.id === raceID);
            return matchingResults;
        } catch (error) {
            console.error("Error parsing resulst data:", error);
            return [];
        }

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

    function fetch_circuit(circuitID) {
        let request = `${url}/circuits.php?id=${circuitID}`;
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

                if (request.includes("/races.php?season=") || request.includes("/results.php?season=") || request.includes("/qualifying.php?season=")) {
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
            set_visibility(raceDataContainer, false);
            set_visibility(preResultsMessage, true);
            seasonSelect.value = "SELECT"
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


        resultsContainer.addEventListener("click", load_popup);
        roundContainer.addEventListener("click", load_popup);
        qualifyContainer.addEventListener("click", load_popup);
        circuitName.addEventListener("click", load_popup);

        emptyFavorites.addEventListener("click", empty_favorite_table);
        

    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: list_season_races
    // Purpose: it creates the DOM elements for the season races block
    /*------------------------------------------------------------------------------------------------------*/
    function list_season_races(season) {
        /*container.style.border ="none";*/
        set_visibility(qualifying, false)
        set_visibility(raceDataContainer, false);
        set_visibility(preResultsMessage, true);
        roundTitle.textContent = `${season} Races`;
        roundContainer.textContent = "";

        show_loader(roundContainer, true, 6);

        fetch_race_season(season).then(data => {
            generate_rounds_table(data);
            roundDataHeader.addEventListener("click", (e) => sort_data(e, data));
        });
    
        fetch_season_qualifying(season);
        fetch_season_results(season);
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: generate_rounds_table
    // Purpose: generates the table of rounds that took place in a season
    /*------------------------------------------------------------------------------------------------------*/
    function generate_rounds_table(data) {
        let i = 0;
        show_loader(roundContainer, false);

        for (let race of data) {

            
            const row = document.createElement("tr");
            if(i % 2 == 0)
            {
                row.className = "bg-stone-50 border-b-red-700 border-b-4";
            }
            else
            {
                row.className = "bg-stone-300 border-b-red-700 border-b-4";
            }
            i++;
            const round = document.createElement("td");
            const name = document.createElement("td");

            const results = document.createElement("td");
            const resultsButton = document.createElement("button");
            const lineDiv = document.createElement("div");
            lineDiv.className = "h-4 w-[100%] bg-red-700 clip-diagonal-right"

            results.className = "";

            round.textContent = race.round;
            name.textContent = race.name;
            name.className = "hover:text-red-600 cursor-pointer";
            add_type_and_id(name, "circuit", race.circuit.id);

            resultsButton.textContent = "Results";
            resultsButton.className = " bg-red-700 text-white px-4 py-2 rounded-t-lg hover:bg-red-600";

            resultsButton.setAttribute("raceId", race.id); /*Stores the raceID as a attribute in the button so we know what race to get results for*/
            resultsButton.addEventListener("click", () => { 
                resultSubheader.innerHTML = '';
                show_loader(resultSubheader, true, 2);
                list_grandprix_results(race.id, race.name, race.year); 
                generate_results_subheader(race.circuit.id, round.textContent, race.date, race.url);
            });

            row.appendChild(round);
            row.appendChild(name);

            results.appendChild(resultsButton);
            row.appendChild(results);

            roundContainer.appendChild(row)
            roundContainer.appendChild(lineDiv);
        }
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: list_grandprix_results
    // Purpose: creates the DOM content for the selection grand prix results
    /*------------------------------------------------------------------------------------------------------*/
    function list_grandprix_results(raceID, raceName, season) {

        qualifyContainer.textContent = "";
        resultsContainer.textContent = "";

        set_visibility(preResultsMessage, false);
        set_visibility(raceDataContainer, true);

        resultTitle.textContent = `Results for ${season}, ${raceName}`;
        set_visibility(results, true);
        set_visibility(qualifying, false);

        // Replace and update resultsDataHeader
        const newResultsDataHeader = resultsDataHeader.cloneNode(true);
        resultsDataHeader.replaceWith(newResultsDataHeader);
        resultsDataHeader = newResultsDataHeader;
    
        // Replace and update qualifyDataHeader
        const newQualifyDataHeader = qualifyDataHeader.cloneNode(true);
        qualifyDataHeader.replaceWith(newQualifyDataHeader);
        qualifyDataHeader = newQualifyDataHeader;
    
        show_loader(resultsContainer, true, 4);
        
        const resultsData = fetch_race_results(raceID, season); //Generate results for the results page
        currentResults = resultsData;
        resultsDataHeader.addEventListener("click",  (e) => sort_data(e, resultsData));

        generate_results_table(resultsData);
        pdImg1r.src = `data/images/drivers/${resultsData[0].driver.ref}.avif`;
        pdImg2r.src = `data/images/drivers/${resultsData[1].driver.ref}.avif`;
        pdImg3r.src = `data/images/drivers/${resultsData[2].driver.ref}.avif`;
        pdNameR1.textContent = resultsData[0].driver.surname;
        pdNameR2.textContent = resultsData[1].driver.surname;
        pdNameR3.textContent = resultsData[2].driver.surname;
    
        const qualifyData = fetch_race_qualify(raceID, season) //Generate results for the qualifying page
        currentQualifyData = qualifyData;
        qualifyDataHeader.addEventListener("click",  (e) => sort_data(e, qualifyData));
        
        generate_qualify_table(qualifyData);
        pdImg1q.src = `data/images/drivers/${qualifyData[0].driver.ref}.avif`;
        pdImg2q.src = `data/images/drivers/${qualifyData[1].driver.ref}.avif`;
        pdImg3q.src = `data/images/drivers/${qualifyData[2].driver.ref}.avif`;
        pdNameQ1.textContent = qualifyData[0].driver.surname;
        pdNameQ2.textContent = qualifyData[1].driver.surname;
        pdNameQ3.textContent = qualifyData[2].driver.surname;



        resultsTab.addEventListener("click", ()=>{ //Add events to enable switching between the two pages
            //list_grandprix_results(race.id, race.name, season, "result"); 
            resultTitle.textContent = `Results for ${season}, ${raceName}`;
            set_visibility(results, true);
            set_visibility(qualifying, false);        
        })
        qualifyTab.addEventListener("click", ()=>{
            //list_grandprix_results(race.id, race.name, season, "qualifying"); 
            resultTitle.textContent = `Qualifying for ${season}, ${raceName}`;
            set_visibility(qualifying, true);
            set_visibility(results, false);

        })

    }

    function sort_data(e, data)
    {        
        const targetHeader = e.target.closest("[value]"); // Find the closest element with the "value" attribute
        if (!targetHeader) return; // Exit if no valid header is clicked
    
        const targetList = targetHeader.closest("thead"); // Find the closest <thead>
        if (!targetList) return; // Exit if no valid <thead> is found
        // closest function help from: https://www.w3schools.com/jsref/met_element_closest.asp
        let generateFunction;
        // Initialize sort direction and argument if not set
        if(!targetList.hasAttribute("sortDirection"))
        {
            targetList.setAttribute("sortDirection", "asc"); //Setting to ascending first
        }
        if(!targetList.hasAttribute("sortArg"))
        {
            targetList.setAttribute("sortArg", "Position");
        }
        if(targetList.id == "results_data_header")
        {
            resultsContainer.textContent = "";
            generateFunction = generate_results_table;
        }
        else if(targetList.id == "qualify_data_header")
        {
            qualifyContainer.textContent = "";
            generateFunction = generate_qualify_table;
        }
        else if(targetList.id == "round_data_header")
        {
            roundContainer.textContent = "";
            generateFunction = generate_rounds_table;
        }
        
        sortArg = targetHeader.getAttribute("value"); //Get the sortArg, has to be an attribute and can't use text content because we will add items to the header
        console.log("in sort");
        console.dir(e);

        console.log("sort arg");
        console.log(sortArg);


        if(sortArg != targetList.getAttribute("sortArg")) //If we are switching to a different category we also want to sort by ascending
        {
            targetList.setAttribute("sortDirection", "asc");
        }

        const sortDirection = targetList.getAttribute("sortDirection");
        const isDescending = sortDirection === "dsc";

        const compare = (a, b) => { //Had help from here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_operator, initally this was a bunch of if else
            if(sortArg == "Name") return isDescending
                ? b.driver.forename.localeCompare(a.driver.forename)
                : a.driver.forename.localeCompare(b.driver.forename);
            if(sortArg == "Position") return isDescending ? b.position - a.position : a.position - b.position;
            if(sortArg == "Constructor") return isDescending
                ? b.constructor.name.localeCompare(a.constructor.name)
                : a.constructor.name.localeCompare(b.constructor.name);
            if(sortArg == "Laps") return isDescending ? b.laps - a.laps : a.laps - b.laps;
            if(sortArg == "Points") return isDescending ? b.points - a.points : a.points - b.points;
            if(sortArg.includes('q')) {
                return isDescending
                    ? timeToSeconds(b[sortArg]) - timeToSeconds(a[sortArg])
                    : timeToSeconds(a[sortArg]) - timeToSeconds(b[sortArg]);
            }
            if(sortArg == "Round") return isDescending ? b.round - a.round : a.round - b.round;
            if(sortArg == "RaceName") return isDescending
                ? b.name.localeCompare(a.name)
                : a.name.localeCompare(b.name);
            return 0;
        };

        data.sort(compare);

        // Toggle sort direction 
        targetList.setAttribute("sortDirection", isDescending ? "asc" : "dsc");
        targetList.setAttribute("sortArg", sortArg);

        generateFunction(data);
        add_sort_icon(targetHeader, isDescending);
    }
    function add_sort_icon(targetHeader, isDescending)
    {
        const headers = targetHeader.parentElement.children;
        Array.from(headers).forEach(header => {
            const icon = header.querySelector("span");
            if (icon) header.removeChild(icon);
        });
        const newIcon = document.createElement("span");
        newIcon.textContent = "^";
        newIcon.className = isDescending ? "ml-1 inline-block font-bold rotate-180" : " ml-1 font-bold inline-block"
        targetHeader.appendChild(newIcon);  
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: timeToSeconds
    // Purpose: Necessary to convert the strings from q1,q2,q3, to float numbers so that we can compare the values
    /*------------------------------------------------------------------------------------------------------*/

    function timeToSeconds(time) {
        if(time == null)
        {
            return 1000; //Return a large number so that times with no entries aren't considered in comparisons
        }
        const [minutes, seconds] = time.split(':');
        return parseFloat(minutes) * 60 + parseFloat(seconds);
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
            name.className = "hover:text-red-600 cursor-pointer";
            name.textContent = qualify.driver.forename + " " + qualify.driver.surname;

            const isDriverFavorited = favorited.drivers.some(driver => driver.ref === qualify.driver.ref);

            if (isDriverFavorited) {
                const heartIcon = document.createElement("span");
                heartIcon.className = "fa fa-heart fa-lg ml-2 text-red-600";
                name.appendChild(heartIcon);
            }

            add_type_and_id(name, "driver", qualify.driver.ref);
            row.appendChild(name);

            const constructor = document.createElement("td");
            constructor.className = "hover:text-red-600 cursor-pointer";
            constructor.textContent = qualify.constructor.name;

            const isConstructorFavorited = favorited.constructors.some(constructor => constructor.ref === qualify.constructor.ref);

            if (isConstructorFavorited) {
                const heartIcon = document.createElement("span");
                heartIcon.className = "fa fa-heart fa-lg ml-2 text-red-600";
                constructor.appendChild(heartIcon);
            }

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
        show_loader(resultsContainer, false);

        for (let result of results) {
            const row = document.createElement("tr");
            row.className = "odd: bg-stone-150 even:bg-stone-300"
            const pos = document.createElement("td");
            pos.textContent = result.position;
            row.appendChild(pos);

            const name = document.createElement("td");
            name.className = "hover:text-red-600 cursor-pointer";
            name.textContent = result.driver.forename + " " + result.driver.surname;

            const isDriverFavorited = favorited.drivers.some(driver => driver.ref === result.driver.ref);

            if (isDriverFavorited) {
                const heartIcon = document.createElement("span");
                heartIcon.className = "fa fa-heart fa-lg ml-2 text-red-600";
                name.appendChild(heartIcon);
            }
            
            add_type_and_id(name, "driver", result.driver.ref);
            row.appendChild(name);

            const constructor = document.createElement("td");
            constructor.className = "hover:text-red-600 cursor-pointer"
            constructor.textContent = result.constructor.name;

            const isConstructorFavorited = favorited.constructors.some(constructor => constructor.ref === result.constructor.ref);

            if (isConstructorFavorited) {
                const heartIcon = document.createElement("span");
                heartIcon.className = "fa fa-heart fa-lg ml-2 text-red-600";
                constructor.appendChild(heartIcon);
            }

            add_type_and_id(constructor, "constructor", result.constructor.ref);
            row.appendChild(constructor);

            const laps = document.createElement("td");
            laps.textContent = result.laps;
            row.appendChild(laps);

            const pts = document.createElement("td");
            pts.textContent = result.points;
            row.appendChild(pts);

            resultsContainer.appendChild(row);
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

        console.log(`Loading popup for type: ${type}, ref: ${ref}`);
        console.log("Favorited:", favorited);

        if (type == "driver") {
            driver.showModal();
            driverTable.innerHTML = "";
            show_loader(driverTable, true, 4);
            fetch_driver(ref, season).then(data => {
                assemble_driver_popup(ref, data, season);
            });
        }
        else if(type == "circuit")
        {
            circuit.showModal();
            popupCircuitName.innerHTML = "";
            popupCircuitLocation.innerHTML = "";
            popupCircuitCountry.innerHTML = "";
            popupCircuitURL.innerHTML = "";

            show_loader(popupCircuitName, true, 4);
            fetch_circuit(ref).then(data => {
                assemble_circuit_popup(ref, data);
            });
        }
        else if (type == "constructor") {
            constructor.showModal();
            constructorTable.innerHTML = "";
            show_loader(constructorTable, true, 4);
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
    function generate_results_subheader(circuitId, raceRound, raceDate, raceUrl) {
        fetch_circuit_name(circuitId).then(data => {
            show_loader(resultSubheader, false);

            raceInfo1.textContent = `Round ${raceRound} - ${raceDate} - `;
            circuitName.textContent = data.name;
            add_type_and_id(circuitName, "circuit", circuitId);
            raceInfo2.textContent = " - Learn More";

            const link = document.createElement("a");
            link.href = raceUrl;
            link.appendChild(raceInfo2);

            resultSubheader.appendChild(raceInfo1);
            resultSubheader.appendChild(circuitName);
            resultSubheader.appendChild(link);
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
            
            element.className = "px-6 py-4 font-medium text-gray-900 dark:text-white truncate";
            element.textContent = `${driver.forename} ${driver.surname}`;

            const buttonContainer = document.createElement("td");
            const deleteButton = document.createElement("button");
            buttonContainer.className = "text-right"
            
            add_type_and_id(deleteButton, "drivers", driver.ref);
  
            deleteButton.className = "px-3 py-2 mr-2 rounded-full bg-gray-900 font-thin hover:bg-red-500 hover:font-bold hover:text-white focus:ring-4 ring-red-400 transition-all ease-in-out";
            deleteButton.textContent = "X";
            deleteButton.addEventListener("click", remove_favorite);
            buttonContainer.appendChild(deleteButton);
            
            row.appendChild(element);
            row.appendChild(buttonContainer);
            favDrivers.appendChild(row);
        }

        for (let constructor of favorited.constructors) {
            const row = document.createElement("tr");
            row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
            const element = document.createElement("td");
            
            element.className = "px-6 py-4 font-medium text-gray-900 dark:text-white truncate";
            element.textContent = constructor.name; 
            
            const buttonContainer = document.createElement("td");
            const deleteButton = document.createElement("button");
            buttonContainer.className = "text-right";
            

            add_type_and_id(deleteButton, "constructors", constructor.ref);
            deleteButton.className = "px-3 py-2 mr-2 rounded-full bg-gray-900 font-thin hover:bg-red-500 hover:font-bold hover:text-white focus:ring-4 ring-red-400 transition-all ease-in-out";
            deleteButton.textContent = "X";
            deleteButton.addEventListener("click", remove_favorite);
            buttonContainer.appendChild(deleteButton);
            
            row.appendChild(element);
            row.appendChild(buttonContainer);
            favConstructors.appendChild(row);
        }

        for (let circuit of favorited.circuits) {
            const row = document.createElement("tr");
            row.className = "bg-white border-b dark:bg-gray-800 dark:border-gray-700";
    
            const element = document.createElement("td");
            element.className = "px-6 py-4 font-medium text-gray-900 dark:text-white truncate";
            element.textContent = circuit.name;

            const buttonContainer = document.createElement("td");
            const deleteButton = document.createElement("button");
            buttonContainer.className = "text-right";

            add_type_and_id(deleteButton, "circuits", circuit.ref);
            deleteButton.className = "px-3 py-2 mr-2 rounded-full bg-gray-900 font-thin hover:bg-red-500 hover:font-bold hover:text-white focus:ring-4 ring-red-400 transition-all ease-in-out";
            deleteButton.textContent = "X";
            deleteButton.addEventListener("click", remove_favorite);

            buttonContainer.appendChild(deleteButton);
            row.appendChild(element);
            row.appendChild(buttonContainer)            
            favCircuits.appendChild(row);
        }
        store_favorite_table();
        console.log(favorited);
    }

    function store_favorite_table()
    {
        console.log("Storing favorites:", favorited);

        favorited.drivers.sort((a, b) => a.forename.localeCompare(b.forename));
        favorited.constructors.sort((a, b) => a.name.localeCompare(b.name));
        favorited.circuits.sort((a, b) => a.name.localeCompare(b.name));

        localStorage.setItem("favorited", JSON.stringify(favorited));
    }

    
    /*--------------------------------------------------------------------------------------------------------
    // Name: assemble_constructor_popup
    // Purpose: empty the favorites table, this function should only be called while the favorites modal is open 
    /*------------------------------------------------------------------------------------------------------*/
    function empty_favorite_table()
    {
        for(array in favorited)
        {
            favorited[array].length = 0;
        }

        localStorage.removeItem("favorited");
        favDrivers.innerHTML = "";
        favConstructors.innerHTML = "";
        favCircuits.innerHTML = "";
        console.log("Favorites table emptied");
        console.log(favorited);

        resultsContainer.innerHTML = ""; // Clear existing content
        qualifyContainer.innerHTML = ""; // Clear existing content

        generate_results_table(currentResults);
        generate_qualify_table(currentQualifyData);
    }


    /*--------------------------------------------------------------------------------------------------------
    // Name: remove_favorite(type)
    // Purpose: remove a single favorited item from the list.
    /*------------------------------------------------------------------------------------------------------*/
    function remove_favorite(e)
    {        
        const type = e.target.getAttribute("type");
        const ref = e.target.getAttribute("ref");
        const targetArray = favorited[type];
        const index = targetArray.findIndex(item => item.ref == ref); 
        
        console.log("In remove favorite")
        console.log("Index: ", index);
        console.log("array before splice, ", targetArray);
        if(index != -1)
        {
            targetArray.splice(index, 1);
        }
        console.log("array after splice, ", targetArray);
        
        store_favorite_table();                
        generate_favorite_tables();

        if (resultsContainer) {
            resultsContainer.innerHTML = "";
            generate_results_table(currentResults);
        }
        else {
            console.log("undefined res container");
        }
        
        if (qualifyContainer) {
            qualifyContainer.innerHTML = "";
            generate_qualify_table(currentQualifyData);
        }
        else {
            console.log("undefined qualif container");
        }
    }

    /*--------------------------------------------------------------------------------------------------------
    // Name: add_fav_button_event
    // Purpose: remove a single favorited item from the list.
    /*------------------------------------------------------------------------------------------------------*/
    function add_fav_button_event(type, itemFavorited, data, ref)
    {                              
        console.log("in add fav button");
        console.log("type: ", type, "itemFavorited", itemFavorited, "data: ", data, "ref: ", ref);
        let button; //Local button variable to generalize for each popup
        if(type == "drivers")
        {
            const newButton = addFavoriteDriver.cloneNode(true); //This is necessary to remove the previous event handlers associated with the button, we also need to do this within add_fav_button_event so that we can have our local button variable actually refer to the correct global DOM element
            addFavoriteDriver.replaceWith(newButton);
            addFavoriteDriver = newButton; 
            button = addFavoriteDriver;
        }
        else if(type == "constructors")
        {
            const newButton = addFavoriteConst.cloneNode(true); 
            addFavoriteConst.replaceWith(newButton);
            addFavoriteConst = newButton; 
            button = addFavoriteConst;
        }
        else if(type == "circuits")
        {
            const newButton = addFavoriteCirc.cloneNode(true); 
            addFavoriteCirc.replaceWith(newButton);
            addFavoriteCirc = newButton; 
            button = addFavoriteCirc;
        }
        add_type_and_id(button, type, ref);
        button.textContent = "";
        if(!itemFavorited)
        {
            button.textContent = "Add to Favorites";
            button.addEventListener("click", () => {      
                if(type == "constructors")
                {
                    const constructor = {
                        name: data.name,
                        ref: ref,
                    };
                    favorited.constructors.push(constructor);
                }
                else if(type == "drivers")
                {
                    const driver = {
                        forename: data.forename,
                        surname: data.surname,
                        ref: ref,
                    };
                    
                    favorited.drivers.push(driver);
                }
                else if(type == "circuits")
                {
                    const circuit = {
                        name: data.name,
                        ref: ref,
                    };
                        
                    favorited.circuits.push(circuit);
                }
                store_favorite_table();               
                add_fav_button_event(type, true, data, ref);
            });
    
        }
        else
        {
            button.textContent = "Remove from Favorites";
            button.addEventListener("click", (e) => {  
                remove_favorite(e);

                add_fav_button_event(type, false, data, ref);
            });
        }     

        resultsContainer.innerHTML = ""; // Clear existing content
        qualifyContainer.innerHTML = ""; // Clear existing content

        generate_results_table(currentResults);
        generate_qualify_table(currentQualifyData);
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

        const itemFavorited = favorited.constructors.some(constructor => constructor.name === data.name);        
        add_fav_button_event("constructors", itemFavorited, data, ref);

        fetch_constructor_results(ref, season).then(data => { 

            show_loader(constructorTable, false);
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
    // Name: assemble_driver_popup
    // Purpose: 
    /*------------------------------------------------------------------------------------------------------*/
    function assemble_driver_popup(ref, data, season) {
        driverInfo.textContent = `${data.forename + " " + data.surname + " - " + data.dob}`;
        driverNationality.textContent = `${data.nationality}` ;
        driverMoreInfo.textContent = `Learn More`;
        driverMoreInfo.href = data.url;

        const driverImage = document.querySelector('#driver_image');
        driverImage.src = `data/images/drivers/${ref}.avif`;
        driverImage.alt = `${data.forename} ${data.surname}`;

        const itemFavorited = favorited.drivers.some(driver => driver.forename === data.forename && driver.surname === data.surname)
        add_fav_button_event("drivers", itemFavorited, data, ref);

        fetch_driver_results(ref, season).then(data => { 

            show_loader(driverTable, false);

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

    /*--------------------------------------------------------------------------------------------------------
    // Name: assemble_circuit_popup
    // Purpose: 
    /*------------------------------------------------------------------------------------------------------*/
    function assemble_circuit_popup(ref, data)
    {
        show_loader(popupCircuitName, false);

        popupCircuitName.textContent = data.name;
        popupCircuitLocation.textContent = data.location;
        popupCircuitCountry.textContent = data.country;
        popupCircuitURL.href = data.url;
        popupCircuitURL.textContent = "Learn More";

        const itemFavorited = favorited.circuits.some(circuit => circuit.name === data.name);        
        add_fav_button_event("circuits", itemFavorited, data, ref);
    } 

    function show_loader(parentNode, visibility, size) {
        /* HTML for loader found here: https://uiverse.io/devAaus/funny-catfish-94 */
        const loader = document.querySelector(`#${parentNode.id} #spinner`);
        console.log(parentNode.id + loader);
        if(visibility) {
            const spinner_container = document.createElement("div");
            spinner_container.id = "spinner";
            spinner_container.className = "flex w-full h-full left-1/2 top-1/2 items-center justify-center";

            const blue_spinner = document.createElement("div");
            blue_spinner.className = `w-${(size * 4)} h-${(size * 4)} border-4 border-transparent text-gray-900 text-4xl animate-spin flex items-center justify-center border-t-gray-700 rounded-full`;

            const red_spinner = document.createElement("div");
            red_spinner.className = `w-${(size-1) * 4} h-${(size-1) * 4} border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-600 rounded-full`;

            blue_spinner.appendChild(red_spinner);
            spinner_container.appendChild(blue_spinner);
            parentNode.appendChild(spinner_container);

        }
        else if (loader) {
            parentNode.removeChild(loader);
        }
    }
}



