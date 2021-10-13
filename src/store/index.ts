import { createStore } from 'vuex';
import netease from './netease';
import home from './home';

const store = createStore({
	modules: {
		netease,
		home,
	},
});

export default store;
