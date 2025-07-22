
let player;
let isPlaying = false;
let currentSongIndex = 0;
let isShuffle = false;
let isRepeat = false;
let updateInterval;

const songs = [
	{
		title: "Muhammad Nabina Binuru Hadina",
		artist: "Islamic Nasheed",
		duration: "4:45",
		cover: "https://i.ytimg.com/vi/8-NbT05VykQ/maxresdefault.jpg",
		videoId: "8-NbT05VykQ"
	},
	{
		title: "Bika Mulhimi",
		artist: "Maher Zain",
		duration: "4:36",
		cover: "https://i.ytimg.com/vi/BOiZeJdAoNQ/maxresdefault.jpg",
		videoId: "BOiZeJdAoNQ"
	},
	{
		title: "Ya Nabi Salam Alaika",
		artist: "Islamic Nasheed",
		duration: "5:10",
		cover: "https://i.ytimg.com/vi/e_1V_00R_Lc/maxresdefault.jpg",
		videoId: "e_1V_00R_Lc"
	},
	{
		title: "Ya Man Salaita Bi Kulil Anbiya",
		artist: "Maher Zain",
		duration: "3:50",
		cover: "https://i.ytimg.com/vi/WbkooeqB7wQ/maxresdefault.jpg",
		videoId: "WbkooeqB7wQ"
	},
	{
		title: "Tajdar e Haram",
		artist: "Atif Aslam (Coke Studio)",
		duration: "10:28",
		cover: "https://i.ytimg.com/vi/a18py61_F_w/maxresdefault.jpg",
		videoId: "a18py61_F_w"
	},
	// {
	// 	title: "Tu Kuja Man Kuja",
	// 	artist: "Coke Studio",
	// 	duration: "8:50",
	// 	cover: "https://i.ytimg.com/vi/ZQMn5wIoAno/maxresdefault.jpg",
	// 	videoId: "ZQMn5wIoAno"
	// },
	{
		title: "Balaghal Ula Bikamalihi",
		artist: "Ali Zafar",
		duration: "9:13",
		cover: "https://i.ytimg.com/vi/yR9ZW4mS_EA/maxresdefault.jpg",
		videoId: "yR9ZW4mS_EA"
	}
];

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
const firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
	player = new YT.Player('youtube-player', {
		height: '0',
		width: '0',
		videoId: songs[currentSongIndex].videoId,
		playerVars: {
			'playsinline': 1,
			'enablejsapi': 1,
			'autoplay': 0,
			'controls': 0
		},
		events: {
			'onReady': function (event) {
				document.getElementById('status').textContent = "Ready to play";
				player.setVolume(70);
				document.querySelector('.volume').style.width = '70%';
				document.getElementById('play').addEventListener('click', togglePlay);
				document.getElementById('prev').addEventListener('click', prevSong);
				document.getElementById('next').addEventListener('click', nextSong);
				document.querySelector('.progress-bar').addEventListener('click', setProgress);
				document.querySelector('.volume-slider').addEventListener('click', setVolume);
				document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
				document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
				document.querySelectorAll('.playlist-item').forEach((item, index) => {
					item.addEventListener('click', function () {
						currentSongIndex = index;
						loadSong(currentSongIndex);
						player.playVideo();
					});
				});
			},
			'onStateChange': function (event) {
				const status = document.getElementById('status');
				const albumArt = document.querySelector('.album-art');
				const playBtn = document.getElementById('play');

				if (event.data == YT.PlayerState.PLAYING) {
					isPlaying = true;
					playBtn.classList.remove('fa-play');
					playBtn.classList.add('fa-pause');
					albumArt.classList.add('playing');
					status.textContent = "Now playing";
					clearInterval(updateInterval);
					updateInterval = setInterval(updateProgress, 1000);
				} else if (event.data == YT.PlayerState.PAUSED) {
					isPlaying = false;
					playBtn.classList.remove('fa-pause');
					playBtn.classList.add('fa-play');
					albumArt.classList.remove('playing');
					status.textContent = "Paused";
					clearInterval(updateInterval);
				} else if (event.data == YT.PlayerState.ENDED) {
					nextSong();
				} else if (event.data == YT.PlayerState.BUFFERING) {
					status.textContent = "Buffering...";
				}
			}
		}
	});
}

