import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import viteSvgIcons from 'vite-plugin-svg-icons';
import path from 'path';

export default defineConfig({
	plugins: [
		vue(),
		viteSvgIcons({
			iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
			symbolId: 'icon-[dir]-[name]',
		}),
	],
});
