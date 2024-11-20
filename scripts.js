/* Known Issues 
    ==== TO DO =====
    sorting by the selected table header
    
    would be nice to add loading icons for when we're grabbing data or something is loading. Could add to the
    race table, result table, modal popups and the modal popup button so it doesn't switch from add favorite to remove
    while it checks!

    Improve the look of the images in results plus add the same image to the driver cards, probably will use a gradient for the
    background

    Make an is favorited function and then replace the code within the modal constructors to use it, we can also use it to 
    check if an item is in favorites and then if it is add some sort of styling to it when we add data

    new bug discovered (2023 - Saudi Arabian Grand Prix - Guanyu Zhou & Nyck de Vries break for some reason?)

    new bug - if you flip quickly between qualify and results tabs (before they finish loading) you can duplicate table info

*/
const storedFavorites = JSON.parse(localStorage.getItem("favorited"));
const favorited = storedFavorites || {drivers: [], constructors: [], circuits: []}; //Check if any favorites stored otherwise default to empty

const TEXT_RED_HOVER = "hover:text-red-600 cursor-pointer";

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

    const raceDataContainer = document.querySelector("#race_data_container");

    const results = document.querySelector("#results_page");
    const qualifying = document.querySelector("#qualify_page");
    const qualifyContainer = document.querySelector("#qualify_container");
    const qualifyDataHeader = document.querySelector("#qualify_data_header");
    
    const resultsDataHeader = document.querySelector("#results_data_header");
    
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
            name.className = TEXT_RED_HOVER;
            add_type_and_id(name, "circuit", race.circuit.id);

            resultsButton.textContent = "Results";
            resultsButton.className = "bg-red-700 text-white px-4 py-2 rounded-t-lg hover:bg-red-600";
            resultsButton.setAttribute("raceId", race.id); /*Stores the raceID as a attribute in the button so we know what race to get results for*/
            resultsButton.addEventListener("click", () => { 
                list_grandprix_results(race.id, race.name, season); 
                generate_results_subheader(race.circuit.id, round.textContent, race.date, race.url);
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
    function list_grandprix_results(raceID, raceName, season) {

        qualifyContainer.textContent = "";
        resultsContainer.textContent = "";

        set_visibility(preResultsMessage, false);
        set_visibility(raceDataContainer, true);

        resultTitle.textContent = `Results for ${season}, ${raceName}`;
        set_visibility(results, true);
        set_visibility(qualifying, false);

        fetch_race_results(raceID).then(data => { //Generate results for the results page
            resultsDataHeader.addEventListener("click",  (e) => sort_data(e, data));
            
            generate_results_table(data);
            pdImg1r.src = `data/images/drivers/${data[0].driver.ref}.avif`;
            pdImg2r.src = `data/images/drivers/${data[1].driver.ref}.avif`;
            pdImg3r.src = `data/images/drivers/${data[2].driver.ref}.avif`;
        });
    
        fetch_race_qualify(raceID).then(data => { //Generate results for the qualifying page
            qualifyDataHeader.addEventListener("click",  (e) => sort_data(e, data));
            
            generate_qualify_table(data);
            pdImg1q.src = `data/images/drivers/${data[0].driver.ref}.avif`;
            pdImg2q.src = `data/images/drivers/${data[1].driver.ref}.avif`;
            pdImg3q.src = `data/images/drivers/${data[2].driver.ref}.avif`;
        });


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
        const targetList = e.currentTarget;
        let generateFunction;
        if(!targetList.hasAttribute("sortDirection"))
        {
            targetList.setAttribute("sortDirection", "dsc"); //Setting to descending first because we want to sort by ascending initally
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
        sortArg = e.target.textContent;
        if(sortArg != targetList.getAttribute("sortArg")) //If we are switching to a different category we also want to sort by ascending
        {
            targetList.setAttribute("sortDirection", "dsc");
        }
        
        console.log("Sort arg:");
        console.log(sortArg);
        //When this event is triggered it should sort by ascending by checking if the targetList is already sorting by decending and vice versa.
        if(targetList.getAttribute("sortDirection") == "dsc")
        {
            if(sortArg == "Name")
            {
                data.sort((a, b) => a.driver.forename.localeCompare(b.driver.forename));
                targetList.setAttribute("sortArg", "Name");
            }
            else if(sortArg == "Position")
            {
                data.sort((a, b) => a.position - b.position);
                targetList.setAttribute("sortArg", "Position");
            }
            else if(sortArg == "Constructor")
            {
                data.sort((a, b) => a.constructor.name.localeCompare(b.constructor.name));
                targetList.setAttribute("sortArg", "Constructor");
            }
            else if(sortArg == "Laps")
            {
                data.sort((a, b) => a.laps - b.laps);
                targetList.setAttribute("sortArg", "Laps");
            }
            else if(sortArg == "Points")
            {
                data.sort((a, b) => a.points - b.points);
                targetList.setAttribute("sortArg", "Points");
            }
            else if(sortArg.includes('Q'))
            {                
                const num = sortArg.charAt(1);
                const key = "q" + num; // q1, q2, q3
                data.sort((a, b) => timeToSeconds(a[key]) - timeToSeconds(b[key]));
                targetList.setAttribute("sortArg", "Q" + num);
            }

            targetList.setAttribute("sortDirection", "asc");
        }
        else if(targetList.getAttribute("sortDirection") == "asc")
        {
            console.log("sort by descending");
            if(sortArg == "Name")
            {
                data.sort((a, b) => b.driver.forename.localeCompare(a.driver.forename));
                targetList.setAttribute("sortArg", "Name");
            }
            else if(sortArg == "Position")
            {
                data.sort((a, b) => b.position - a.position);
                targetList.setAttribute("sortArg", "Position");
            }
            else if(sortArg == "Constructor")
            {
                data.sort((a, b) => b.constructor.name.localeCompare(a.constructor.name));
                targetList.setAttribute("sortArg", "Constructor");
            }
            else if(sortArg == "Laps")
            {
                data.sort((a, b) => b.laps - a.laps);
                targetList.setAttribute("sortArg", "Laps");
            }
            else if(sortArg == "Points")
            {
                data.sort((a, b) => b.points - a.points);
                targetList.setAttribute("sortArg", "Points");
            }
            else if(sortArg.includes('Q'))
            {               
                const num = sortArg.charAt(1);
                const key = "q" + num; // q1, q2, q3
                data.sort((a, b) => timeToSeconds(b[key]) - timeToSeconds(a[key]));
                targetList.setAttribute("sortArg", "Q" + num);
            }
            
            targetList.setAttribute("sortDirection", "dsc");
        }
        console.log("this is the data as given to the generate function");
        console.dir(data);
        generateFunction(data);
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
            name.className = TEXT_RED_HOVER;
            name.textContent = qualify.driver.forename + " " + qualify.driver.surname;
            add_type_and_id(name, "driver", qualify.driver.ref);
            row.appendChild(name);

            const constructor = document.createElement("td");
            constructor.className = TEXT_RED_HOVER;
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
            name.className = TEXT_RED_HOVER;
            name.textContent = result.driver.forename + " " + result.driver.surname;
            add_type_and_id(name, "driver", result.driver.ref);
            row.appendChild(name);

            const constructor = document.createElement("td");
            constructor.className = TEXT_RED_HOVER;
            constructor.textContent = result.constructor.name;
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

        if (type == "driver") {
            driver.showModal();
            fetch_driver(ref, season).then(data => {
                assemble_driver_popup(ref, data, season);
            });
        }
        else if(type == "circuit")
        {
            circuit.showModal();
            fetch_circuit(ref).then(data => {
                assemble_circuit_popup(ref, data);
            });
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
    function generate_results_subheader(circuitId, raceRound, raceDate, raceUrl) {
        fetch_circuit_name(circuitId).then(data => {
            raceInfo1.textContent = `Round ${raceRound} - ${raceDate} - `;
            circuitName.textContent = data.name;
            console.log(circuitId);
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
            
            element.className = "px-6 py-6 font-medium text-gray-900 dark:text-white truncate";
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
            
            element.className = "px-6 py-6 font-medium text-gray-900dark:text-white truncate";
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
            element.className = "px-6 py-6 font-medium text-gray-900 dark:text-white truncate";
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
    }
    /*--------------------------------------------------------------------------------------------------------
    // Name: remove_favorite(type)
    // Purpose: remove a single favorited item from the list.
    /*------------------------------------------------------------------------------------------------------*/


    function remove_favorite(e)
    {        
        const targetArray = favorited[e.target.getAttribute("type")];
        const index = targetArray.findIndex(item => item.ref == e.target.getAttribute("ref")); 
        if(index != -1)
        {
            targetArray.splice(index, 1);
        }
        generate_favorite_tables();
    }

    function add_fav_button_event(button, type, itemFavorited, data, ref)
    {                
        const newButton = button.cloneNode(true); //This is necessary to remove the previous event handlers associated with the button
        button.replaceWith(newButton);
        button = newButton;

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
                add_fav_button_event(button, type, true, data, ref);
            });
    
        }
        else
        {
            button.textContent = "Remove from Favorites";
            button.addEventListener("click", (e) => {  
                remove_favorite(e);
                store_favorite_table();                
                add_fav_button_event(button, type, false, data, ref);
            });
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

        const itemFavorited = favorited.constructors.some(constructor => constructor.name === data.name);
        add_fav_button_event(addFavoriteConst, "constructors", itemFavorited, data, ref);

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
    // Name: assemble_driver_popup
    // Purpose: 
    /*------------------------------------------------------------------------------------------------------*/
    function assemble_driver_popup(ref, data, season) {
        driverInfo.textContent = `${data.forename + " " + data.surname + " - " + data.dob}`;
        driverNationality.textContent = `${data.nationality}` ;
        driverMoreInfo.textContent = `Learn More`;
        driverMoreInfo.href = data.url;

        const itemFavorited = favorited.drivers.some(driver => driver.forename === data.forename && driver.surname === data.surname)
        add_fav_button_event(addFavoriteDriver, "drivers", itemFavorited, data, ref);

        fetch_driver_results(ref, season).then(data => { 
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

    /*--------------------------------------------------------------------------------------------------------
    // Name: assemble_circuit_popup
    // Purpose: 
    /*------------------------------------------------------------------------------------------------------*/
    function assemble_circuit_popup(ref, data)
    {
        popupCircuitName.textContent = data.name;
        popupCircuitLocation.textContent = data.location;
        popupCircuitCountry.textContent = data.country;
        popupCircuitURL.href = data.url;

        const itemFavorited = favorited.circuits.some(circuit => circuit.name === data.name);
        add_fav_button_event(addFavoriteCirc, "circuits", itemFavorited, data, ref);
    }
}


