console.log("script linked");
// if user has already play change welcome message
if (localStorage.getItem("alreadyCame")) {
    document.querySelector(".landing-page .ld-start .ld-start-button span").innerText = "Continuez votre épopée";
}
// our data, if we have already save data, take them
var tls_dtb;
if (localStorage.getItem("tls_database")) {
    tls_dtb = JSON.parse(localStorage.getItem("tls_database"))
} else { // else init data
    tls_dtb = {
        "objects": {
            "tank": {
                "name": "Réservoir",
                "lvl": 1,
                "value": 5,
                "ratio": 0.9,
                "price": 230,
                "statut": 100
            },
            "radar": {
                "name": "Radar",
                "lvl": 1,
                "value": 230,
                "ratio": 6,
                "price": 20,
                "unit": "m"
            },
            "reactors": {
                "name": "Réacteur",
                "lvl": 1,
                "value": 1000,
                "ratio": 1.2,
                "price": 12,
                "unit": ""
            },
            "starsContainer": {
                "name": "Caisse à poussières",
                "lvl": 1,
                "value": 75,
                "ratio": 2,
                "price": 55,
                "unit": ""
            },
            "armor": {
                "name": "Coque",
                "lvl": 1,
                "value": ["Carcasse", "Amas de taule", "Rouillée", "Quelques impacts", "Solide", "Impeccable"],
                "ratio": 0,
                "price": 20,
                "unit": ""
            },
            "solarResist": {
                "name": "Refroidissement",
                "lvl": 1,
                "value": 230,
                "ratio": 3,
                "price": 20,
                "unit": "°C"
            },
            "goFull": {
                "name": "Faire le plein",
                "lvl": 1,
                "value": 100,
                "ratio": 1,
                "price": 20,
                "unit": ""
            }

        },
        "galaxy": {
            "name": "d'Andromède",
            "range": 1,
            "size": 1000,
            "ratio": 5,
            "color": "#4b6cb7",
            "music": "1.mp3"
        },
        "obstacles": {
            "vortex": {
                "name": "Tunnel de broulliard",
                "lvl": 1,
                "how": "radar",
            },
            "solarEruption": {
                "name": "Eruption solaire",
                "lvl": 1,
                "how": "solarResist",
            },
            "asteroids": {
                "name": "Champ d'astéroides",
                "lvl": 1,
                "how": "armor",
            },
            "blackhole": {
                "name": "Trou noir",
                "lvl": 1,
                "how": "reactors",
            },
            "wind": {
                "name": "Vent stellaire",
                "lvl": 1,
                "how": "reactors",
            }
        },
        "spaceship": {
            "lvl": 1,
            "value": 2,
            "ratio": 2
        }
    }
}

// return a random color
function randomColor() {
    var hue = Math.round(Math.random() * 360);
    return 'hsl(' + hue + ',100%,30%)';
}


// loop to launch update
var loop_data;
var loop_money;
var loop_obstacles;


// DOM Manipulation

var tls = {}

tls.el = {} // DOM big nodes
tls.el.body = document.querySelector("body");
tls.el.container = document.querySelector(".container-game");

//views
tls.el.launch_page = tls.el.container.querySelector(".landing-page");
tls.el.game = tls.el.container.querySelector(".game");
tls.el.obstaclesBg = document.querySelector(".background-obstacles");
//elements

tls.el.player = tls.el.container.querySelector(".game-player");
tls.el.colorInput = tls.el.container.querySelector(".colorSpaceship");
tls.el.spaceshipContainer = tls.el.game.querySelector(".game-spaceship")
tls.el.spaceship = tls.el.spaceshipContainer.querySelector(".game-spaceship svg");
tls.el.obstacleNotification = tls.el.container.querySelector(".game-statut-obstacle");
tls.el.navbar = tls.el.container.querySelector(".navbar");
tls.el.navbarEl = tls.el.navbar.querySelectorAll(".navbar li a");
tls.el.menuIconShop = tls.el.navbar.querySelector(".menu-icon-shop");
tls.el.menuIconMute = tls.el.navbar.querySelector(".menu-icon-mute");
tls.el.shopsItems = tls.el.game.querySelectorAll(".game-menu-item");
tls.el.unitTotal = tls.el.game.querySelector(".units-total");
tls.el.unitSec = tls.el.game.querySelector(".units-sec");
tls.el.unitStill = tls.el.game.querySelector(".units-still");
tls.el.numberStill = tls.el.game.querySelector(".galaxy-still-dist");
tls.el.nameGalaxy = tls.el.game.querySelector(".galaxy-name")

