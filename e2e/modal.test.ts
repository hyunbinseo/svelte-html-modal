import { expect, test } from '@playwright/test';

test('modal functionality', async ({ page }) => {
	await page.goto('/');

	//

	const modal = page.locator('dialog');

	const openButton = page.locator('button[data-testid="open"]');
	const closeButton = page.locator('button[data-testid="close"]');
	const submitButton = page.locator('button[data-testid="submit"]');

	const backdropCheckbox = page.locator('input[type="checkbox"][data-testid="backdrop"]');
	const escCheckbox = page.locator('input[type="checkbox"][data-testid="esc"]');

	//

	await openButton.click();
	await expect(modal).toHaveAttribute('open');

	await closeButton.click();
	await expect(modal).not.toHaveAttribute('open');

	await openButton.click();
	await submitButton.click();
	await expect(modal).not.toHaveAttribute('open');

	await backdropCheckbox.uncheck();
	await openButton.click();
	await page.mouse.click(0, 0);
	await expect(modal).toHaveAttribute('open');
	await closeButton.click();

	// Elements outside of the modal cannot be focused. The modal must first be closed.
	// Reference https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert

	await backdropCheckbox.check();
	await openButton.click();
	await page.mouse.click(0, 0);
	await expect(modal).not.toHaveAttribute('open');

	await escCheckbox.uncheck();
	await openButton.click();
	await page.keyboard.press('Escape');
	await expect(modal).toHaveAttribute('open');
	await closeButton.click();

	await escCheckbox.check();
	await openButton.click();
	await page.keyboard.press('Escape');
	await expect(modal).not.toHaveAttribute('open');
});
