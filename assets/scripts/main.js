console.log("script linked");
var tls_dtb;
if (localStorage.getItem("tls_database")) {
	tls_dtb=JSON.parse(localStorage.getItem("tls_database"))
}
else {
	tls_dtb ={
		"objects" : {
			"tank" : {
				"name":"Réservoir",
				"lvl" : 1,
				"value" : -5,
				"ratio" : 0.9,
				"price":230
			},
			"radar" : {
				"name":"Radar",
				"lvl" : 1,
				"value" : 230,
				"ratio" : 6,
				"price":120
			},
			"reactors": {
				"name":"Réacteur",
				"lvl" : 1,
				"value" :1000,
				"ratio" : 1.2,
				"price":75
			},
			"starsContainer": {
				"name":"Caisse à poussières",
				"lvl" : 1,
				"value" :75,
				"ratio" : 2,
				"price":55
			},
			"armor": {
				"name":"Coque",
				"lvl" : 1,
				"value" :["Carcasse","Amas de taule","Rouillée","Quelques impacts","Solide","Impacable"],
				"ratio" : 0 ,
				"price":120
			},
			"solarResist": {
				"name":"Refroidissement",
				"lvl" : 1,
				"value" :230,
				"ratio" : 3,
				"price":120
			},
			"goFull": {
				"name":"Faire le plein",
				"lvl" : 1,
				"value" :110,
				"ratio" : 2,
				"price":120
			}

		},
		"galaxy": {
			"name":"d'Andromède",
			"range":1,
			"size":1000,
			"ratio":5,
			"color": "#4b6cb7"
		}
	}
}


function randomColor() {
	var hue = Math.round( Math.random() * 360 );
	return 'hsl(' + hue + ',100%,30%)';
}
function randomName(nameLength)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < nameLength ; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
console.log(tls_dtb.galaxy.color);

// loop to launch update
var loop_data;
var loop_money;


// DOM Manipulation

var tls = {}

tls.el = {} // DOM
tls.el.body = document.querySelector("body");
tls.el.container = document.querySelector(".container-game");

//views
tls.el.launch_page = tls.el.container.querySelector(".landing-page");
tls.el.game = tls.el.container.querySelector(".game");

//elements

tls.el.colorInput = tls.el.container.querySelector(".colorSpaceship");
tls.el.spaceship = tls.el.game.querySelector(".game-spaceship svg");
tls.el.svgPersoParts = tls.el.spaceship.querySelectorAll(".spaceship-personalisation");


tls.el.navbar = tls.el.container.querySelector(".navbar");
tls.el.navbarEl = tls.el.navbar.querySelectorAll(".navbar li a");
tls.el.menuIcon = tls.el.navbar.querySelector(".menu-icon");
tls.el.shopsItems = tls.el.game.querySelectorAll(".game-menu-item");


tls.el.unitTotal = tls.el.game.querySelector(".units-total");
tls.el.unitSec = tls.el.game.querySelector(".units-sec");
tls.el.unitStill = tls.el.game.querySelector(".units-still");
tls.el.numberStill = tls.el.game.querySelector(".galaxy-still-dist");
tls.el.nameGalaxy = tls.el.game.querySelector(".galaxy-name")
tls.el.dataTotal = tls.el.game.querySelector(".game-total-data span");
tls.el.starsShop = tls.el.game.querySelector(".game-stars-shop .number");
tls.el.dataSpeed = tls.el.game.querySelector(".game-data-speed .game-data-info .unit-sec-nb");
tls.el.dataMoney = tls.el.game.querySelector(".game-data-money .game-data-info .unit-stars-nb");
tls.el.dataArmor = tls.el.game.querySelector(".game-data-armor .game-data-info .unit-arm");
tls.el.dataTemp = tls.el.game.querySelector(".game-data-temp .game-data-info .unit-temp-nb");
tls.el.dataRadar = tls.el.game.querySelector(".game-data-radar .game-data-info .unit-meters-nb");
//MAX values
tls.el.dataMoneyMax = tls.el.game.querySelector(".game-data-money .game-data-info .unit-stars-nb-max");
tls.el.dataLooseTank = tls.el.game.querySelector(".game-data-tank .game-data-info .unit-loose-nb");

// statut
tls.canLoop = true;
//DATA
tls.data = {}

