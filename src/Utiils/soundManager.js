import { Howl, Howler } from "howler";

// Background music (looped)
export const backgroundMusic = new Howl({
	src: ["/sounds/playingsound.mp3"],
	volume: 0.5,
	loop: true,
	
});

// Function to pause and resume background music
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

// Spin sound
export const spinSound = new Howl({
	src: ["/sounds/clicksound.mp3"],
	volume: 1.0,
	loop: false,
	onend: resumeBackgroundMusic, // Resume background music after spin sound
});

// Win sound
export const winSound = new Howl({
	src: ["/sounds/win.mp3"],
	volume: 1.0,
	loop: false,
	onend: resumeBackgroundMusic, // Resume background music after win sound
});

// Game over sound
export const gameOverSound = new Howl({
	src: ["/sounds/game-over.mp3"],
	volume: 1.0,
	loop: false,
	onend: resumeBackgroundMusic, // Resume background music after game over sound
});
