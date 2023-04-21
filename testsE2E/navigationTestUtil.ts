import { Page } from "@playwright/test";


export const startPage = "http://localhost:3004/inventory";

export async function login(page: Page) {
    await page.goto(startPage);
    await page.locator("#username").fill("Super Admin");
    await page.click("#loginButton");
}

export enum NavigationPage {
    dashboard = "Übersicht",
    anlegen = "Anlegen",
    erfassen = "Erfassen",
    inventar = "Inventar"
}


export async function navigate(page: Page, navigation: NavigationPage) {
    await page.click("#link" + navigation);
}

export async function loginAndNavigate(page: Page, navigation: NavigationPage) {
    await login(page);
    await navigate(page, navigation);
}
