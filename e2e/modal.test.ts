import { expect, test } from '@playwright/test';

test('modal component features', async ({ page }) => {
	await page.goto('/');

	const modal = page.locator('dialog');

	const button = {
		open: page.locator('button[data-testid="open"]'),
		close: page.locator('button[data-testid="close"]'),
		submit: page.locator('button[data-testid="submit"]'),
	};

	const checkbox = {
		closeWithBackdrop: page.locator('input[type="checkbox"][data-testid="backdrop"]'),
		closeWithEscapeKey: page.locator('input[type="checkbox"][data-testid="esc"]'),
	};

	await button.open.click();
	await expect(modal).toHaveAttribute('open');

	await button.close.click();
	await modal.waitFor({ state: 'hidden' });
	await expect(modal).not.toHaveAttribute('open');

	const consoleMessages = (await page.consoleMessages()).filter((msg) => msg.type() === 'log');
	expect(consoleMessages.length).toEqual(2);
	expect(consoleMessages.map((msg) => msg.text())).toEqual(['closing', 'closed']);

	await button.open.click();
	await button.submit.click();
	await expect(modal).not.toHaveAttribute('open');

	await checkbox.closeWithBackdrop.uncheck();
	await button.open.click();
	await page.mouse.click(0, 0);
	await expect(modal).toHaveAttribute('open');
	await button.close.click();

	// Elements outside of the modal cannot be focused. The modal must first be closed.
	// Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert

	await checkbox.closeWithBackdrop.check();
	await button.open.click();
	await page.mouse.click(0, 0);
	await expect(modal).not.toHaveAttribute('open');

	await checkbox.closeWithEscapeKey.uncheck();
	await button.open.click();
	await page.keyboard.press('Escape');
	await expect(modal).toHaveAttribute('open');
	await button.close.click();

	await checkbox.closeWithEscapeKey.check();
	await button.open.click();
	await page.keyboard.press('Escape');
	await expect(modal).not.toHaveAttribute('open');
});

test('modal open via client-side navigation', async ({ page }) => {
	await page.goto('/');
	await page.click('a[href*="is-open"]');
	await page.waitForURL('/is-open');

	const modal = page.locator('dialog');
	await expect(modal).toHaveAttribute('open');
});

test('modal open via server-side rendering', async ({ page }) => {
	await page.goto('/is-open');
	const modal = page.locator('dialog');
	await expect(modal).toHaveAttribute('open');
});
