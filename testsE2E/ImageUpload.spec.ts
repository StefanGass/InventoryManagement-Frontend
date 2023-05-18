import { expect, test } from "@playwright/test";
import {NavigationHelper, NavigationPage} from "./helper/navigationHelper";

test.describe("Kamera Upload", () => {
    test.beforeEach(async ({ page }) => {
        await NavigationHelper.loginAndNavigate(page, NavigationPage.erfassen);

        await page.getByLabel("Typ").fill("Testtype");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.getByLabel("Standort").fill("Testlocation");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

        await page.getByLabel("Lieferant").fill("Testsupplier");
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter');

    });
    test("Inventargegenstand anlegen mit Pflichtfelder", async ({ page }) => {
        await page.locator("#btn_Erfassen").click();
        await expect(page.getByText("Folgender Gegenstand wurde dem Inventar hinzugefügt:")).toBeVisible();

    });

    test("Inventargegenstand anlegen mit Files", async ({ page }) => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.locator('#dateienHochladen').click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(['Dokument1.pdf', 'Dokument2.pdf', 'Bild1.jpg', 'Bild3.png']);
        await page.locator("#btn_Erfassen").click();
        await expect(page.getByText("Folgender Gegenstand wurde dem Inventar hinzugefügt:")).toBeVisible();
    });

});
