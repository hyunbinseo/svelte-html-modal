import { expect, test } from '@playwright/test';

test('component features', async ({ page }) => {
	await page.goto('/');

	const dialog = page.locator('dialog');

	const modal = {
		show: page.locator('button[data-testid="show()"]'),
		close: page.locator('button[data-testid="close()"]'),
	};

	const button = {
		open: page.locator('button[data-testid="open"]'),
		close: page.locator('button[data-testid="close"]'),
		submit: page.locator('button[data-testid="submit"]'),
	};

	const checkbox = {
		closeWithBackdrop: page.locator('input[type="checkbox"][data-testid="backdrop"]'),
		closeWithEscapeKey: page.locator('input[type="checkbox"][data-testid="esc"]'),
	};

	await modal.show.click();
	await expect(dialog).toHaveAttribute('data-is-open', 'true');
	await expect(dialog).toHaveAttribute('open');

	await modal.close.click();
	await expect(dialog).toHaveAttribute('data-is-open', 'false');
	await expect(dialog).not.toHaveAttribute('open');

	await button.open.click();
	await expect(dialog).toHaveAttribute('data-is-open', 'true');
	await expect(dialog).toHaveAttribute('open');

	await button.close.click();
	await expect(dialog).toHaveAttribute('data-is-open', 'false');
	await expect(dialog).not.toHaveAttribute('open');

	await button.open.click();
	await button.submit.click();
	await expect(dialog).toHaveAttribute('data-is-open', 'false');
	await expect(dialog).not.toHaveAttribute('open');

	await checkbox.closeWithBackdrop.uncheck();
	await button.open.click();
	await page.mouse.click(0, 0);
	await expect(dialog).toHaveAttribute('data-is-open', 'true');
	await expect(dialog).toHaveAttribute('open');
	await button.close.click();

	// Elements outside of the modal cannot be focused. The modal must first be closed.
	// See https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert

	await checkbox.closeWithBackdrop.check();
	await button.open.click();
	await page.mouse.click(0, 0);
	await expect(dialog).toHaveAttribute('data-is-open', 'false');
	await expect(dialog).not.toHaveAttribute('open');

	await checkbox.closeWithEscapeKey.uncheck();
	await button.open.click();
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveAttribute('data-is-open', 'true');
	await expect(dialog).toHaveAttribute('open');
	await button.close.click();

	await checkbox.closeWithEscapeKey.check();
	await button.open.click();
	await page.keyboard.press('Escape');
	await expect(dialog).toHaveAttribute('data-is-open', 'false');
	await expect(dialog).not.toHaveAttribute('open');
});

test('open via client-side navigation', async ({ page }) => {
	await page.goto('/');
	await page.click('a[href*="opened-by-default"]');
	await page.waitForURL('/opened-by-default');

	const dialog = page.locator('dialog');
	await expect(dialog).toHaveAttribute('data-is-open', 'true');
	await expect(dialog).toHaveAttribute('open');
});

test('open via server-side rendering', async ({ page }) => {
	await page.goto('/opened-by-default');

	const dialog = page.locator('dialog');
	await expect(dialog).toHaveAttribute('data-is-open', 'true');
	await expect(dialog).toHaveAttribute('open');
});
