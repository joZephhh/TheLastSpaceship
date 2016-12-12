console.log("script linked");
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
		_particle.y += 10

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
