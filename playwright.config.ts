import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'node --run build && node --run preview',
		port: 4173
	},
	testDir: 'e2e'
});