function loadSong(songIndex) {
	const song = songs[songIndex];

	document.getElementById('song-title').textContent = song.title;
	document.getElementById('song-artist').textContent = song.artist;
	document.querySelector('.album-art img').src = song.cover;
	document.getElementById('song-duration').textContent = song.duration;

	if (player) {
		player.loadVideoById(song.videoId);
		player.pauseVideo();
		isPlaying = false;
		document.getElementById('play').classList.remove('fa-pause');
		document.getElementById('play').classList.add('fa-play');
		document.querySelector('.album-art').classList.remove('playing');
		document.getElementById('status').textContent = "Ready to play";
		document.querySelector('.progress').style.width = '0%';
		document.getElementById('current-time').textContent = '0:00';
	}

	document.querySelectorAll('.playlist-item').forEach((item, index) => {
		if (index === songIndex) {
			item.classList.add('active');
		} else {
			item.classList.remove('active');
		}
	});
}

function togglePlay() {
	if (!player) return;
	if (isPlaying) {
		player.pauseVideo();
	} else {
		player.playVideo();
	}
}

function prevSong() {
	currentSongIndex--;
	if (currentSongIndex < 0) {
		currentSongIndex = songs.length - 1;
	}
	loadSong(currentSongIndex);
	if (isPlaying) {
		player.playVideo();
	}
}

function nextSong() {
	if (isShuffle) {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * songs.length);
		} while (newIndex === currentSongIndex);
		currentSongIndex = newIndex;
		loadSong(currentSongIndex);
		if (isPlaying) {
			player.playVideo();
		}
		return;
	}

	currentSongIndex++;
	if (currentSongIndex > songs.length - 1) {
		if (isRepeat) {
			currentSongIndex = 0;
		} else {
			currentSongIndex = 0;
			player.pauseVideo();
			return;
		}
	}
	loadSong(currentSongIndex);
	if (isPlaying) {
		player.playVideo();
	}
}

function toggleShuffle() {
	isShuffle = !isShuffle;
	const shuffleBtn = document.getElementById('shuffle-btn');
	if (isShuffle) {
		shuffleBtn.classList.add('active');
		shuffleBtn.innerHTML = '<i class="fas fa-random"></i> Shuffle On';
	} else {
		shuffleBtn.classList.remove('active');
		shuffleBtn.innerHTML = '<i class="fas fa-random"></i> Shuffle';
	}
}

function toggleRepeat() {
	isRepeat = !isRepeat;
	const repeatBtn = document.getElementById('repeat-btn');
	if (isRepeat) {
		repeatBtn.classList.add('active');
		repeatBtn.innerHTML = '<i class="fas fa-redo"></i> Repeat On';
	} else {
		repeatBtn.classList.remove('active');
		repeatBtn.innerHTML = '<i class="fas fa-redo"></i> Repeat';
	}
}

function setProgress(e) {
	if (!player) return;
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const duration = player.getDuration();
	if (isNaN(duration)) return;
	const newTime = (clickX / width) * duration;
	player.seekTo(newTime, true);
}

function setVolume(e) {
	if (!player) return;
	const width = this.clientWidth;
	const clickX = e.offsetX;
	const volumeLevel = Math.min(100, Math.max(0, Math.round((clickX / width) * 100)));
	player.setVolume(volumeLevel);
	document.querySelector('.volume').style.width = `${volumeLevel}%`;
}

function updateProgress() {
	if (!player || !player.getCurrentTime) return;
	const currentTime = player.getCurrentTime();
	const duration = player.getDuration();
	if (isNaN(duration)) return;
	const progressPercent = (currentTime / duration) * 100;
	document.querySelector('.progress').style.width = `${progressPercent}%`;
	const currentMinutes = Math.floor(currentTime / 60);
	let currentSeconds = Math.floor(currentTime % 60);
	if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
	document.getElementById('current-time').textContent = `${currentMinutes}:${currentSeconds}`;
}