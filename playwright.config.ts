import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	webServer: {
		command: 'node --run build && node --run preview',
		port: 4173,
	},
	testDir: 'e2e',
	projects: [
		{ name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
		{ name: 'desktop-chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'desktop-edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
		{ name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'desktop-safari', use: { ...devices['Desktop Safari'] } },
		{ name: 'mobile-chrome', use: { ...devices['Pixel 7'] } },
		{ name: 'mobile-safari', use: { ...devices['iPhone 15'] } },
	],
});