//data html
tls.el.dataTotal = tls.el.game.querySelector(".game-total-data span");
tls.el.starsShop = tls.el.game.querySelector(".game-stars-shop .number");
tls.el.dataSpeed = tls.el.game.querySelector(".game-data-speed .game-data-info .unit-sec-nb");
tls.el.dataMoney = tls.el.game.querySelector(".game-data-money .game-data-info .unit-stars-nb");
tls.el.dataArmor = tls.el.game.querySelector(".game-data-armor .game-data-info .unit-arm");
tls.el.dataTank = tls.el.game.querySelector(".game-data-tank .game-data-info .unit-per-nb");
tls.el.dataTemp = tls.el.game.querySelector(".game-data-temp .game-data-info .unit-temp-nb");
tls.el.dataRadar = tls.el.game.querySelector(".game-data-radar .game-data-info .unit-meters-nb");

tls.el.bonus = tls.el.game.querySelector(".game-bonus");
//MAX values
tls.el.dataMoneyMax = tls.el.game.querySelector(".game-data-money .game-data-info .unit-stars-nb-max");
tls.el.dataLooseTank = tls.el.game.querySelector(".game-data-tank .game-data-info .unit-loose-nb");

// statut
tls.canLoop = true;
//DATA
tls.data = {}

// load speed
if (localStorage.getItem("tls_distance")) {
    tls.data.distance = parseFloat(localStorage.getItem("tls_distance"));
} else {
    tls.data.distance = 0;
}
// load total distance
if (localStorage.getItem("tls_distance_total")) {
    tls.data.distanceTotal = parseFloat(localStorage.getItem("tls_distance_total"));
} else {
    tls.data.distanceTotal = 0;
}
// load distance to stars dust
if (localStorage.getItem("tls_distance_stars")) {
    tls.data.distanceStars = parseFloat(localStorage.getItem("tls_distance_stars"));
} else {
    tls.data.distanceStars = 0;
}

// load current postion in the galaxy
if (localStorage.getItem("tls_current_position")) {
    tls.data.currentPosition = parseFloat(localStorage.getItem("tls_current_position"));
} else {
    tls.data.currentPosition = 0;
}

// score multiplicator
tls.data.multi_distance = 0.5;
//speed of the starts
tls.data.speed = 0;
// user money
tls.data.money = 0;
// buttons
tls.el.start_btn = tls.el.launch_page.querySelector(".ld-start");


// STARS BACKGROUND
var canvas = document.querySelector('canvas'),
    context = canvas.getContext('2d');
/**
 * RESIZE
 */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

/**
 * PARTICLES
 */
var particles = [];



// boot on the game, init all values to respective dom nodes
function init() {
    tls.el.body.setAttribute("style", "background:linear-gradient( to top," + tls_dtb.galaxy.color + " ,#000000)")
    tls.el.nameGalaxy.innerText = tls_dtb.galaxy.name
    tls.el.dataTemp.innerText = tls_dtb.objects.solarResist.value + tls_dtb.objects.solarResist.unit
    tls.el.dataRadar.innerText = tls_dtb.objects.radar.value + tls_dtb.objects.radar.unit
    tls.el.dataLooseTank.innerText = tls_dtb.objects.tank.value
    tls.el.dataArmor.innerText = tls_dtb.objects.armor.value[tls_dtb.objects.armor.ratio]
    tls.el.dataTank.innerText = tls_dtb.objects.tank.statut + "% ";
    var lvlSpaceship = tls_dtb.spaceship.lvl;
    changeSpaceship(lvlSpaceship);
    for (var i = 0; i < tls.el.shopsItems.length; i++) {
        tls.el.shopsItems[i].querySelector(".game-menu-item-details").style.backgroundColor = tls_dtb.galaxy.color;
    }
    // init stars
    for (var i = 0; i < 400; i++) {
        var particle = {};
        particle.x = Math.floor(Math.random() * canvas.width);
        particle.y = Math.floor(Math.random() * canvas.height);
        particle.velocity = {};
        particle.velocity.x = (Math.random() * 4 - 2) / 10;
        particle.velocity.y = (Math.random() * 4 - 2) / 10;
        particle.style = 'white';
        particle.radius = Math.random() * 2;
        particles.push(particle);
    }
    loop();
}

init(); // boot

