import { expect, test } from "@playwright/test";
import { NavigationHelper, NavigationPage } from "./helper/navigationHelper";


test.describe("Navigation", () => {
    test("has title", async ({ page }) => {
        await NavigationHelper.start(page);
        await expect(page).toHaveTitle("Inventory Management");
    });

    test("login and open Dashboard", async ({ page }) => {
        await NavigationHelper.login(page);
    });
    test("navigate Inventar", async ({ page }) => {
        await NavigationHelper.loginAndNavigate(page, NavigationPage.inventar);
    });
    test("navigate Erfassen", async ({ page }) => {
        await NavigationHelper.loginAndNavigate(page, NavigationPage.erfassen);
    });
    test("navigate Anlegen", async ({ page }) => {
        await NavigationHelper.loginAndNavigate(page, NavigationPage.anlegen);
    });
    test("navigate Warteschlange", async ({ page }) => {
        await NavigationHelper.loginAndNavigate(page, NavigationPage.warteschlange);
    });
});
