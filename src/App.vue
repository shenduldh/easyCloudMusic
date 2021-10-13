<template>
	<Layout />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Layout from './pages/Layout.vue';

export default defineComponent({
	components: { Layout },
});
</script>

<style lang="postcss">
::-webkit-scrollbar {
	@apply hidden;
}
</style>
