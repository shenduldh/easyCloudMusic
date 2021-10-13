<template>
	<div>
		<Icon @click="isShow = !isShow" name="menu" class="w-4 h-4 cursor-pointer" />
		<div
			v-show="isShow"
			class="flex flex-col space-y-1.5 z-10 fixed top-10 left-1 w-2/12 h-32 bg-gray-100 shadow-md p-2"
		>
			<router-link @click="isShow = !isShow" :to="Path.Home">我的仓库</router-link>
			<router-link @click="isShow = !isShow" :to="Path.Netease">网易云音乐</router-link>
			<router-link @click="isShow = !isShow" to="">QQ音乐</router-link>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Path } from '../utils/types';

export default defineComponent({
	data() {
		return {
			isShow: false,
			Path,
		};
	},
});
</script>

<style scoped></style>
