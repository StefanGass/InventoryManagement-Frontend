import { expect, test } from "@playwright/test";
import { NavigationHelper } from "./helper/navigationHelper";

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
});