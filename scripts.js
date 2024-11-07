document.addEventListener('DOMContentLoaded', () => loadView("home"));

function loadView(view) {
    const container = document.querySelector("#container");
    if (view === "home") {
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
                    <option value=2020"> 2020 </option>
                    <option value=2021"> 2021 </option>
                    <option value=2022"> 2022 </option>
                    <option value=2023"> 2023 </option>
                </select>
                </div>
            </div>
            <img src="data/images/raceCarPhoto.webp" id="car_img"> <!-- Add a race car photo here -->`;

            const seasonSelect = document.querySelector("#season-select");
            seasonSelect.addEventListener("change", (e) => {
                const selectedSeason = e.target.value;
                if (selectedSeason) {
                    loadView("races");
                }
            })
    }

    if (view === "races") {
        container.innerHTML = `        
        <div id = "races_container">
            <h3 class="titles"> ${value} Races </h3>
            <div id = "races">
                <h4> Round </h4>
                <h4> Name </h4>
            </div>
        </div>
        <div id = "results_container">
            <h3 class="titles"> Results for 2023 Italian Grand Prix </h3>
            <p> Race Name, Round #, year, Circuit Name, Date URL (clean this up later) </p>
            <div id = "results">
            </div>
        </div>`
    }
}