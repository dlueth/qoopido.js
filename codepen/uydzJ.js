var randomTime               = 1000, // max time in ms between random Fireworks
	usePooling               = true, // whether to use pooling or not (for comparison purposes)
	particlesPerFireworkBase = 80,   // min number of particles per Firework
	particlesPerFireworkRnd  = 20,   // max number of additional random particles per firework
	particleSizeBase         = 8,    // min size of particles
	particleSizeRnd          = 10,   // max additional random size
	particleVelocityBase     = 4,    // min velocity of particles
	particleVelocityRnd      = 4,    // max additional random velocity
	particleLifetimeBase     = 800,  // min lifetime of particle
	particleLifetimeRnd      = 400,  // max additional random lifetime
	particleGravity          = 0.06, // gravity of particles
	particleColors           = [ '33,141,166', '149,186,0', '255,180,0', '166,60,148', '255,255,51', '255,0,102', '255,140,0' ],
	particlesAlphaEasings    = [ easeInSine, easeInQuad, easeInCubic ];

/*
 * The resulting particlesSize will always
 * be made dividable by 2 to avoid
 * floating point positions of particles
 * for performance reasons!
 */

// easing function for particle alpha transition
function easeInSine(t, d) {
	return 1 * Math.cos(t / d * MATH_PI_DIV_TWO) -1 + 1;
}

function easeInQuad(t, d) {
	return -1 * (t /= d) * t + 1;
}

function easeInCubic(t, d) {
	return -1 * (t /= d) * t * t + 1;
}

// Note: currently not used because it feels too fast!
function easeInQuart(t, d) {
	return -1 * (t /= d) * t * t * t + 1;
}

