import { test, expect } from '@playwright/test';

test.describe('Dancer View - New Request Modal', () => {
  test('should open new request modal when FAB is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the floating action button (+ button)
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Check modal is visible
    await expect(page.getByRole('heading', { name: 'New Request' })).toBeVisible();
    await expect(page.getByText('Browse Dances')).toBeVisible();
    await expect(page.getByText('Custom Request')).toBeVisible();
    
    // Take screenshot of modal
    await page.screenshot({ path: 'tests/screenshots/modal-opened.png' });
  });

  test('browse dances tab - should show dance list and search', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Should be on Browse Dances tab by default
    await expect(page.getByPlaceholder('Search by dance or song name...')).toBeVisible();
    
    // Check some dances are visible
    await expect(page.getByText('Copperhead Road')).toBeVisible();
    await expect(page.getByText('Boot Scootin\' Boogie')).toBeVisible();
    await expect(page.getByText('Electric Slide')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/modal-browse-tab.png' });
  });

  test('browse dances tab - search functionality', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Type in search box
    const searchBox = page.getByPlaceholder('Search by dance or song name...');
    await searchBox.fill('wobble');
    
    // Should show filtered results
    await expect(page.getByText('Wobble')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/modal-search-results.png' });
  });

  test('browse dances tab - select a dance', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Click on a dance
    await page.getByText('Copperhead Road').first().click();
    
    // Submit button should be enabled (purple background)
    const submitButton = page.getByRole('button', { name: 'Submit Request' });
    await expect(submitButton).toBeEnabled();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/modal-dance-selected.png' });
  });

  test('custom request tab - should show input fields', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Switch to Custom Request tab
    await page.getByText('Custom Request').click();
    
    // Check form fields are visible
    await expect(page.getByText('Dance Name')).toBeVisible();
    await expect(page.getByText('Song Title')).toBeVisible();
    await expect(page.getByText('Artist')).toBeVisible();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/modal-custom-tab.png' });
  });

  test('custom request tab - submit button enables when song title filled', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Switch to Custom Request tab
    await page.getByText('Custom Request').click();
    
    // Submit button should be disabled initially
    const submitButton = page.getByRole('button', { name: 'Submit Request' });
    await expect(submitButton).toBeDisabled();
    
    // Fill in song title
    await page.getByPlaceholder('e.g., Copperhead Road').nth(1).fill('My Custom Song');
    
    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/modal-custom-filled.png' });
  });

  test('mobile viewport - modal should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open modal
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Check modal is visible and responsive
    await expect(page.getByRole('heading', { name: 'New Request' })).toBeVisible();
    
    // Take mobile screenshot
    await page.screenshot({ path: 'tests/screenshots/modal-mobile.png', fullPage: true });
  });

  test('modal should close when clicking close button', async ({ page }) => {
    await page.goto('/');
    
    // Open modal
    const fabButton = page.locator('button').filter({ has: page.locator('svg path[d*="M12 4v16m8-8H4"]') });
    await fabButton.click();
    
    // Modal should be visible
    await expect(page.getByRole('heading', { name: 'New Request' })).toBeVisible();
    
    // Click close button (X icon)
    const closeButton = page.locator('button').filter({ has: page.locator('svg path[d*="M6 18L18 6M6 6l12 12"]') });
    await closeButton.click();
    
    // Modal should be gone
    await expect(page.getByRole('heading', { name: 'New Request' })).not.toBeVisible();
    
    // Take screenshot showing modal closed
    await page.screenshot({ path: 'tests/screenshots/modal-closed.png' });
  });
});