// cnahe postion of stars in the background
function update_particles() {
    for (var i = 0; i < particles.length; i++) {
        var _particle = particles[i];

        _particle.x += _particle.velocity.x;
        _particle.y += tls.data.speed;

        if (_particle.x > canvas.width || _particle.x < 0 || _particle.y > canvas.height || _particle.y < 0) {
            particles.splice(i, 1);
            i--;
            add_particle();

        }
    }
}

// add stars to background
function add_particle() {
    var particle = {};
    particle.x = Math.floor(Math.random() * canvas.width);
    particle.y = Math.floor(Math.random() * canvas.height);
    particle.velocity = {};
    particle.velocity.x = (Math.random() * 4 - 2) / 10;
    particle.velocity.y = (Math.random() * 4 - 2) / 10;
    particle.style = 'white';
    particle.radius = Math.random() * 2;
    particles.push(particle);
}

/**
 * DRAW
 */
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
        var _particle = particles[i];
        context.beginPath();
        context.arc(_particle.x, _particle.y, _particle.radius, 0, Math.PI * 2);
        context.fillStyle = _particle.style;
        context.fill();
    }
}

/**
 * LOOP
 */
function loop() {
    window.requestAnimationFrame(loop);

    update_particles();
    draw();

}



//events
tls.el.start_btn.addEventListener("click", function(e) {
    init_game(e);
    localStorage.setItem("alreadyCame", "yes");
})

tls.el.menuIconShop.addEventListener("click", function(e) {
    e.preventDefault()
    if (!tls.el.container.classList.contains("menu-open")) {
        tls.el.container.classList.add("menu-open")
        maxValues();
        this.classList.add("menu-open")
    } else {
        tls.el.container.classList.remove("menu-open")
        tls.el.dataSpeed.classList.remove("unit-max");
        tls.el.dataMoneyMax.classList.remove("unit-max");
        tls.el.dataLooseTank.classList.remove("unit-max");
        tls.el.dataArmor.classList.remove("unit-max");
        tls.el.dataTemp.classList.remove("unit-max");
        tls.el.dataRadar.classList.remove("unit-max");
        this.classList.remove("menu-open")
    }

    pause();

})

tls.el.menuIconMute.addEventListener("click", function(e) {
    e.preventDefault();

    if (tls.el.player.muted == true) {
        tls.el.player.muted = false
        this.classList.remove("muted");
    } else {
        tls.el.player.muted = true;
        this.classList.add("muted");
    }
})

function maxValues() { // show max values when i open the shop
    tls.el.dataSpeed.innerText = (Math.round(((tls_dtb.objects.reactors.value)) * 100) / 100) / 1000
    tls.el.unitSec.innerText = "km/s";
    tls.el.unitSec.innerText = "km/s";
    tls.el.dataSpeed.classList.remove("increment");
    tls.el.dataSpeed.classList.remove("decrement");
    tls.el.dataSpeed.classList.add("unit-max");
    tls.el.dataMoneyMax.classList.add("unit-max");
    tls.el.dataLooseTank.classList.add("unit-max");
    tls.el.dataArmor.classList.add("unit-max");
    tls.el.dataTemp.classList.add("unit-max");
    tls.el.dataRadar.classList.add("unit-max");

}

function init_game(e) { // init specifics parameters and loops
    tls.el.player.setAttribute("src", "assets/musics/" + tls_dtb.galaxy.music);
    tls.el.player.setAttribute("autoplay", "true");
    tls.el.player.play();
    restore();

    loop_data = setInterval(function() {
        checkData(); // update ifs some conditions on data
    }, 15)
    loop_money = setInterval(function() {
        checkMoney()// update ifs some conditions on money
    }, 1000)
    if (localStorage.getItem("tls_obstacle")) {
        obstacle(); // take our previous obstacle
    } else {
        loop_obstacles = setInterval(function() {
            probabilitilized(); // update ifs some conditions on obstacle
        }, 60000)
    }

    store_init(); // init store and lvl item
    //launch the game animations
    e.preventDefault();
    tls.el.launch_page.classList.add("launch");
    tls.el.dataSpeed.innerText = tls.data.distance;
    setTimeout(function() {
        tls.el.launch_page.remove();
        tls.el.game.classList.add("launched");
        tls.el.navbar.style = "display:block;"
    }, 800)
    setTimeout(function() {
        rebootStationary(); // if no actions in 4s decrease speed

    }, 5000)
}

