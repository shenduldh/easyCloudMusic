<template>
	<div class="grid grid-cols-list gap-y-9 gap-x-7">
		<div class="w-full h-32" v-for="(item, index) in items" :key="index">
			<slot :item="item"></slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	props: {
		items: {
			require: true,
			type: Object as PropType<{ [index: string]: string }[]>,
		},
	},
});
</script>

<style scoped></style>