// if player has already play
if (localStorage.getItem("tls_distance")) {
	tls.data.distance = parseFloat(localStorage.getItem("tls_distance"));
}
else {
	tls.data.distance = 0;
}

if (localStorage.getItem("tls_distance_total")) {
	tls.data.distanceTotal = parseFloat(localStorage.getItem("tls_distance_total"));
}
else {
tls.data.distanceTotal = 0;
}
if (localStorage.getItem("tls_distance_stars")) {
	tls.data.distanceStars = parseFloat(localStorage.getItem("tls_distance_stars"));
}
else {
tls.data.distanceStars = 0;
}
if (localStorage.getItem("tls_current_position")) {
	tls.data.currentPosition = parseFloat(localStorage.getItem("tls_current_position"));
}
else {
tls.data.currentPosition = 0;
}

// score multiplicator
tls.data.multi_distance=0.5;
//speed of the starts
tls.data.speed = 0;
// user money
tls.data.money = 0;
// buttons
tls.el.start_btn = tls.el.launch_page.querySelector(".ld-start");


// STARS BACKGROUND
var canvas  = document.querySelector( 'canvas' ),
	context = canvas.getContext( '2d' );
/**
 * RESIZE
 */
function resize()
{
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight;
}

window.addEventListener( 'resize', resize );
resize();




/**
 * PARTICLES
 */
var particles = [];


function init() {
	tls.el.body.setAttribute("style","background:linear-gradient( to top,"+tls_dtb.galaxy.color+" ,#000000)")
	tls.el.nameGalaxy.innerText= tls_dtb.galaxy.name
	for (var i = 0; i < tls.el.shopsItems.length; i++) {
		tls.el.shopsItems[i].querySelector(".game-menu-item-details").style.backgroundColor=tls_dtb.galaxy.color;
	}
	// for (var i = 0; i < tls.el.navbarEl.length; i++) {
	// 	tls.el.navbarEl[i].addEventListener("click",function(e) {
	// 		e.preventDefault();
	// 		for (var j = 0; j < tls.el.navbarEl.length; j++) {
	// 			tls.el.navbarEl[j].classList.remove("active");
	// 		}
	// 		this.classList.add("active");
	//
	// 	})
	// } // active item navbar
    for (var i = 0; i < 400; i++) {
        var particle = {};
        particle.x          = Math.floor(Math.random() * canvas.width);
        particle.y          = Math.floor(Math.random() * canvas.height);
        particle.velocity   = {};
        particle.velocity.x = (Math.random() * 4 - 2) /10;
        particle.velocity.y = (Math.random() * 4 - 2) /10;
        particle.style      = 'white';
        particle.radius     = Math.random() * 2;
        particles.push(particle);
    }
    loop();
}

init();
function update_particles()
{
	for( var i = 0; i < particles.length; i++ )
	{
		var _particle = particles[ i ];

		_particle.x += _particle.velocity.x;
		_particle.y += tls.data.speed;

		if( _particle.x > canvas.width || _particle.x < 0 || _particle.y > canvas.height || _particle.y < 0 )
		{
			particles.splice( i, 1 );
			i--;
			add_particle();

		}
	}
}

function add_particle()
{
    var particle = {};
    particle.x          = Math.floor(Math.random() * canvas.width);
    particle.y          = Math.floor(Math.random() * canvas.height);
    particle.velocity   = {};
    particle.velocity.x = (Math.random() * 4 - 2) /10;
    particle.velocity.y = (Math.random() * 4 - 2) /10;
    particle.style      = 'white';
    particle.radius     = Math.random() * 2;
    particles.push(particle);
}

/**
 * DRAW
 */
function draw()
{
	context.clearRect( 0, 0, canvas.width, canvas.height );

	for( var i = 0; i < particles.length; i++ )
	{
		var _particle = particles[ i ];
		context.beginPath();
		context.arc( _particle.x, _particle.y, _particle.radius, 0, Math.PI * 2 );
		context.fillStyle = _particle.style;
		context.fill();
	}
}

/**
 * LOOP
 */
function loop()
{
	window.requestAnimationFrame( loop );

	update_particles();
	draw();

}



