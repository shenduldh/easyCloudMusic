<template>
	<div class="relative w-full h-full">
		<!-- 歌曲信息 -->
		<div class="flex h-full w-full relative">
			<img @click="isShowPureUI = true" class="h-full pt-1 cursor-pointer" :src="curSongDetail.cover" />
			<div class="ml-2 mt-3">
				<div class="text-xs">{{ curSongDetail.name }}</div>
				<div class="text-us my-1">{{ curSongDetail.singers.map(singer => singer.name).join('|') }}</div>
			</div>
		</div>
		<!-- 播放控制 -->
		<div class="flex items-center ml-10 mt-1 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<!-- 播放模式 -->
			<Icon @click="togglePlayMode" class="w-4 h-4 cursor-pointer" :name="config.playMode" />
			<!-- 上一曲 -->
			<Icon @click="go(-1)" class="w-7 h-7 mx-2 cursor-pointer" name="last" />
			<!-- 播放/暂停 -->
			<Icon @click="togglePlayStatus" class="w-8 h-8 cursor-pointer" :name="playStatus" />
			<!-- 下一曲 -->
			<Icon @click="go(1)" class="w-7 h-7 mx-1 cursor-pointer" name="next" />
			<!-- 音量控制 -->
			<Icon @click="toggleVolumeStatus" class="w-4 h-4 mx-1 cursor-pointer" :name="volumeStatus" />
			<StatusBar v-model:progress="config.volume" />
		</div>
		<!-- 下载、播放列表 -->
		<div class="flex items-center mt-1 absolute top-1/2 right-0 transform -translate-y-1/2">
			<Icon @click="download" class="w-4 h-4 cursor-pointer" name="download" />
			<Icon @click="isShowPlaylist = !isShowPlaylist" class="w-6 h-6 mx-2 cursor-pointer" name="list" />
			<Playlist :list="config.playlist" :isShow="isShowPlaylist" />
		</div>
		<!-- 进度条 -->
		<div class="absolute top-0 left-0 w-full">
			<StatusBar :isAllowed="isAllowJumping" :hdInput="dragProgress" class="w-full" v-model:progress="progress" />
		</div>
	</div>
	<PureUI :id="config.curSongId" v-model:isShow="isShowPureUI" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import StatusBar from './StatusBar.vue';
import Playlist from './Playlist.vue';
import PureUI from './PureUI.vue';
import { Song } from '../utils/types';
import defaultCoverURL from '../assets/cover.png';
import pickNext from '../utils/pickNext';