function checkMoney() { // update ifs some conditions on money
    tls.data.distanceTotal += (1 * tls.data.distance);
    if (tls.data.distanceStars + (1 * tls.data.distance) <= tls_dtb.objects.starsContainer.value * 1000) {

        tls.data.distanceStars += (1 * tls.data.distance);
    } else {
        tls.data.distanceStars = tls_dtb.objects.starsContainer.value * 1000
    }

    tls.data.currentPosition += (1 * tls.data.distance);
    localStorage.setItem("tls_distance_total", tls.data.distanceTotal);
    localStorage.setItem("tls_distance_stars", tls.data.distanceStars);
    money();
}

function pause() { // pause and restore the game
    if (tls.canLoop) {
        clearInterval(loop_money);
        clearInterval(loop_data);
        clearInterval(stationary);
        clearTimeout(timeoutStandby);
    } else {
        loop_money = setInterval(function() {
            checkMoney()
        }, 1000)
        loop_data = setInterval(function() {
            checkData();
        }, 15)
        timeoutStandby = setTimeout(function() {
            stationary = setInterval(function() {
                remove_distance();
            }, 10);
        }, 3000)
    }
    tls.canLoop = !tls.canLoop;
}

function store_init() { // load data and  lvl of items
    for (var i = 0; i < tls.el.shopsItems.length; i++) {
        var item = tls.el.shopsItems[i].getAttribute("data-store");
        tls.el.shopsItems[i].querySelector(".item-name").innerText = tls_dtb.objects[item].name
        tls.el.shopsItems[i].querySelector(".item-lvl").innerHTML = "nv." + tls_dtb.objects[item].lvl + "&nbsp<i class='fa fa-arrow-right' aria-hidden='true'></i>&nbsp" + " nv." + parseFloat(tls_dtb.objects[item].lvl + 1)
    }
    return true;
}
if (store_init()) {
    for (var i = 0; i < tls.el.shopsItems.length; i++) {
        tls.el.shopsItems[i].addEventListener("mouseover", function() {
            var item = this.getAttribute("data-store");
            var price = tls_dtb.objects[item].price
            canBuy(item, price); // show items price and values
        })
        tls.el.shopsItems[i].addEventListener("click", function() {
            var item = this.getAttribute("data-store");
            var price = tls_dtb.objects[item].price
            canBuy(item, price, "buy"); // buy items
        })
        tls.el.shopsItems[i].addEventListener("mouseout", function() {
            var item = this.getAttribute("data-store");
			// specfiics rules
            if (item == "armor") {
                var value = tls_dtb.objects[item].value[tls_dtb.objects[item].ratio]
            } else if (item == "solarResist") {
                var value = parseFloat(tls_dtb.objects[item].value) + tls_dtb.objects.solarResist.unit
            } else if (item == "radar") {
                var value = parseFloat(tls_dtb.objects[item].value) + tls_dtb.objects.radar.unit
            } else if (item == "goFull") {
                var value = tls_dtb.objects.tank.statut + "% ";
            } else if (item == "reactors") {
                var value = (Math.round(((tls_dtb.objects.reactors.value)) * 100) / 100) / 1000
                tls.el.unitSec.innerText = "km/s";
            } else {
                var value = parseFloat(tls_dtb.objects[item].value);
            }
            var selector = "." + item

            tls.el.game.querySelector(selector).classList.remove("unit-new-value");
            tls.el.game.querySelector(selector).innerHTML = value; // restore the initial value
            tls.el.starsShop.style.color = "white";
            tls.el.starsShop.innerText = Math.floor(tls.data.money);
        })
    }
}

