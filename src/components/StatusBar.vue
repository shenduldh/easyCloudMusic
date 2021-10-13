<template>
	<div class="relative h-1 w-24">
		<div class="absolute top-0 left-0 w-full h-full z-20 rounded">
			<input
				type="range"
				:min="min"
				:max="max"
				:step="step"
				:value="progress"
				:disabled="!isAllowed"
				@input="handleInput($event.target.value)"
			/>
		</div>
		<div
			class="absolute z-0 top-0 left-0 h-full bg-green-200 z-10 rounded"
			:style="{ width: progress + '%' }"
		></div>
		<div class="absolute z-0 top-0 left-0 h-full w-full bg-gray-100 rounded"></div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	props: {
		min: {
			require: false,
			default: 0,
		},
		max: {
			require: false,
			default: 100,
		},
		step: {
			require: false,
			default: 0.001,
		},
		progress: {
			require: true,
			type: Number,
		},
		hdInput: {
			require: false,
			type: Function,
		},
		isAllowed: {
			require: false,
			default: true,
		},
	},
	methods: {
		handleInput(value: string) {
			const _value = Number(value);
			this.$emit('update:progress', _value);
			this.hdInput?.(_value);
		},
	},
});
</script>

<style lang="postcss" scoped>
.hover {
	@apply border-2 border-gray-200;
	@apply border-opacity-0 hover:border-opacity-100;
}
input,
input::-webkit-slider-thumb {
	@apply w-full h-full hover bg-transparent;
	@apply appearance-none align-top rounded;
}

input::-webkit-slider-thumb {
	@apply w-2 h-2;
	@apply bg-green-200 rounded;
}
</style>
