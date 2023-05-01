import { expect, test } from "@playwright/test";
import { NavigationHelper, NavigationPage } from "./helper/navigationHelper";

const base64 = require('base-64');

test.describe("LoginPage", () => {

    test("log in 'Super Admin' and show Dashboard",async ({page}) => {
        await NavigationHelper.login(page);
    });

    test("log in with wrong user shows error", async ({page}) => {
        await NavigationHelper.start(page);
        await page.locator("#username").fill("unknown");
        await page.click("#loginButton");
        await expect(page.getByText("Zugangsdaten unbekannt!")).toBeVisible();
    });

    test("has 'Abmelden' button after succesful login", async ({page}) => {
        await NavigationHelper.login(page);
        await expect(page.locator("#abmeldenButton")).toBeVisible()
    });

    test("set cookie 'rememberMe' after login with 'Angemeldet Bleiben'", async ({page}) => {
        const username = "Super Admin";
        await NavigationHelper.start(page);
        await page.locator("#username").fill(username);
        await page.locator("#password").fill("password");
        await page.click("#angemeldetBleiben");
        await page.click("#loginButton");
        await NavigationHelper.assertPageLoaded(page, NavigationPage.dashboard);
        expect((await page.context().cookies()).map(c => c.name)).toContain("rememberMe");
        expect((await page.context().cookies()).map(c => c.value)).toContain(base64.encode(username.replace(" ", "_")));
    });

    test("don't set cookie 'rememberMe' after login without 'Angemeldet Bleiben'", async ({page}) => {
        await NavigationHelper.login(page);
        expect((await page.context().cookies()).length).toEqual(0);
    });
});