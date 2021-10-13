<template>
	<svg class="w-4 h-4 align-middle" aria-hidden="true">
		<use :xlink:href="symbolId" :fill="color" />
	</svg>
</template>

<script>
import { defineComponent, computed } from 'vue';

export default defineComponent({
	props: {
		name: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			default: '#333',
		},
	},
	setup(props) {
		const symbolId = computed(() => `#icon-${props.name}`);
		return { symbolId };
	},
});
</script>
