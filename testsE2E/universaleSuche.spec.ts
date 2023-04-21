import { expect, Page, test } from "@playwright/test";
import { login, loginAndNavigate, NavigationPage } from "./navigationTestUtil";

const searchInputField = "#searchInput";

test("has Searchbar in Dashboard", async ({ page }) => {
    await login(page);
    await expect(page.locator(searchInputField)).toBeVisible();
});
test.describe("Universale Suche Inventar", () => {
    test.beforeEach(async ({ page }) => {
        await loginAndNavigate(page, NavigationPage.inventar);
    });
    test("has Searchbar in Inventar", async ({ page }) => {
        await expect(page.locator(searchInputField)).toBeVisible();
    });
    test("On open Computer exists", async ({ page }) => {
        await assertComputerVisible(page);
    });
    test("Search for Coputer", async ({ page }) => {
        await fillInSearchField(page, "Coputer");
        await expect(page.getByText("Computer")).not.toBeVisible();
    });
    test("Search for asdf", async ({ page }) => {
        await fillInSearchField(page, "asdf");
        await expect(page.getByText("Computer")).not.toBeVisible();
    });
    test("Search for ompu", async ({ page }) => {
        await fillInSearchField(page, "ompu");
        await assertComputerVisible(page);
    });
    test("Search for o*u", async ({ page }) => {
        await fillInSearchField(page, "o*u");
        await assertComputerVisible(page);
    });
    test("Search for om?u", async ({ page }) => {
        await fillInSearchField(page, "om?u");
        await assertComputerVisible(page);
    });
    // Test is flacky -> nothing better found yet than timeout.
    test("open Detail after search", async ({ page }) => {
        await fillInSearchField(page, "Computer");
        await expect(page.getByText("1–1 von 1")).toBeVisible();
        await page.locator(searchInputField).press("Enter");
        await expect(page.locator("#detailItemInternalNumberHeader")).toBeVisible();
    });
});

async function assertComputerVisible(page: Page) {
    await expect(page.getByText("Computer")).toBeVisible();
}

async function fillInSearchField(page: Page, text: string) {
    await expect(await page.locator("#inventarHeader")).toBeVisible();
    const input = page.locator(searchInputField);
    await input.fill(text);
}
