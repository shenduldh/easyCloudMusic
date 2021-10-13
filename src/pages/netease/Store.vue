<template>
	<div class="w-min mx-auto">
		创建的歌单
		<Cards :items="createdLists" #="{ item }">
			<router-link :to="`/netease/list/${item.id}`">
				<div class="w-full h-full bg-contain" :style="{ backgroundImage: `url(${item.cover})` }"></div>
				<p class="text-us leading-4">{{ item.name }}</p>
			</router-link>
		</Cards>
	</div>
	<div class="w-min mx-auto mt-9">
		收藏的歌单
		<Cards :items="collectedLists" #="{ item }">
			<router-link :to="`/netease/list/${item.id}`">
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
		userId(): number {
			return this.$store.state.netease.user.id;
		},
		lists(): List[] {
			return this.$store.state.netease.lists.filter(list => list.type.includes('mine'));
		},
		createdLists(): List[] {
			return this.lists.filter(list => list.userId == this.userId);
		},
		collectedLists(): List[] {
			return this.lists.filter(list => list.userId != this.userId);
		},
	},
	mounted() {
		if (this.lists.length > 0) return;
		const uid = this.$store.state.netease.user.id;
		this.$store.dispatch('netease/get_lists', uid);
	},
});
</script>
