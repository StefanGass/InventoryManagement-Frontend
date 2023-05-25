import { expect, Page } from "@playwright/test";
import { NavigationHelper, NavigationPage } from "./navigationHelper";

export class UniverselleSucheHelper {

    private static searchInputField = "#searchInput";

    public static getSearchField(page: Page) {
        return page.locator(UniverselleSucheHelper.searchInputField);
    }

    public static async fillInSearchField(page: Page, text: string) {
        await UniverselleSucheHelper.getSearchField(page).fill(text);
    }

    public static async assertSearchFieldVisible(page: Page) {
        await expect(UniverselleSucheHelper.getSearchField(page)).toBeVisible();
    }
    public static async navigateToDetailWithEnter(page:Page){
        await UniverselleSucheHelper.getSearchField(page).press("Enter");
        await NavigationHelper.assertPageLoaded(page,NavigationPage.detail);
        
    }
}
