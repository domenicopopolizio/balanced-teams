

class Player {
    constructor(name, age, gen, strength, troublemaker, id) {
        this.name = name || "No Name";
        this.age = age || 0;
        this.gen = gen || "U";
        this.strength = strength !== undefined ? strength : 50;
        this.tm = troublemaker !== undefined ? troublemaker : false;

        let template = document.getElementById('player-template');
        let templateContent = template.content;



        if (id) {

            this.id = id;
            this.el = document.getElementById(id);


        }
        if (!this.el || !this.id) {
            this.el = templateContent.cloneNode(true);

            this.id = uuidv1();
            this.el.firstElementChild.setAttribute("id", this.id);

            let nameEl = this.el.querySelector(".player-name");
            nameEl.innerHTML = this.name;


            let genEl = this.el.querySelector(".player-gen");
            genEl.innerHTML = this.gen;

            let strengthEl = this.el.querySelector(".player-strength");
            strengthEl.innerHTML = this.strength + "%";


            if (this.age >= 0) {
                let ageEl = this.el.querySelector(".player-age");
                ageEl.innerHTML = this.age;
            }
            else {
                let ageEl = this.el.querySelector(".player-age");
                ageEl.parentElement.style.display = "none";
            }
            if (!this.tm) {
                let tmEl = this.el.querySelector(".player-tm");
                tmEl.style.display = "none";
            }

            let delEl = this.el.querySelector(".clear-user-icon");
            delEl.addEventListener("click", this.delete.bind(this));
        }

    }

    delete() {
        let i = myIndexOf(players, this);
        if (i > -1) {

            this.el.remove();

            let divPlayers = document.querySelector("#players");
            if (divPlayers.children.length == 0) {
                divPlayers.innerHTML = '';
            }
            players.splice(i, 1);
        }


    }


    AddPlayer() {

        let divPlayers = document.querySelector("#players");
        divPlayers.insertBefore(this.el, divPlayers.firstElementChild);
        this.el = document.getElementById(this.id);
    }


    get level() {
        return ((4 / 100) * this.strength) - 2 + this.age;
    }
}
Player.prototype.toString = function () {
    return '<span>' + this.name +
        ' ( ' + (this.age > 0 ? this.age + ', ' : '') +
        this.gen + ', ' +
        this.strength +
        '%' + (this.tm ? ', tm' : '') +
        ' ) </span><br>';
};



const randrange = (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);

const teamLevel = (a, b) => a + b.level;
let players = [
];

function myIndexOf(arr, o) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === o.id) {
            return i;
        }
    }
    return -1;
}


function shuffle(arr) {
    let oldarr = [];
    let newarr = [];
    for (let p of arr) {
        let op = JSON.parse(JSON.stringify(p));

        oldarr.push(new Player(op.name, op.age, op.gen, op.strength, op.tm, op.id));
    }
    while (oldarr.length > 0) {
        index = randrange(0, oldarr.length - 1);
        newarr.push(oldarr[index]);
        oldarr.splice(index, 1);
    }

    return newarr;
}

function hardCopy(arr) {
    let oldarr = [];
    for (let p of arr) {
        let op = JSON.parse(JSON.stringify(p));

        oldarr.push(new Player(op.name, op.age, op.gen, op.strength, op.tm, op.id));
    }

    return oldarr;
}

function createTeams(players, teamsN) {

    players.sort((a, b) => a.level < b.level ? 1 : -1);

    let teams = [];
    for (let t = 0; t < teamsN; t++) {
        teams.push([]);
    }
    let i = 0;
    while (i < players.length) {
        teams[i % teamsN].push(players[i]);
        i++;
    }

    return teams;
}

function mergeTeams(A, B) {
    teams = new Array(A.length);

    A.sort((a, b) => a.reduce(teamLevel, 0) * a.length > b.reduce(teamLevel, 0) * b.length ? 1 : -1);
    B.sort((a, b) => a.reduce(teamLevel, 0) * a.length > b.reduce(teamLevel, 0) * b.length ? 1 : -1);
    B.reverse();
    //console.log(A,B)
    for (let t = 0; t < teams.length; t++) {
        teams[t] = A[t].concat(B[t]);
    }

    return teams;
}

