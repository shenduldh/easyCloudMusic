<template>
	<button @click="add" class="text-sm ml-5 shadow-md p-1">添加歌单</button>
	<div class="w-min mx-auto mt-3">
		<Cards :items="lists" #="{ item }">
			<router-link :to="`/home/list/${item.id}`">
				<div class="w-full h-full bg-contain" :style="{ backgroundImage: `url(${item.cover})` }"></div>
				<p class="text-us leading-4">{{ item.name }}</p>
			</router-link>
		</Cards>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { List } from '../../utils/types';
import Cards from '../../components/Cards.vue';

export default defineComponent({
	components: { Cards },
	computed: {
		lists(): List[] {
			return this.$store.state.home.lists;
		},
	},
	methods: {
		add() {
			this.$store.commit('home/ADD_LIST', {
				name: '未知',
				songIds: [],
			});
		},
	},
});
</script>