function canBuy(item, price, type) {

    var canBeBought = false;
    if (tls.data.money - price >= 0) {
        tls.el.starsShop.innerText = "Il vous restera " + Math.floor(tls.data.money - price);
        tls.el.starsShop.style.color = "orange";
        tls.el.starsShop.classList.remove("unit-max");
        if (type == "buy") {
            tls.data.money -= price
            tls.data.distanceStars -= price * 1000
            tls.el.starsShop.innerText = Math.floor(tls.data.money);
            tls.el.dataMoney.innerText = Math.floor(tls.data.money) + "/";
        }
    } else {
        tls.el.starsShop.innerHTML = "Il vous manque " + parseInt(Math.abs(tls.data.money - price));
        tls.el.starsShop.style.color = "red";
        if (type == "buy") {
            return false;
        }
    }

    var selector = "." + item
	// specific rules
    if (item == "armor") {
        if (tls_dtb.objects.armor.ratio + 1 < tls_dtb.objects.armor.value.length) {
            canBeBought = true;
            var newValue = tls_dtb.objects.armor.value[parseFloat(tls_dtb.objects.armor.ratio) + 1];
            tls.el.game.querySelector(selector).innerHTML = newValue
        }
    } else if (item == "solarResist") {
        var newValue = (tls_dtb.objects[item].value * tls_dtb.objects[item].ratio)
        tls.el.game.querySelector(selector).innerHTML = newValue + tls_dtb.objects[item].unit
    } else if (item == "radar") {
        var newValue = (tls_dtb.objects[item].value * tls_dtb.objects[item].ratio)
        tls.el.game.querySelector(selector).innerHTML = newValue + tls_dtb.objects[item].unit
    } else if (item == "tank") {
        var newValue = (tls_dtb.objects[item].value) * (tls_dtb.objects[item].ratio);
        tls.el.game.querySelector(selector).innerHTML = newValue
    } else if (item == "goFull") {
        var newValue = 100
        tls.el.game.querySelector(selector).innerHTML = newValue + "% "
    } else {
        var selector = "." + item
        var newValue = Math.floor(Math.round(((tls_dtb.objects[item].value) * (tls_dtb.objects[item].ratio)) * 100) / 100)
        if (item == "reactors") {
            tls.el.game.querySelector(selector).innerHTML = newValue / 1000;
            tls.el.unitSec.innerText = "km/s";
        } else {
            tls.el.game.querySelector(selector).innerHTML = newValue

        }

    }
    tls.el.game.querySelector(selector).classList.add("unit-new-value");
    if (type == "buy") {
        if (item == "armor" && canBeBought) {
            tls_dtb.objects.armor.ratio += 1
        } else if (item == "goFull") {
            tls_dtb.objects.tank.statut = newValue;
        } else {
            tls_dtb.objects[item].value = newValue;
        }
        tls_dtb.objects[item].lvl += 1
        tls_dtb.objects[item].price = tls_dtb.objects[item].ratio * tls_dtb.objects[item].price

        store_init();
    }

	// if all item are more or equal to a lvl imrpove lvl design of the spaceship
    if (
        tls_dtb.objects.tank.lvl >= tls_dtb.spaceship.value &&
        tls_dtb.objects.radar.lvl >= tls_dtb.spaceship.value &&
        tls_dtb.objects.reactors.lvl >= tls_dtb.spaceship.value &&
        tls_dtb.objects.starsContainer.lvl >= tls_dtb.spaceship.value &&
        tls_dtb.objects.solarResist.lvl >= tls_dtb.spaceship.value
    ) {
        tls_dtb.spaceship.value += tls_dtb.spaceship.ratio;
        if (tls_dtb.spaceship.lvl + 1 < 11) {
            tls_dtb.spaceship.lvl += 1
        } else {
			// limit
            tls_dtb.spaceship.lvl = 10
        }
        changeSpaceship(tls_dtb.spaceship.lvl);
    }
    localStorage.setItem('tls_database', JSON.stringify(tls_dtb));
}

function changeSpaceship(lvl) {
    tls.el.spaceshipContainer.className = "game-spaceship";
    tls.el.spaceshipContainer.classList.add("spaceship-lvl-" + lvl);
}

tls.el.spaceshipContainer.addEventListener("click", function() {
	// on click on the svg
    if (tls.canLoop) {
        tls.el.spaceshipContainer.classList.add("clicked")
        tls.el.spaceshipContainer.addEventListener("animationend", function() {
            tls.el.spaceshipContainer.classList.remove("clicked")
        })
        add_distance();
        rebootStationary();
    }

})

// get points and distance where we was away
function restore() {
    var tempDistance;
    var actualDate = new Date();
    var pastDate = parseFloat(localStorage.getItem("tls_date"))
    var differenceDate = Math.round((actualDate.getTime() - pastDate) / 1000)
    if (tls.data.distance - (differenceDate * 100) > 0) {
        tls.data.distance -= (differenceDate * 100)
        tempDistance = tls.data.distance + (differenceDate * 10);
    } else {
        tls.data.distance = 0;
        tempDistance = 0;
    }


    for (var i = 0; i < differenceDate * 10; i++) {
        if (tempDistance > 0) {
            tls.data.distanceTotal += (differenceDate * 10) - i
            if (tls.data.distanceStars + ((differenceDate * 10) - i) < tls_dtb.objects.starsContainer.value) {
                tls.data.distanceStars += (differenceDate * 10) - i
            }
            tls.data.currentPosition += (differenceDate * 10) - i
            tempDistance -= 1
        }

    }
}