function createTeamsMain(players, NTeams) {
    let playersShuffled = hardCopy(players); //shuffle(players); //in questo modo è consistente, e con la stessa lista mi da le stesse squadre ;)

    let M = playersShuffled.filter(p => p.gen == "M" && !p.tm);
    let MTM = playersShuffled.filter(p => p.gen == "M" && p.tm);

    let F = playersShuffled.filter(p => p.gen == "F" && !p.tm);
    let FTM = playersShuffled.filter(p => p.gen == "F" && p.tm);


    let MTeams = createTeams(M, NTeams);
    let MTMTeams = createTeams(MTM, NTeams);
    let AllMTeams = mergeTeams(MTeams, MTMTeams);

    let FTeams = createTeams(F, NTeams);
    let FTMTeams = createTeams(FTM, NTeams);
    let AllFTeams = mergeTeams(FTeams, FTMTeams);

    let teams = mergeTeams(AllMTeams, AllFTeams);

    for (let t of teams) {
        t.sort((a, b) => a.level < b.level ? 1 : -1);
    }
    teams.sort((a, b) => a.reduce(teamLevel, 0) * a.length < b.reduce(teamLevel, 0) * b.length ? 1 : -1)


    return teams;
}



function addPlayer() {
    let inputName = document.querySelector("#name");
    let inputAge = document.querySelector("#age");
    let inputM = document.querySelector("#radio-M");
    let inputF = document.querySelector("#radio-F");
    let inputTM = document.querySelector("#tm-checkbox");
    let inputStrength = document.querySelector("#strength");

    let name = inputName.value;
    let age = parseInt(inputAge.value) || -2;
    let gen = inputM.checked ? "M" : "F";
    let TM = inputTM.checked;
    let strength = Math.round(parseFloat(inputStrength.getAttribute('aria-valuenow')));

    inputName.value = "";
    inputAge.value = "";
    inputM.checked = true;
    inputF.checked = false;
    inputTM.checked = false;
    slider.foundation_.setValue(50);


    console.log(name, age, gen, TM, strength);
    if (name) {
        let p = new Player(name, age, gen, strength, TM);
        players.push(p);
        p.AddPlayer();
    }
}

function displayTeams(teams) {
    let teamsEl = document.querySelector("#teams");
    teamsEl.innerHTML = '';
    for (let t in teams) {
        teamsEl.innerHTML += `<p class="mdc-typography--headline6">Team ${(parseInt(t) + 1)}</p>`;
        for (let p of teams[t]) {
            teamsEl.innerHTML += p;
        }
        teamsEl.innerHTML += "<br>";
    }
}


function generates() {
    let teamsEl = document.querySelector("#teams");
    let inputNTeams = document.querySelector("#n-teams");
    NTeams = parseInt(inputNTeams.value) || 1;

    if (players.length / NTeams < 1) {

        document.querySelector("#alert").innerHTML = `There are <b>not enough players<b> for ${NTeams} teams!`;
        snackbar.open();
    }
    else {
        let teams = createTeamsMain(players, NTeams);

        displayTeams(teams);

    }


}
function save() {
    if (players.length <= 0) {
        document.querySelector("#alert").innerHTML = 'No players inserted!';
        snackbar.open();
        return;
    }
    let content = JSON.stringify(players, null, 2);
    let pom = document.createElement('a');
    let date = new Date();
    pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(content));

    pom.setAttribute('download', `players-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}.json`);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}
function load(text) {
    players = [];
    let obj = JSON.parse(text);
    for (let p of obj) {
        let newp = new Player(p.name, p.age, p.gen, p.strength, p.tm, p.id);
        players.push(newp);
        newp.AddPlayer();
    }
}

function readBlob() {

    var files = document.getElementById('load-btn').files;
    if (!files.length) {
        document.querySelector("#alert").innerHTML = 'Please select a file!';
        snackbar.open();
        return;
    }

    var file = files[0];
    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            load(evt.target.result);
        }
    };

    reader.readAsBinaryString(file);
}



function main() {
    if ("serviceWorker" in navigator) {
        if (navigator.serviceWorker.controller) {
            console.log("[PWA Builder] active service worker found, no need to register");
        } else {
            // Register the service worker
            navigator.serviceWorker
                .register("sw.js", {
                    scope: "./"
                })
                .then(function (reg) {
                    console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
                });
        }
    }


    window.mdc.autoInit();
    window.snackbar = new mdc.snackbar.MDCSnackbar(document.querySelector('.mdc-snackbar'));
    window.slider = new mdc.slider.MDCSlider(document.querySelector('.mdc-slider'));
    window.topAppBar = new mdc.topAppBar.MDCTopAppBar(document.querySelector(".mdc-top-app-bar"));

    let addPlayerBtn = document.querySelector("#add-player");
    addPlayerBtn.addEventListener("click", addPlayer);


    let generatesBtn = document.querySelector("#generates");
    generatesBtn.addEventListener("click", generates);

    document.querySelector('#load-btn').addEventListener('change', readBlob);
    document.querySelector('#save-btn').addEventListener('click', save);



}

document.addEventListener("DOMContentLoaded", main);