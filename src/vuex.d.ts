import { Store } from 'vuex';
import { State } from './utils/types';

declare module '@vue/runtime-core' {
	interface ComponentCustomProperties {
		$store: Store<State>;
	}
}