var sessionClic = 0; // how many clics in a session
// add speed
function add_distance() {
    var maxSpeed = tls_dtb.objects.reactors.value;
    tls.el.dataSpeed.classList.remove("decrement");
    if (tls.data.distance + (1 * tls.data.multi_distance) < maxSpeed) {
        tls.data.distance += (1 * tls.data.multi_distance); // add speed with a multiplicator ratio
        sessionClic++
        if (!tls.el.dataSpeed.classList.contains("increment")) {
            tls.el.dataSpeed.classList.add("increment");
        }
        tls.el.dataSpeed.classList.remove("unit-max");
    } else {
		// add speed limit
        tls.data.distance = maxSpeed
        tls.el.dataSpeed.classList.remove("increment");
        tls.el.dataSpeed.classList.add("unit-max");
    }

}


//powerups
function powerup(item) {
    var selector = "." + item
    if (!tls.el.bonus.querySelector(selector).classList.contains("available"))
        tls.el.bonus.querySelector(selector).classList.add("available");
}
tls.el.bonus.querySelector(".autopilot").addEventListener("click", function() {
    autopilot();
})
tls.el.bonus.querySelector(".hyperboost").addEventListener("click", function() {
    hyperboost();
})
tls.el.bonus.querySelector(".jump").addEventListener("click", function() {
    jump_obstacle();
})

var statutAutopilot;

function autopilot() {
    if (tls.el.bonus.querySelector(".autopilot").classList.contains('active')) {
        clearInterval(statutAutopilot);
        rebootStationary();
        tls.el.bonus.querySelector(".autopilot").classList.remove('available')
        tls.el.dataTank.classList.remove("decrease");
    } else {
        clearInterval(stationary);
        clearTimeout(timeoutStandby);
        tls.el.bonus.querySelector(".autopilot").classList.add('active')
        statutAutopilot = setInterval(function() {
            if (tls_dtb.objects.tank.statut - tls_dtb.objects.tank.value >= 0) {
                tls_dtb.objects.tank.statut -= tls_dtb.objects.tank.value
                tls.el.dataTank.innerHTML = tls_dtb.objects.tank.statut + "% ";
                tls.el.dataTank.classList.add("decrease");
                localStorage.setItem('tls_database', JSON.stringify(tls_dtb));
            } else {
                clearInterval(statutAutopilot);
                tls.el.bonus.querySelector(".autopilot").classList.remove('active')
                tls.el.dataTank.classList.remove("decrease");
                rebootStationary();
                localStorage.setItem('tls_database', JSON.stringify(tls_dtb));
                tls.el.bonus.querySelector(".autopilot").classList.remove("available");



            }

        }, 1000)
    }
}

function hyperboost() {
    tls.el.bonus.querySelector(".hyperboost").classList.add('active')
    var now = Date.now();
    var max = now + 5500;
    var hyperboost_interval;
    clearInterval(stationary);
    clearTimeout(timeoutStandby);
    hyperboost_interval = setInterval(function() {
        if (Date.now() <= max) {
            clearInterval(stationary);
            clearTimeout(timeoutStandby);
            tls.data.distance += tls.data.distance * 2;
            tls.el.dataSpeed.innerHTML = tls.data.distance;
        } else {
            tls.el.bonus.querySelector(".hyperboost").classList.remove('active')
            clearInterval(hyperboost_interval);
            tls.el.spaceshipContainer.click();
            rebootStationary();
            tls.el.bonus.querySelector(".hyperboost").classList.remove("available");

        }

    }, 1000)

}

function jump_obstacle() {
    tls.el.obstaclesBg.className = "background-obstacles";
    tls.el.obstacleNotification.classList.remove("active");
    tls.el.obstacleNotification.classList.remove("error")
    localStorage.removeItem("tls_obstacle")
    canLeaveGalaxy = true;
	tls.el.obstacleNotification.querySelector(".game-statut-fix").removeEventListener("click", function(e) {
		e.preventDefault();
	resolveObstacle();
	})
    loop_obstacles = setInterval(function() {
        probabilitilized();
    }, 60000)
    tls.el.bonus.querySelector(".jump").classList.remove("available");

}


// discrease speed
function remove_distance() {
    tls.el.dataSpeed.classList.remove("increment");
    if (tls.data.distance > 0 && tls.canLoop) {
        tls.data.distance -= 1;
        if (tls.data.distance > 1000) {
            tls.el.dataSpeed.innerText = Math.round((tls.data.distance / 1000) * 10) / 10
        } else {
            tls.el.dataSpeed.innerText = tls.data.distance
        };
        tls.el.dataSpeed.classList.add("decrement");
        tls.el.dataSpeed.classList.remove("unit-max");
    } else {
        tls.el.dataSpeed.classList.remove("decrement");

    }
}



