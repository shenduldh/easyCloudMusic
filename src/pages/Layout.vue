<template>
	<header class="flex justify-between items-center h-dh shadow-md">
		<!-- 菜单 -->
		<Menu class="ml-1" />
		<!-- 搜索栏 -->
		<input @keyup.enter="search" v-model="keywords" class="border-gray-200 border-2 w-80 h-5" type="text" />
		<!-- 下拉设置菜单 -->
		<Icon class="w-4 h-4 cursor-pointer mr-1" name="setting" />
	</header>

	<main class="h-dm overflow-auto">
		<router-view></router-view>
	</main>
	<footer class="h-df">
		<Player ref="player" />
	</footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Menu from '../components/Menu.vue';
import Player from '../components/Player.vue';

export default defineComponent({
	components: { Menu, Player },
	data: () => ({ keywords: '' }),
	methods: {
		search() {
			this.$router.push('/search/song?kws=' + this.keywords);
		},
	},
	mounted() {
		window.player = this.$refs.player as any;
		this.$store.commit('home/SET_LISTS');
	},
});
</script>
