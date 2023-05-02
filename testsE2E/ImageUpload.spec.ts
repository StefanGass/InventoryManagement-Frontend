import { test } from "@playwright/test";
//import { loginAndNavigate, NavigationPage } from "./navigationTestUtil";
import {NavigationHelper, NavigationPage} from "./helper/navigationHelper";

test.describe("Kamera Upload", () => {
    test.beforeEach(async ({ page }) => {
        await NavigationHelper.loginAndNavigate(page, NavigationPage.erfassen);
    });
    test("Pflichtfelder_ausfuellen", async ({ page }) => {

        await page.getByLabel("Typ").fill("Testtype");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.getByLabel("Standort").fill("Testlocation");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.getByLabel("Lieferant").fill("Testsupplier");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');




        //await expect(page.getByLabel("Typ")).toBeVisible();
        //await expect(page.getByLabel("Beschreibung")).toBeVisible();
        //await page.getByLabel("Beschreibung").fill("asdf");

    });


});
