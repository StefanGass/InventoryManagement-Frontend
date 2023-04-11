import { expect, test } from "@playwright/test";
import { login, loginAndNavigate, NavigationPage, startPage } from "./navigationTestUtil";


test("has title", async ({ page }) => {
    await page.goto(startPage);
    await expect(page).toHaveTitle("Inventory Management");
});

test("login and open Dashboard", async ({ page }) => {
    await login(page);
    await expect(await page.locator("#dashboardHeader")).toBeVisible();
});
test("navigate Inventar", async ({ page }) => {
    await loginAndNavigate(page,NavigationPage.inventar);
    await expect(await page.locator("#inventarHeader")).toBeVisible();
});
test("navigate Erfassen", async ({ page }) => {
    await loginAndNavigate(page,NavigationPage.erfassen);
    await expect(await page.locator("#inventargegenstandErfassenHeader")).toBeVisible();
});
test("navigate Anlegen", async ({ page }) => {
    await loginAndNavigate(page,NavigationPage.anlegen);
    await expect(await page.locator("#parameterAnlegenHeader")).toBeVisible();
});