//events
tls.el.start_btn.addEventListener("click", function(e) {
	init_game(e);
})
tls.el.menuIcon.addEventListener("click",function(e) {
	e.preventDefault()
	if(!tls.el.container.classList.contains("menu-open")) {
		tls.el.container.classList.add("menu-open")
		maxValues();
		this.classList.add("menu-open")
	}
	else {
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
function maxValues() {
tls.el.dataSpeed.innerText=tls_dtb.objects.reactors.value;
tls.el.dataSpeed.classList.remove("increment");
tls.el.dataSpeed.classList.remove("decrement");
tls.el.dataSpeed.classList.add("unit-max");
tls.el.dataMoneyMax.classList.add("unit-max");
tls.el.dataLooseTank.classList.add("unit-max");
tls.el.dataArmor.classList.add("unit-max");
tls.el.dataTemp.classList.add("unit-max");
tls.el.dataRadar.classList.add("unit-max");

}
function init_game(e) {
	restore();

	 loop_data =  setInterval(function() {
			checkData();
	},15)
	loop_money = setInterval(function() {
	   checkMoney()
   },1000)
	store_init();
    //launch the game animations
    e.preventDefault();
    tls.el.launch_page.classList.add("launch");
	tls.el.dataSpeed.innerText = tls.data.distance;
    setTimeout(function() {
        tls.el.launch_page.remove();
        tls.el.game.classList.add("launched");
		tls.el.navbar.style="display:block;"
    },800)
	setTimeout(function() {
		rebootStationary();

	},5000)
}

function checkMoney() {
	tls.data.distanceTotal+= (1*tls.data.distance);
	tls.data.distanceStars+= (1*tls.data.distance);
	tls.data.currentPosition+=(1*tls.data.distance);
	localStorage.setItem("tls_distance_total", tls.data.distanceTotal);
	localStorage.setItem("tls_distance_stars", tls.data.distanceStars);
	console.log("loop_money");
	money();
}
function pause() {
	if(tls.canLoop) {
	clearInterval(loop_money);
	clearInterval(loop_data);
	clearInterval(stationary);
	clearTimeout(timeoutStandby);
}
else {
	 loop_money = setInterval(function() {
		checkMoney()
	},1000)
	loop_data =  setInterval(function() {
		   checkData();
   },15)
   timeoutStandby = setTimeout(function() {
   	 stationary = setInterval(function () {
   		remove_distance();
   	}, 10);
   },3000)
}
tls.canLoop=!tls.canLoop;
}

function store_init() {
	for (var i = 0; i < tls.el.shopsItems.length; i++) {
		var item = tls.el.shopsItems[i].getAttribute("data-store");
		console.log(tls_dtb.objects[item].name)
		tls.el.shopsItems[i].querySelector(".item-name").innerText=tls_dtb.objects[item].name
		tls.el.shopsItems[i].querySelector(".item-lvl").innerHTML="nv."+tls_dtb.objects[item].lvl+"&nbsp<i class='fa fa-arrow-right' aria-hidden='true'></i>&nbsp"+" nv."+parseFloat(tls_dtb.objects[item].lvl+1)
	}
	return true;
}

if(store_init()) {
console.log("store init")
	for (var i = 0; i < tls.el.shopsItems.length; i++) {
		tls.el.shopsItems[i].addEventListener("mouseover", function() {
			var item = this.getAttribute("data-store");
			var price = tls_dtb.objects[item].price
			canBuy(item,price);
		})
		tls.el.shopsItems[i].addEventListener("mouseout", function() {
			var item = this.getAttribute("data-store");
			if (item=="armor") {
				var value = tls_dtb.objects[item].value[tls_dtb.objects[item].ratio]
			}
			else if (item=="solarResist") {
				var value = tls_dtb.objects[item].value +"°C"
			}
			else if (item=="radar") {
				var value = tls_dtb.objects[item].value +"m"
			}
			else {
				var value = tls_dtb.objects[item].value;
			}
			var selector = "."+item

			tls.el.game.querySelector(selector).classList.remove("unit-new-value");
			tls.el.game.querySelector(selector).innerHTML=value;
			tls.el.starsShop.style.color="white";
			tls.el.starsShop.innerText = tls.data.money;
		})
	}
}
function canBuy(item, price) {

	if (tls.data.money - price >= 0) {
		console.log("can buy"+item);
		tls.el.starsShop.innerText=tls.data.money - price;
		tls.el.starsShop.style.color="orange";
		tls.el.starsShop.classList.remove("unit-max");
	}
	else {
		console.log("cant buy"+item );
		tls.el.starsShop.innerHTML=parseFloat(tls.data.money-price) ;
		tls.el.starsShop.style.color="red";
	}


	console.log(item, selector)
	var selector = "."+item
	if (item == "armor") {

		var newValue = tls_dtb.objects.armor.value[parseFloat(tls_dtb.objects.armor.ratio)+1];
	}
	else if (item == "solarResist") {

		var newValue = (tls_dtb.objects[item].value * tls_dtb.objects[item].ratio ) +"°C"
	}
	else if (item == "radar") {

		var newValue = (tls_dtb.objects[item].value * tls_dtb.objects[item].ratio ) +"m"
	}
	else {
		var selector = "."+item
		var newValue = (tls_dtb.objects[item].value)* (tls_dtb.objects[item].ratio)
	}
	tls.el.game.querySelector(selector).innerHTML=newValue;
	tls.el.game.querySelector(selector).classList.add("unit-new-value");

}


tls.el.spaceship.addEventListener("click", function() {

if (tls.canLoop) {
	add_distance();
	rebootStationary();
}

console.log("spaceship clicked")
})

// get points where we was away
function restore() {
	console.log("distance totale avant ",tls.data.distanceTotal)
	console.log("distance/s avant",tls.data.distance )
	var tempDistance;
	var actualDate = new Date();
	var pastDate = parseFloat(localStorage.getItem("tls_date"))
	var differenceDate = Math.round((actualDate.getTime() - pastDate)/1000)
	if(tls.data.distance - (differenceDate*100) > 0) {
		tls.data.distance -= (differenceDate*100)
		tempDistance= tls.data.distance+(differenceDate*10);
	}
	else {
	tls.data.distance=0;
	tempDistance=0;
	}


	for (var i = 0; i < differenceDate*10; i++) {
		if(tempDistance>0) {
			tls.data.distanceTotal+=  (differenceDate*10)-i
			tls.data.distanceStars+=  (differenceDate*10)-i
			tls.data.currentPosition+= (differenceDate*10)-i
			tempDistance-=1
		}

	}
	console.log("distance totale après",tls.data.distanceTotal)
		console.log("distance/s apres",tls.data.distance )

}

// add speed
function add_distance() {
	var maxSpeed = tls_dtb.objects.reactors.value;
	tls.el.dataSpeed.classList.remove("decrement");
	if(tls.data.distance +  (1*tls.data.multi_distance) < maxSpeed  ) {
	tls.data.distance += (1*tls.data.multi_distance);
		if(!tls.el.dataSpeed.classList.contains("increment")) {
			tls.el.dataSpeed.classList.add("increment");
		}
		tls.el.dataSpeed.classList.remove("unit-max");
}

else {
	tls.data.distance = maxSpeed
		tls.el.dataSpeed.classList.remove("increment");
		tls.el.dataSpeed.classList.add("unit-max");
}

}



// discrease speed
function remove_distance() {
tls.el.dataSpeed.classList.remove("increment");
if(tls.data.distance> 0 && tls.canLoop) {
	tls.data.distance -= 1;
tls.el.dataSpeed.innerText=tls.data.distance;
	tls.el.dataSpeed.classList.add("decrement");
	tls.el.dataSpeed.classList.remove("unit-max");
}
else{
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
	 stationary = setInterval(function () {
		remove_distance();
	}, 10);
},3000)
}

// show the money
function money() {
	if(tls.data.money < parseFloat(tls_dtb.objects.starsContainer.value )) {
	tls.data.money = Math.floor(tls.data.distanceStars/1000)
	tls.el.dataMoneyMax.classList.remove("unit-max");
}
else {
	tls.data.money = parseFloat(tls_dtb.objects.starsContainer.value) ;
	tls.el.dataMoneyMax.classList.add("unit-max");
}
tls.el.dataMoney.innerText = tls.data.money+"/";
tls.el.dataMoneyMax.innerText=parseFloat(tls_dtb.objects.starsContainer.value);
tls.el.starsShop.innerText = tls.data.money;
console.log(parseFloat(tls_dtb.objects.starsContainer.value));
}

function unitsTotal() {
	if (tls.data.distanceTotal > 0 && tls.data.distanceTotal < 1000) {
		tls.el.dataTotal.innerText=tls.data.distanceTotal;
		tls.el.unitTotal.innerText="mètres parcourus au total"
	}
	else if (tls.data.distanceTotal > 1000) {
		tls.el.dataTotal.innerText=Math.round(tls.data.distanceTotal/1000);
		tls.el.unitTotal.innerText="kilomètres parcourus au total";

	}

}

function unitsSec() {
	if (tls.data.distance >= 0 && tls.data.distance < 1000) {
		tls.el.dataSpeed.innerText=tls.data.distance;
		tls.el.unitSec.innerText="mètres /s"
	}
	else if (tls.data.distanceTotal > 1000) {
		tls.el.dataSpeed.innerText=Math.round((tls.data.distance/1000)*10)/10;
		tls.el.unitSec.innerText="kilomètres /s"
	}
}


function stillInGalaxy() {
	if (tls_dtb.galaxy.size - tls.data.currentPosition > 0) {
		if(tls_dtb.galaxy.size - tls.data.currentPosition > 1000) {
		tls.el.numberStill.innerText= Math.round(((tls_dtb.galaxy.size - tls.data.currentPosition)/1000)*100)/100;
		tls.el.unitStill.innerText=" kilomètres"
	}
		else {
			tls.el.numberStill.innerText= tls_dtb.galaxy.size - tls.data.currentPosition;
			tls.el.unitStill.innerText=" mètres"
		}
	}
	else {
		changeGalaxy();
	}
}

function changeGalaxy() {
	if(animationNewGalaxy()) {
	tls_dtb.galaxy.name =chance.last()
	tls_dtb.galaxy.range +=1
	tls_dtb.galaxy.size = tls_dtb.galaxy.size*tls_dtb.galaxy.ratio
	tls_dtb.galaxy.color = randomColor();
	tls.data.currentPosition =0;
	tls.el.body.setAttribute("style","background:linear-gradient( to top,"+tls_dtb.galaxy.color+" ,#000000)")
	localStorage.setItem('tls_database', JSON.stringify(tls_dtb));
	setTimeout(function() {
		tls.el.nameGalaxy.innerText= tls_dtb.galaxy.name
	},500) // keep suprise effect
}
};

function animationNewGalaxy() {
	tls.el.game.classList.add("changingGalaxy");
	setTimeout(function() {
		tls.el.game.classList.remove("changingGalaxy")
		tls.el.game.classList.add("changingGalaxy-2");
		setTimeout(function() {
			tls.el.game.classList.remove("changingGalaxy-2");
		},500)
	},1700)
	return true

}

// update all the data stuff
function checkData() {
	tls.data.multi_distance = 1+ Math.floor((tls.data.distance/150))
	if(tls.data.speed + (Math.sqrt(tls.data.distance/3000)) >35) {
		tls.data.speed = 35;

	}
	else {
		tls.data.speed = Math.sqrt(tls.data.distance/3000)
	}

	unitsSec();
	unitsTotal();
	stillInGalaxy();
	document.title = "TLS : "+ tls.data.distance +" an. lu. /sec.";

	localStorage.setItem("tls_distance", tls.data.distance);
	localStorage.setItem("tls_current_position", tls.data.currentPosition);
	var actualDate = new Date();
	localStorage.setItem("tls_date", actualDate.getTime());
}







// BETA
function tls_reset() {
	pause();
	localStorage.removeItem("tls_distance_total");
	localStorage.removeItem("tls_distance_stars");
	localStorage.removeItem("tls_distance");
	localStorage.removeItem("tls_current_position");
	localStorage.removeItem("tls_date");
	localStorage.removeItem("tls_database");
	console.log("done");
	location.reload();
}

// test svg change color
tls.el.colorInput.addEventListener("blur",function(){
	for (var i = 0; i < tls.el.svgPersoParts.length; i++) {
		tls.el.svgPersoParts[i].style="fill:"+tls.el.colorInput.value;
	}
})

document.querySelector(".testShop").addEventListener("click", function() {
upgradeCaro();
})

function upgradeCaro() {
tls.el.dataArmor.innerText = tls_dtb.objects.armor.value[parseFloat(tls_dtb.objects.armor.ratio)+1]
}
