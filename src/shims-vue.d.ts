declare module '*.vue' {
	import { DefineComponent } from 'vue';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

interface Window {
	player: {
		play: (id: number) => void;
		add: (ids: number[]) => void;
		insert: (id: number) => void;
		remove: (ids: number[]) => void;
		clear: () => void;
	};
}
