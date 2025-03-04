import { Howl } from "howler";

export const pauseBackgroundMusic = () => {
	if (backgroundMusic.playing()) {
		backgroundMusic.pause();
	}
};

export const resumeBackgroundMusic = () => {
	if (!backgroundMusic.playing()) {
		backgroundMusic.play();
	}
};
export const backgroundMusic = new Howl({
	src: ["/sounds/playingsound.mp3"],
	volume: 0.5,
	loop: true,
});

export const SpecialSound = new Howl({
	src: ["/sounds/special.mp3"],
	volume: 0.5,
	loop: false,
	onend: resumeBackgroundMusic, 
});


export const spinSound = new Howl({
	src: ["/sounds/clicksound.mp3"],
	volume: 1.0,
	loop: false,
	onend: resumeBackgroundMusic, 
});

export const winSound = new Howl({
	src: ["/sounds/win.mp3"],
	volume: 1.0,
	loop: false,
	onend: resumeBackgroundMusic, 
});

export const gameOverSound = new Howl({
	src: ["/sounds/Clickplay.mp3"],
	volume: 1.0,
	onend: resumeBackgroundMusic, 
});

export const jackpotSound = new Howl({
	src: ["/sounds/loading_swish.mp3"],
	volume: 1.0,
	loop: false,
	onend: resumeBackgroundMusic, 
});

export const onClickPlay = new Howl({
	src: ["/sounds/pharoah.mp3"],
	volume: 1.0,
	onend: resumeBackgroundMusic, 
});

export const multiplierSound = new Howl({
	src: ["/sounds/mega_swish.mp3"],
	volume: 1.0,
	loop: false,
	onend: resumeBackgroundMusic, 
});
