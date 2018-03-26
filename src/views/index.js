const { remote, ipcRenderer } = require('electron');
const { join } = require('path');
const { readFile, writeFileSync } = require('fs');
const h = require('hyperscript');
const csv = require('fast-csv');
const { Rekapi, Actor } = require('rekapi');
const { Noise } = require('noisejs');
const { loggerStdout } = require(join(process.cwd(), 'src', 'utils', 'utils.js'));
const signals = require(join(process.cwd(), 'config', 'signals.js'));


let firstTimeStamp = null;
const dancers = new Map();
const filePath = join(process.cwd(), 'assets', 'danceData.csv');
const filePathProcessed = join(process.cwd(), 'assets', 'danceData.processed.json');
const [ winContentSizeWidth, winContentSizeHeight ] = remote.getCurrentWindow().getContentSize();
const canvas = h(
	'canvas#animationCanvas'
	, {
		width: winContentSizeWidth
		, height: winContentSizeHeight
		, onclick() {
			ipcRenderer.send('signal', 'playPause');
		}
	}
	, 'Sorry no canvas to draw on.'
);

const rekapi = new Rekapi(canvas.getContext('2d'));
const myNoise = new Noise(Math.random());

const playPause = () => {
	if (rekapi.isPlaying()) {
		rekapi.pause();
	} else {
		const replayCount = 1;

		rekapi.play(replayCount);
	}
};

const csvTransformer = ([
	dancerId
	, x
	, , y
	, timestamp
]) => [
	dancerId
	, parseFloat(x.replace(/,/g, '.'))
	, parseFloat(y.replace(/,/g, '.'))
	, parseFloat(timestamp.replace(/,/g, '.'))
];

const addPathsToDancers = ([
	dancerId
	, x
	, y
	, timestamp
]) => {
	if (dancers.has(dancerId) === false) {
		dancers.set(dancerId, []);
	}
	dancers.get(dancerId).push([ x, y, timestamp ]);
};

const normalizeDancePaths = (dancePathsMap) => {
	// projectionWidth in meter @TODO - move to settings
	const projectionWidth = 3;
	// projectionHeight in meter @TODO - move to settings
	const projectionHeight = 1.75;
	const widthCoefficient = winContentSizeWidth / projectionWidth;
	const heightCoefficient = winContentSizeHeight / projectionHeight;
	let avg = 0;
	let numberOfElements = 0;

	dancePathsMap.forEach((val) => {
		avg += val.reduce((carry, curr) => carry + curr[1], 0);
		numberOfElements += val.length;
	});
	avg /= numberOfElements;
	dancePathsMap.forEach((val) => {
		val.forEach(([ x, z, timestamp ], i, arr) => {
			let time = 0;

			if (firstTimeStamp === null) {
				firstTimeStamp = timestamp;
			} else {
				time = timestamp - firstTimeStamp;
			}

			arr[i] = [ x * widthCoefficient + winContentSizeWidth / 2, (z - avg) * heightCoefficient + winContentSizeHeight / 2, time ];
		});
	});
};

// const getRandomIntInclusive = (min, max) => {
// 	min = Math.ceil(min);
// 	max = Math.floor(max);

// 	// The maximum is inclusive and the minimum is inclusive
// 	return Math.floor(Math.random() * (max - min + 1)) + min;
// };

const myMapping = (floatVal, min, max, a, b) => {
	return (b - a) * (floatVal - min) / (max - min) + a;
};

const importTimeline = (data) => {
	const timeline = JSON.parse(data);

	rekapi.importTimeline(timeline);
};

// 2nd dimension of perlin noise
let yoff = 0.0;
const r = 65;
const angle = 360;
const steps = 60;
// 0 - 1
const amplitude = 0.7;
// 0.1 - 30
const intensity = 5;
const speed = 0.015;

/* eslint max-statements: "off" */
const renderMyShit = (ctx, state) => {
	if (!state.shouldRender) {
		return;
	}

	ctx.save();


	ctx.beginPath();
	ctx.arc(state.x, state.y, state.radius, 0, Math.PI * 2);
	ctx.closePath();

	ctx.setLineDash([ 2, 5 ]);
	ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
	ctx.stroke();

	ctx.beginPath();

	for (let i = 0; i < angle; i += angle / steps) {
		const rad = 2 * Math.PI * i / angle;
		const distance = r * myMapping(myNoise.perlin3(Math.cos(rad) * intensity + 1, Math.sin(rad) * intensity + 1, yoff), -1, 1, amplitude, 1);
		const x = state.x + Math.cos(rad) * distance;
		const y = state.y + Math.sin(rad) * distance;

		ctx.lineTo(x, y);
	}
	yoff += speed;

	ctx.closePath();

	ctx.setLineDash([]);
	ctx.strokeStyle = 'rgba(255, 92, 57, 1)';
	const gradient = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, 60);

	gradient.addColorStop(0, 'rgba(255, 92, 57, 0.0)');
	gradient.addColorStop(0.5, 'rgba(255, 92, 57, 0.2)');
	gradient.addColorStop(0.7, 'rgba(255, 92, 57, 0.4)');
	gradient.addColorStop(1, 'rgba(255, 92, 57, 1)');
	ctx.fillStyle = gradient;
	ctx.stroke();
	ctx.fill();


	ctx.restore();
};

const doMyShit = () => {
	dancers.forEach((dancerPath) => {
		const actor = new Actor({ render: renderMyShit });

		dancerPath.forEach(([ x, y, timestamp ]) => {
			if (actor.hasKeyframeAt(timestamp) === false) {
				actor.keyframe(timestamp, { x, y, shouldRender: true, radius: 50 });
			}
		});

		if (actor.hasKeyframeAt(0) === false) {
			actor.copyKeyframe(actor.getStart(), 0);
			actor.modifyKeyframe(0, { shouldRender: false });
		}

		rekapi.addActor(actor);
	});

	writeFileSync(join(process.cwd(), 'assets', 'danceData.processed.json'), JSON.stringify(rekapi.exportTimeline({ withId: true })));
};

const loadProcessCSV = () => {
	csv
		.fromPath(
			filePath
			, {
				delimiter: ';'
				, trim: true
				, ignoreEmpty: true
			}
		)
		.transform(csvTransformer)
		.on('data', addPathsToDancers)
		.on('end', () => {
			normalizeDancePaths(dancers);

			doMyShit();

			const baum = document.getElementById('loading');

			if (baum) {
				baum.remove();
			}
		});
};


// ############# calling part ###############


document.getElementById('mainAnimationContainer').appendChild(canvas);
// @TODO: Show load screen

readFile(filePathProcessed, (err, data) => {
	if (err) {
		if (err.code === 'ENOENT') {
			// Processed file does not exist.

			// @TODO: Show warning for long calculation
			// Load csv file and process it
			loadProcessCSV();

			return;
		}
		throw err;
	}

	try {
		importTimeline(data);
		rekapi.getAllActors().forEach((el) => {
			el.render = renderMyShit;
		});
	} catch (error) {
		loggerStdout(error);
		// Load csv file and process it
		loadProcessCSV();
	}

	rekapi.on('animationComplete', () => loggerStdout('animation complete'));
	document.getElementById('loading').remove();
});

ipcRenderer.on('signal', (event, message) => {
	if (signals.get('playPause') === message) {
		playPause();
	}
	loggerStdout(message);
});