require([ 'base' ], function() {
	require([ 'support', 'particle', 'dom/element', 'pool/module', 'pool/dom', 'vector/2d' ], function(mSupport, mParticle, mDomElement, mPoolModule, mPoolDom, mVector) {
		var qWindow               = mDomElement.create(window),
			qDocument             = mDomElement.create(document),
			qCanvas               = mDomElement.create(document.createElement('canvas')),
			poolModule            = mPoolModule.create(mParticle),
			poolDom               = mPoolDom.create(),
			poolVector            = mPoolModule.create(mVector),
			poolMetrics           = poolModule.metrics,
			consoleContainer      = document.getElementById('console'),
			consoleFps            = document.getElementById('fps'),
			consoleTotal          = document.getElementById('total'),
			consoleRecycled       = document.getElementById('recycled'),
			consoleDestroyed      = document.getElementById('destroyed'),
			consoleInPool         = document.getElementById('inpool'),
			consoleInUse          = document.getElementById('inuse'),
			consoleInQueue        = document.getElementById('inqueue'),
			requestAnimationFrame = window[mSupport.getMethod('requestAnimationFrame')] || requestAnimationFrameFallback,
			cancelAnimationFrame  = window[mSupport.getMethod('cancelAnimationFrame')] || clearTimeout,
			visibilityProperty    = mSupport.getProperty('hidden', document)
		mainCanvas            = qCanvas.element,
			mainContext           = mainCanvas.getContext('2d'),
			width = 0, height = 0, paused = false, interval = null, particles = [], time = now = new Date().getTime(), last = time, delta = null, frames = 0, factor = 1, getParticleAlpha = [ easeInSine, easeInQuad, easeInCubic ],

			TARGET_FRAMERATE  = 1000 / 60,
			MATH_PI_TIMES_TWO = 2 * Math.PI,
			MATH_PI_DIV_TWO   = Math.PI / 2;

		function requestAnimationFrameFallback(callback) {
			window.setTimeout(callback, TARGET_FRAMERATE);
		}

		function onResize() {
			width  = mainCanvas.width  = window.innerWidth;
			height = mainCanvas.height = window.innerHeight;
		}

		function onVisibilityChange() {
			if(document[visibilityProperty]) {
				paused = new Date().getTime();

				if(interval) {
					cancelAnimationFrame(interval);
					interval = null;
				}
			} else {
				if(!interval) {
					var i, particle;

					paused = new Date().getTime() - paused;

					for(i = 0; (particle = particles[i]) !== undefined; i++) {
						particle.birthtime += paused;
						particle.deathtime += paused;
					}

					paused = false;
					update();
				}
			}
		}

		function randomFirework() {
			if(paused === false) {
				addFirework();
			}

			setTimeout(randomFirework, Math.random() * randomTime);
		}

		function addFirework(event) {
			var count        = ((Math.random() * particlesPerFireworkRnd + particlesPerFireworkBase) / factor) >> 0,
				x            = event ? parseInt(event.clientX || event.pageX) : (Math.random() * width) >> 0,
				y            = event ? parseInt(event.clientY || event.pageY) : (Math.random() * height) >> 0,
				angle        = MATH_PI_TIMES_TWO / count,
				color        = ''.concat('rgba(', particleColors[((Math.random() * (particleColors.length - 1)) + 0.5) >> 0], ','),
				size         = (size = ((Math.random() * particleSizeRnd) >> 0) + particleSizeBase) + (size % 2),
				canvas       = (usePooling === true) ? poolDom.obtain('canvas') : document.createElement('canvas'),
				acceleration = (usePooling === true) ? poolVector.obtain(0, particleGravity) : mVector.create(0, particleGravity),
				context      = null,
				fill         = null;

			canvas.width       = canvas.height = size;
			canvas.usage       = count;
			acceleration.usage = count;

			size      = size / 2;
			context   = canvas.getContext('2d'),
				fill      = context.createRadialGradient(size, size, 0, size, size, size);

			fill.addColorStop(0, ''.concat(color, '1)'));
			fill.addColorStop(1, ''.concat(color, '0)'));

			context.arc(size, size, size, 0, MATH_PI_TIMES_TWO, false);
			context.fillStyle = fill;
			context.fill();

			while(count--) {
				var randomVelocity = particleVelocityBase + Math.random() * particleVelocityRnd,
					particleAngle  = count * angle,
					particle       = (usePooling === true) ? poolModule.obtain(x, y) : mParticle.create(x, y);

				particle.velocity.x = Math.cos(particleAngle) * randomVelocity;
				particle.velocity.y = Math.sin(particleAngle) * randomVelocity;

				particle.acceleration.push(acceleration);

				particle.canvas     = canvas;
				particle.easing     = particle.easing ? particle.easing : particlesAlphaEasings[(Math.random() * (particlesAlphaEasings.length - 1) + 0.5) >> 0];
				particle.birthtime  = now;
				particle.lifetime   = particle.lifetime? particle.lifetime : (particleLifetimeBase + Math.random() * particleLifetimeRnd) >> 0;
				particle.deathtime  = now + particle.lifetime;

				particles.push(particle);
			}

			if(event) {
				event.preventDefault();
				event.stopPropagation();

				return false;
			}
		}

		function update() {
			if(paused === false) {
				updateFps();

				mainContext.fillStyle = 'rgba(0,0,0,0.15)';
				mainContext.fillRect(0, 0, width, height);

				for(var i = 0; particles[i] !== undefined; i++) {
					var particle = particles[i],
						position, size;

					particle.update();

					position = particle.position,
						size     = particle.size;

					if(now > particle.deathtime || position.x < -size || position.y < -size || position.x > width + size || position.y > height + size) {
						particles.splice(i, 1);

						if(usePooling === true) {
							var canvas       = particle.canvas,
								acceleration = particle.acceleration[0];

							particle.dispose();

							canvas.usage       -= 1;
							acceleration.usage -= 1;

							if(canvas.usage <= 0) {
								canvas = particle.canvas = canvas.dispose();
							}

							if(acceleration.usage <= 0) {
								acceleration = acceleration.dispose();
							}
						}

						i -= 1;
					} else {
						renderParticle(particle, factor);
					}
				}

				updateConsole();
				interval = requestAnimationFrame(update);
			}
		}

		function updateFps() {
			now    = new Date().getTime();
			delta  = now - time;
			factor = (now - last) / TARGET_FRAMERATE;

			if(delta >= 1000) {
				consoleFps.textContent = (delta / (delta / frames)) >> 0;

				time   = now;
				frames = 0;
			}

			last   = now;
			frames = frames + 1;
		}

		function updateConsole() {
			consoleTotal.textContent     = poolMetrics.total;
			consoleRecycled.textContent  = poolMetrics.recycled;
			consoleDestroyed.textContent = poolMetrics.destroyed;
			consoleInPool.textContent    = poolMetrics.inPool;
			consoleInUse.textContent     = poolMetrics.inUse;
			consoleInQueue.textContent   = poolMetrics.inQueue;
		}

		function renderParticle(particle) {
			mainContext.save();
			mainContext.globalCompositeOperation = 'lighter';
			mainContext.globalAlpha = Math.random() * particle.easing(now - particle.birthtime, particle.lifetime);
			mainContext.drawImage(particle.canvas, particle.position.x >> 0, particle.position.y >> 0);
			mainContext.restore();
		}

		document.body.insertBefore(mainCanvas, consoleContainer);

		qWindow
			.on('resize orientationchange', onResize)
			.emit('resize');

		qCanvas
			.on('touchstart click', addFirework);

		randomFirework();
		update();

		if(visibilityProperty) {
			qDocument
				.on(''.concat('visibilitychange ', mSupport.getPrefix().properties[0], 'visibilitychange'), onVisibilityChange)
				.emit('visibilitychange');
		}
	});
});