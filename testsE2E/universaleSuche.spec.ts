import { expect, Page, test } from "@playwright/test";
import { NavigationHelper, NavigationPage } from "./helper/navigationHelper";
import { TableHelper } from "./helper/tableHelper";
import { UniverselleSucheHelper } from "./helper/universelleSucheHelper";


test("has Searchbar in Dashboard", async ({ page }) => {
    await NavigationHelper.login(page);
});
test.describe("Universale Suche Inventar", () => {
    test.beforeEach(async ({ page }) => {
        await NavigationHelper.loginAndNavigate(page, NavigationPage.inventar);
    });
    test("has Searchbar in Inventar", async ({ page }) => {
        await UniverselleSucheHelper.assertSearchFieldVisible(page);
    });
    test("On open Computer exists", async ({ page }) => {
        await assertComputerVisible(page);
    });
    test("Search for Coputer", async ({ page }) => {
        await UniverselleSucheHelper.fillInSearchField(page, "Coputer");
        await TableHelper.assertTableCountZeroVisible(page);
    });
    test("Search for ompu", async ({ page }) => {
        await UniverselleSucheHelper.fillInSearchField(page, "ompu");
        await assertComputerVisible(page);
    });
    test("Search for o*u", async ({ page }) => {
        await UniverselleSucheHelper.fillInSearchField(page, "o*u");
        await assertComputerVisible(page);
    });
    test("Search for om?u", async ({ page }) => {
        await UniverselleSucheHelper.fillInSearchField(page, "om?u");
        await assertComputerVisible(page);
    });
    test("open Detail after search", async ({ page }) => {
        await UniverselleSucheHelper.fillInSearchField(page, "Computer");
        await TableHelper.assertTableCountOneVisible(page);
        await UniverselleSucheHelper.navigateToDetailWithEnter(page);
    });
});

async function assertComputerVisible(page: Page) {
    await expect(page.getByText("Computer")).toBeVisible();
}
