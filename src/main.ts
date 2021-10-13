import { createApp } from 'vue';
import './index.css';
import store from './store';
import router from './router';
import App from './App.vue';
import Icon from './components/Icon.vue';
import 'virtual:svg-icons-register';

const app = createApp(App);

app.component('Icon', Icon);
app.use(store);
app.use(router);
app.mount('#app');
