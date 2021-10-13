<template>
	<Cards class="w-min mx-auto mt-2" :items="lists" #="{ item }">
		<router-link :to="`/netease/list/${item.id}`">
			<div class="w-full h-full bg-contain" :style="{ backgroundImage: `url(${item.cover})` }"></div>
			<p class="text-us leading-4">{{ item.name }}</p>
		</router-link>
	</Cards>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cards from '../../components/Cards.vue';

export default defineComponent({
	components: { Cards },
	computed: {
		lists() {
			return this.$store.state.netease.lists.filter(list => list.type.includes('daily'));
		},
	},
	async mounted() {
		if (this.lists.length > 0) return;
		await this.$store.dispatch('netease/get_daily_songs', 'daily');
		await this.$store.dispatch('netease/get_daily_lists');
	},
});
</script>
