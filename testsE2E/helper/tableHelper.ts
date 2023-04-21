import { expect, Page } from "@playwright/test";


export class TableHelper {
    public static async assertTableCountVisible(page: Page, count: number, countPage: number, totalCount: number) {
        await expect(page.getByText(`${count}–${countPage} von ${totalCount}`)).toBeVisible();
    }
    public static async assertTableCountZeroVisible(page: Page) {
        await TableHelper.assertTableCountVisible(page, 0, 0, 0);
    }
    public static async assertTableCountOneVisible(page: Page) {
        await TableHelper.assertTableCountVisible(page, 1, 1, 1);
    }
}