// when nothing move
var stationary;
var timeoutStandby;

function rebootStationary() {
    clearInterval(stationary);
    clearTimeout(timeoutStandby);
    timeoutStandby = setTimeout(function() {
        stationary = setInterval(function() {
            remove_distance();
        }, 10);
    }, 3000)
}

// show the money
function money() {
    if (tls.data.money < parseFloat(tls_dtb.objects.starsContainer.value)) {
        tls.data.money = Math.round(tls.data.distanceStars / 1000)
        tls.el.dataMoneyMax.classList.remove("unit-max");

    } else {
        tls.data.money = parseFloat(tls_dtb.objects.starsContainer.value);
        tls.el.dataMoneyMax.classList.add("unit-max");
    }

    tls.el.dataMoney.innerText = tls.data.money + "/";
    tls.el.dataMoneyMax.innerText = parseFloat(tls_dtb.objects.starsContainer.value);
    tls.el.starsShop.innerText = tls.data.money;
}

// convert units
function unitsTotal() {
    if (tls.data.distanceTotal > 0 && tls.data.distanceTotal < 1000) {
        tls.el.dataTotal.innerText = tls.data.distanceTotal;
        tls.el.unitTotal.innerText = "mètres parcourus au total"
    } else if (tls.data.distanceTotal > 1000) {
        tls.el.dataTotal.innerText = Math.round(tls.data.distanceTotal / 1000);
        tls.el.unitTotal.innerText = "kilomètres parcourus au total";

    }

}

// convert units
function unitsSec() {
    if (tls.data.distance >= 0 && tls.data.distance < 1000) {
        tls.el.dataSpeed.innerText = tls.data.distance;
        tls.el.unitSec.innerText = "mètres /s"
    } else if (tls.data.distanceTotal > 1000) {
        tls.el.dataSpeed.innerText = Math.round((tls.data.distance / 1000) * 10) / 10;
        tls.el.unitSec.innerText = "kilomètres /s"
    }
}


// probability to have an obstacle
var probabilitilized = new Probability({
    p: '5%',
    /* the probability by that ... */
    f: function() { /* ... this function is called */
        obstacle("blackhole")
    }
}, {
    p: '10%',
    f: function() {
        obstacle("solarEruption")
    }
}, {
    p: '15%',
    f: function() {
        obstacle("asteroids")
    }
}, {
    p: '12%',
    f: function() {
        obstacle("wind")
    }
}, {
    p: '12%',
    f: function() {
        obstacle("vortex")
    }
});

// probability to have a superpower
var powerupsProba = new Probability({
    p: '20%',
    /* the probability by that ... */
    f: function() { /* ... this function is called */
        powerup("autopilot")
    }
}, {
    p: '20%',
    f: function() {
        powerup("hyperboost")
    }
}, {
    p: '20%',
    f: function() {
        powerup("jump")
    }
});

var canLeaveGalaxy = true;

// init and manage a new obstacle
function obstacle(typeE) {
		var obstacleLvl;
		var type;
		var save;
		var howFix;
		clearInterval(loop_obstacles);
		canLeaveGalaxy = false;

		if(localStorage.getItem("tls_obstacle")) {
			save= JSON.parse(localStorage.getItem("tls_obstacle"));
			type = save.type;
			obstacleLvl =save.obstacleLvl
			howFix = tls_dtb.obstacles[type].how;
		}
		else {
			type=typeE;
			howFix = tls_dtb.obstacles[type].how;
		   var max = tls_dtb.objects[howFix].lvl+2;
		   var min =  tls_dtb.objects[howFix].lvl;
			obstacleLvl = Math.floor(Math.random() * (max - min + 1)) + min;
		}



		tls_dtb.obstacles[type].level = obstacleLvl;
		tls.el.obstaclesBg.className = "background-obstacles";
		tls.el.obstaclesBg.classList.add(type);
		tls.el.obstacleNotification.classList.add("active");
		tls.el.obstacleNotification.querySelector(".bg-obstacle-name").innerText=tls_dtb.obstacles[type].name;
		tls.el.obstacleNotification.querySelector(".bg-obstacle-how").innerText=tls_dtb.objects[howFix].name+" niveau "+obstacleLvl;
		tls.el.obstacleNotification.querySelector(".game-statut-fix a").innerText="Utilser : "+tls_dtb.objects[howFix].name;
		 save = {
			"obstacleLvl":obstacleLvl,
			"type":type
		}
		localStorage.setItem("tls_obstacle", JSON.stringify(save));
		tls.el.obstacleNotification.querySelector(".game-statut-fix").addEventListener("click", function(e) {
			var objectLvl;
			e.preventDefault();
			if (howFix=="armor") {
				objectLvl=tls_dtb.objects[howFix].ratio+1;
			}
			else {
				objectLvl=tls_dtb.objects[howFix].lvl;
			}
			if(objectLvl>=obstacleLvl) {
				tls.el.obstaclesBg.className = "background-obstacles";
				tls.el.obstacleNotification.classList.remove("active");
				tls.el.obstacleNotification.classList.remove("error")
				localStorage.removeItem("tls_obstacle")
				canLeaveGalaxy=true;
				loop_obstacles = setInterval(function() {
		 	   probabilitilized();
		   },60000)
			}
			else {
				tls.el.obstacleNotification.classList.add("error");
				setTimeout(function(){
					tls.el.obstacleNotification.classList.remove("error");
				},500)
			}
		})
}

