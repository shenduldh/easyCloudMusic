<template>
	<div class="flex justify-center mb-1">
		<router-link
			class="w-20 p-2 text-center text-xs shadow-lg m-2 bg-gray-100"
			v-for="route in routes"
			:key="route.path"
			:to="route.path"
			>{{ route.meta.name }}</router-link
		>
	</div>
	<div>
		<router-view></router-view>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	computed: {
		routes() {
			return this.$route.matched[0].children.filter(child => !!child.meta);
		},
	},
});
</script>

<style scoped></style>
