console.log("script linked");
// DOM Manipulation

var tls = {}

tls.el = {} // DOM
tls.el.container = document.querySelector(".container-game");

//views
tls.el.launch_page = tls.el.container.querySelector(".landing-page");
tls.el.game = tls.el.container.querySelector(".game");

//elements
tls.el.colorInput = tls.el.container.querySelector(".colorSpaceship");
tls.el.spaceship = tls.el.game.querySelector(".game-spaceship svg");
tls.el.svgPersoParts = tls.el.spaceship.querySelectorAll(".spaceship-personalisation");
tls.el.dataTotal= tls.el.game.querySelector(".game-total-data span");
tls.el.dataSpeed = tls.el.game.querySelector(".game-data-speed .game-data-info span");
tls.el.dataMoney = tls.el.game.querySelector(".game-data-money .game-data-info span");


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

// score multiplicator
tls.data.multi_distance=1;
//speed of the starts
tls.data.speed = 1;
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
    for (var i = 0; i < 400; i++) {
        var particle = {};
        particle.x          = Math.floor(Math.random() * canvas.width);
        particle.y          = Math.floor(Math.random() * canvas.width);
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
		}
	}
}

function add_particle()
{
    var particle = {};
    particle.x          = Math.floor(Math.random() * canvas.width);
    particle.y          = 0;
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
    add_particle()
	update_particles();
	draw();
}



//events
tls.el.start_btn.addEventListener("click", function(e) {
	restore();
	loop_data();
    //launch the game animations
    e.preventDefault();
    tls.el.launch_page.classList.add("launch");
	tls.el.dataSpeed.innerText = tls.data.distance;
    setTimeout(function() {
        tls.el.launch_page.remove();
        tls.el.game.classList.add("launched");
    },800)
	setTimeout(function() {
		rebootStationary();

	},5000)
})

// test svg change color
tls.el.colorInput.addEventListener("blur",function(){
	for (var i = 0; i < tls.el.svgPersoParts.length; i++) {
		tls.el.svgPersoParts[i].style="fill:"+tls.el.colorInput.value;
	}
})
tls.el.spaceship.addEventListener("click", function() {
rebootStationary();
add_distance();
console.log("spaceship clicked")
})

// get points where we was away
function restore() {
	var actualDate = new Date();
	var pastDate = parseFloat(localStorage.getItem("tls_date"))
	var differenceDate = Math.round(((actualDate.getTime() - pastDate) / 1000));
	if(tls.data.distance-differenceDate > 0) {
			tls.data.distance -= differenceDate;
	}
	else {
		tls.data.distance=0;
	}
}

// add speed
function add_distance() {
	tls.data.distance += (1*tls.data.multi_distance);
	tls.el.dataSpeed.innerText=tls.data.distance;
	tls.el.dataTotal.innerText=tls.data.distanceTotal;
}

// calc the total distance
setInterval(function() {
	tls.data.distanceTotal+= (1*tls.data.distance);
	tls.el.dataTotal.innerText=tls.data.distanceTotal;
},1000)

// discrease speed
function remove_distance() {
if(tls.data.distance> 0) {
	tls.data.distance -= 1;
tls.el.dataSpeed.innerText=tls.data.distance;
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
	}, 1000);
},3000)
}

// show the money
function money() {
tls.el.dataMoney.innerText = tls.data.money;
}

// update all the data stuff
function checkData() {
	tls.data.multi_distance = 1+ Math.floor((tls.data.distance/75))
	if(tls.data.speed <=40) {
		tls.data.speed =  1+ Math.floor((tls.data.distance/5)/20);
	}
	else {
		tls.data.speed = 40;
	}
	tls.data.money = Math.floor(tls.data.distanceTotal/1000)
	money();
	document.title = "TLS : "+ tls.data.distance +" an. lu. /sec.";
	localStorage.setItem("tls_distance_total", tls.data.distanceTotal);
	localStorage.setItem("tls_distance", tls.data.distance);
	var actualDate = new Date();
	localStorage.setItem("tls_date", actualDate.getTime());
}

// loop to launch update
function loop_data() {
	window.requestAnimationFrame(loop_data);
	checkData();
}
