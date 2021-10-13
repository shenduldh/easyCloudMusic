<template>
	<div>
		<table class="w-full table-fixed">
			<thead>
				<th class="text-left" v-for="(head, index) in heads" :key="index" :style="{ width: head[1] }">
					{{ head[0] }}
				</th>
			</thead>
			<tbody>
				<tr
					:class="{
						tableRow: true,
						'bg-gray-200': Number(index) % 2 == 0,
						'hover:bg-gray-100': true,
					}"
					v-for="(item, index) in items"
					:key="index"
				>
					<slot :item="item"></slot>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
	props: {
		heads: {
			require: true,
			type: Array,
		},
		items: {
			require: true,
			type: Object as PropType<{ [index: string]: string }[]>,
		},
	},
});
</script>

<style lang="postcss">
.tableRow > td {
	@apply truncate;
}
</style>
