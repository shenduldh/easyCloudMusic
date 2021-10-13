<template>
	{{ platform }} <br />
	<input class="border-black border-2" type="text" v-model="account" /><br />
	<input class="border-black border-2" type="text" v-model="password" /><br />
	<button @click="loginNetease">登录</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Cookie from 'js-cookie';
import requestNetease from '../utils/restfulApis/request/netease';
import { API } from '../utils/types';

export default defineComponent({
	props: {
		platform: {
			require: true,
			type: String,
		},
	},
	data() {
		return { account: '13751963776', password: '55328355533192' };
	},
	methods: {
		async loginNetease() {
			const cookie = await requestNetease[API.LoginByPhone](this.account, this.password);
			Cookie.set('netease', cookie, { expires: 14 });
			this.$router.push('/netease');
		},
	},
});
</script>

<style scoped></style>
