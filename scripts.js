document.addEventListener('DOMContentLoaded', () => loadView("home"));

function loadView(view, season = null) {
    const container = document.querySelector("#container");


    if (view === "home") {

        showNavButtons(false);

        container.innerHTML = `        
            <div id = "content-area">
                <p> what this site is about blah blah box lorem upsum more words just to 
                    have an accurate representation more words more words just as an example
                    paragraph describing what this website does 
                </p>
                <div id = "select_szn">
                <h3> Season </h3>
                <select id = "season-select" > 
                    <option> Select season </option>
                    <option value=2020> 2020 </option>
                    <option value=2021> 2021 </option>
                    <option value=2022> 2022 </option>
                    <option value=2023> 2023 </option>
                </select>
                </div>
            </div>
            <img src="data/images/raceCarPhoto.webp" id="car_img"> <!-- Add a race car photo here -->`;

            const seasonSelect = document.querySelector("#season-select");
            seasonSelect.addEventListener("change", (e) => {
                const selectedSeason = e.target.value;
                if (selectedSeason) {
                    loadView("races", selectedSeason);
                }
            })
    }

    if (view === "races") {
        container.innerHTML = ``; /* This clears the home view */
        showNavButtons(true);

        const raceArray = [{year: 2020, round: 1, name:"Italian Grand Prix"}, {year: 2021, round: 1, name:"British Grand Prix"}];

        const races_container = document.createElement("div");
        races_container.id = "races_container";

        const titles = document.createElement("h3");
        titles.className = "titles";
        titles.textContent = `${season} Races`;

        const table = document.createElement("table");
        table.id = "races";

        const headerRow = document.createElement("tr");

        const roundColumn = document.createElement("th");
        roundColumn.textContent = "Round";

        const nameColumn = document.createElement("th");
        nameColumn.textContent = "Name";

        const resultColumn = document.createElement("th");
        nameColumn.textContent = "Results";


        headerRow.appendChild(roundColumn);
        headerRow.appendChild(nameColumn);
        headerRow.appendChild(resultColumn);


        table.appendChild(headerRow);

        for (let race of raceArray) {
            if (race.year == season) {
                const row = document.createElement("tr");

                const round = document.createElement("td");
                const name = document.createElement("td");
                /* needed for button later */
                const results = document.createElement("td");

                round.textContent = race.round;
                name.textContent = race.name;
                results.textContent = "View Results";

                row.appendChild(round);
                row.appendChild(name);
                row.appendChild(results);

                table.appendChild(row);

            }
        }
        races_container.appendChild(titles);
        races_container.appendChild(table);

        container.appendChild(races_container);

        /* Now the second div */
        const results_container = document.createElement("div");
        results_container.id = "results_container";

        const resultTitle = document.createElement("h3");
        resultTitle.className = "titles";
        resultTitle.textContent = `Results for ${season} Italian Grand Prix`;

        description = document.createElement("p");
        description.textContent = "Race Name, Round #, year, Circuit Name, Date URL (clean this up later)";

        const results = document.createElement("div");
        results.id = "results";

        results_container.appendChild(resultTitle);
        results_container.appendChild(description);
        results_container.appendChild(results);

        container.appendChild(results_container);
    }
}

function showNavButtons(show) {
    nav_buttons = ["Home", "Favorites"];
    const header = document.querySelector("header");
    
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