export default defineComponent({
	components: { StatusBar, Playlist, PureUI },
	data() {
		return {
			audio: new Audio(),
			config: {
				curSongId: -1,
				playlist: new Array<number>(),
				volume: 100,
				playMode: 'loop',
			},
			progress: 0,
			duration: 0,
			playStatus: 'play',
			lastVolume: 100,
			isLockProgress: false,
			isAllowJumping: false,
			isShowPlaylist: false,
			isShowPureUI: false,
		};
	},
	computed: {
		songs(): Song[] {
			return this.$store.state.netease.songs;
		},
		// 当前歌曲信息
		curSongDetail(): { name: string; cover: string; singers: { id: number; name: string }[] } {
			const curSongId = this.config.curSongId;
			if (curSongId > 0) {
				const song = this.songs.find(song => song.id == curSongId);
				if (song)
					return {
						name: song.name,
						cover: song.cover,
						singers: song.singers,
					};
			}
			return {
				name: '简易云音乐',
				cover: defaultCoverURL,
				singers: [],
			};
		},
		// 音量状态
		volumeStatus(): string {
			const volume = this.config.volume;
			this.audio.volume = volume / 100;
			if (volume == 0) return 'muted';
			if (volume <= 20) return 'volume1';
			if (volume <= 40) return 'volume2';
			if (volume <= 60) return 'volume3';
			if (volume <= 80) return 'volume4';
			return 'volume5';
		},
	},
	methods: {
		// 加载指定歌曲资源
		async load(id: number) {
			if (id < 0) return;

			// 从歌曲库中查找歌曲资源
			const song = this.songs.find(song => song.id == id);
			if (song && song.url) {
				this.audio.src = song.url;
				return Promise.resolve(song.url);
			}

			// 或通过 http 获取歌曲资源
			return this.$store.dispatch('netease/get_song_url', [id]).then(data => {
				this.audio.src = data[0].url;
				return data[0].url;
			});
		},
		// 播放指定音乐
		async play(id: number) {
			if (id < 0) return;

			// 默认行为: 如果指定播放的歌曲不在播放列表中, 则将其插入到下一首中
			const playlist = this.config.playlist;
			if (!playlist.includes(id)) this.insert(id);

			// 将指定播放的歌曲设置为当前歌曲
			this.config.curSongId = id;

			// 加载资源
			await this.load(id);
			// 播放
			this.audio.play();
		},
		// 上一曲/下一曲
		go(type: -1 | 1) {
			const playlist = this.config.playlist;
			const curSongId = this.config.curSongId;
			const nextId = pickNext(playlist, curSongId, type);
			if (nextId) this.play(nextId);
		},
		// 暂停/开始播放
		togglePlayStatus() {
			if (!this.audio.paused) {
				this.audio.pause();
				return;
			}
			if (this.audio.readyState) {
				this.audio.play();
				return;
			}
			const curSongId = this.config.curSongId;
			if (curSongId >= 0) {
				this.play(curSongId);
				return;
			}
			const firstSongId = this.config.playlist[0];
			if (firstSongId) this.play(firstSongId);
		},
		// 切换静音模式
		toggleVolumeStatus() {
			if (this.config.volume > 0) {
				this.lastVolume = this.config.volume;
				this.config.volume = 0;
			} else this.config.volume = this.lastVolume;
		},
		// 切换播放模式
		togglePlayMode() {
			const modeList = ['loop', 'random', 'once'];
			const curPlayMode = this.config.playMode;
			this.config.playMode = pickNext(modeList, curPlayMode);
		},
		// 拖动进度条
		dragProgress(value: number) {
			this.isLockProgress = true; // 锁定, 不让进度条前进
			const duration = Number(this.audio.duration.toFixed(3));
			this.audio.currentTime = (value * duration) / 100;
			this.isLockProgress = false;
		},
		// 下载
		download() {
			const link = document.createElement('a');
			link.download = this.curSongDetail.name + '.mp3';
			link.style.display = 'none';
			link.href = this.audio.src;
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},
		// 操控播放列表:
		// 添加某首/些歌曲
		add(ids: number[]) {
			this.remove(ids); // 避免重复
			ids.forEach(id => this.config.playlist.push(id));
		},
		// 插入一首歌到当前歌曲的后面
		insert(id: number) {
			this.remove([id]); // 避免重复
			const playlist = this.config.playlist;
			const curSongId = this.config.curSongId;
			const curSongIndex = playlist.findIndex(songId => songId == curSongId);
			if (curSongIndex >= 0) playlist.splice(curSongIndex + 1, 0, id);
			else playlist.push(id);
		},
		// 移除某首/些歌曲
		remove(ids: number[]) {
			const playlist = this.config.playlist;
			ids.forEach(id => {
				const index = playlist.findIndex(songId => songId == id);
				if (index >= 0) playlist.splice(index, 1);
			});
		},
		// 清除所有歌曲
		clear() {
			this.config.playlist = [];
		},
	},
	mounted() {
		// 初始化, 加载缓存的配置
		(async () => {
			const data = localStorage.getItem('player_config');
			if (data) {
				const config = JSON.parse(data);
				this.config.playlist = config.playlist;
				this.config.curSongId = config.curSongId;
				this.config.volume = config.volume;
				this.config.playMode = config.playMode;
				await this.load(config.curSongId);
			}
		})();

		// 监听进度, 并设置进度条
		this.audio.ontimeupdate = () => {
			const duration = Number(this.audio.duration.toFixed(3));
			const currentTime = Number(this.audio.currentTime.toFixed(3));
			let progress = (currentTime / duration) * 100;
			if (isNaN(duration)) progress = 0;
			if (!this.isLockProgress) this.progress = progress;
		};

		// 状态处理:
		this.audio.onpause = () => {
			this.playStatus = 'play';
		};
		this.audio.onplay = () => {
			this.playStatus = 'pause';
		};
		this.audio.oncanplay = () => {
			this.isAllowJumping = true;
		};
		// 处理当前播放的歌曲出错的情况 (①灰色歌曲; ②资源加载出错)
		this.audio.onerror = () => {
			if (this.audio.src == 'disabled') return;
			const curSongId = this.config.curSongId;
			if (curSongId < 0) return;
			// 首先认为该歌曲播放完毕, 然后根据播放模式尝试播放下一曲
			const playlist = this.config.playlist;
			const playlistLength = playlist.length;
			if (playlistLength > 1) {
				// 根据播放模式尝试播放下一曲
				const playMode = this.config.playMode;
				if (['once', 'loop'].includes(playMode)) this.go(1);
				if (playMode == 'random') {
					const curSongIndex = playlist.findIndex(songId => songId == curSongId);
					let randomIndex;
					do randomIndex = Math.floor(Math.random() * playlistLength);
					while (curSongIndex == randomIndex);
					this.play(playlist[randomIndex]);
				}
			}
			// 判断是不是灰色歌曲, 如果是, 则还需要从播放列表删除之
			// 如果是资源加载出错的原因, 则不需要删除
			if (!this.audio.src) this.remove([curSongId]);
		};

		// 监听歌曲是否结束, 然后根据播放模式选择下一首歌曲
		this.audio.onended = () => {
			const curSongId = this.config.curSongId;
			const playMode = this.config.playMode;
			if (playMode == 'once') this.play(curSongId);
			if (playMode == 'loop') this.go(1);
			if (playMode == 'random') {
				const playlist = this.config.playlist;
				const playlistLength = playlist.length;
				if (playlistLength == 1) {
					this.play(playlist[0]);
					return;
				}
				const curSongIndex = playlist.findIndex(songId => songId == curSongId);
				let randomIndex;
				do randomIndex = Math.floor(Math.random() * playlistLength);
				while (curSongIndex == randomIndex);
				this.play(this.config.playlist[randomIndex]);
			}
		};

		// 监听播放列表的长度
		this.$watch(
			() => this.config.playlist.length,
			(newValue: number) => {
				// 当列表没有歌曲时, 将播放器状态设置为不可用
				if (newValue == 0) {
					this.audio.src = 'disabled';
					this.config.curSongId = -1;
					this.playStatus = 'play';
					this.progress = 0;
					this.isAllowJumping = false;
				}
			},
			{ immediate: true }
		);

		// 监听配置变化, 保存配置
		this.$watch(
			() => this.config,
			(newValue: Object) => {
				localStorage.setItem('player_config', JSON.stringify(newValue));
			},
			{ deep: true }
		);
	},
});
</script>