// determine if we are or not in the galaxy
function stillInGalaxy() {
    if (tls_dtb.galaxy.size - tls.data.currentPosition > 0) {
        if (tls_dtb.galaxy.size - tls.data.currentPosition > 1000) {
            tls.el.numberStill.innerText = Math.round(((tls_dtb.galaxy.size - tls.data.currentPosition) / 1000) * 100) / 100;
            tls.el.unitStill.innerText = " kilomètres"
        } else {
            tls.el.numberStill.innerText = tls_dtb.galaxy.size - tls.data.currentPosition;
            tls.el.unitStill.innerText = " mètres"
        }
    } else if (canLeaveGalaxy) {
        changeGalaxy();

    } else {
        tls.el.numberStill.innerText = 0;
    }
}

// init a new procedural galaxy
function changeGalaxy() {
    if (animationNewGalaxy()) {
        tls_dtb.galaxy.name = chance.last()
        tls_dtb.galaxy.range += 1
        tls_dtb.galaxy.size = tls_dtb.galaxy.size * tls_dtb.galaxy.ratio
        tls_dtb.galaxy.color = randomColor();
        tls.data.currentPosition = 0;
        tls_dtb.galaxy.music = Math.floor(Math.random() * (10 - 1 + 1)) + 1 + ".mp3";
        tls.el.player.setAttribute("src", "assets/musics/" + tls_dtb.galaxy.music);
        tls.el.body.setAttribute("style", "background:linear-gradient( to top," + tls_dtb.galaxy.color + " ,#000000)")
        localStorage.setItem('tls_database', JSON.stringify(tls_dtb));
        setTimeout(function() {
                tls.el.nameGalaxy.innerText = tls_dtb.galaxy.name
            }, 500) // keep suprise effect
        setInterval
    }
};

// animtation to a new galaxy enter
function animationNewGalaxy() {
    tls.el.game.classList.add("changingGalaxy");
    setTimeout(function() {
        tls.el.game.classList.remove("changingGalaxy")
        tls.el.game.classList.add("changingGalaxy-2");
        setTimeout(function() {
            tls.el.game.classList.remove("changingGalaxy-2");
        }, 500)
    }, 1700)
    return true

}

// update all the data stuff
function checkData() {
    tls.data.multi_distance = 1 + Math.floor((tls.data.distance / 150))
    if (tls.data.speed + (Math.sqrt(tls.data.distance / 3000)) > 35) {
        tls.data.speed = 35;

    } else {
        tls.data.speed = Math.sqrt(tls.data.distance / 3000)
    }

    unitsSec();
    unitsTotal();
    stillInGalaxy();
    document.title = "TL Spaceship : " + Math.round(tls.data.distance / 1000) + " km /sec.";
    if (sessionClic >= 200) {
        powerupsProba();
        sessionClic = 0;
    }
    localStorage.setItem("tls_distance", tls.data.distance);
    localStorage.setItem("tls_current_position", tls.data.currentPosition);
    var actualDate = new Date();
    localStorage.setItem("tls_date", actualDate.getTime());
}







// BETA - relaunch game
function tls_reset() {
    pause();
    localStorage.removeItem("alreadyCame")
    localStorage.removeItem("tls_distance_total");
    localStorage.removeItem("tls_distance_stars");
    localStorage.removeItem("tls_distance");
    localStorage.removeItem("tls_current_position");
    localStorage.removeItem("tls_date");
    localStorage.removeItem("tls_database");
    localStorage.removeItem("tls_obstacle");
    localStorage.removeItem("autopilot");
    console.log("done");
    location.reload();
}
