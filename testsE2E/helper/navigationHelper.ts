import { expect, Page } from "@playwright/test";

export enum NavigationPage {
    dashboard = "Übersicht",
    anlegen = "Anlegen",
    erfassen = "Erfassen",
    inventar = "Inventar",
    warteschlange = "Warteschlange",
    detail = "Detail"
}

export class NavigationHelper {
    private static startPage = "http://localhost:3004/inventory";

    public static async login(page: Page) {
        await NavigationHelper.start(page);
        await page.locator("#username").fill("Super Admin");
        await page.locator("#password").fill("password");
        await page.click("#loginButton");
        await NavigationHelper.assertPageLoaded(page, NavigationPage.dashboard);
    }
    public static async start(page: Page) {
        await page.goto(NavigationHelper.startPage);
    }

    public static async navigate(page: Page, navigation: NavigationPage) {
        await page.click("#link" + navigation);
        await NavigationHelper.assertPageLoaded(page, navigation);
    }

    public static async loginAndNavigate(page: Page, navigation: NavigationPage) {
        await NavigationHelper.login(page);
        await NavigationHelper.navigate(page, navigation);
    }

    public static async assertPageLoaded(page: Page, navigation: NavigationPage) {
        let header;
        switch (navigation) {
            case NavigationPage.dashboard:
                header = "#dashboardHeader";
                break;
            case NavigationPage.anlegen:
                header = "#parameterAnlegenHeader";
                break;
            case NavigationPage.erfassen:
                header = "#inventargegenstandErfassenHeader";
                break;
            case NavigationPage.inventar:
                header = "#inventarHeader";
                break;
            case NavigationPage.warteschlange:
                header = "#warteschlangeHeader";
                break;
            case NavigationPage.detail:
                header = "#detailItemInternalNumberHeader";
                break;
        }
        await expect(page.locator(header)).toBeVisible();
    }
}
