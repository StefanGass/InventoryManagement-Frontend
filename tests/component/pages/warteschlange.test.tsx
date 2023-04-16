import { render, screen, waitFor } from "@testing-library/react";
import { UserContext } from "pages/_app";
import { getTestInventoryItemComputer, getTestUserContext } from "../../helper";
import inventoryManagementService from "service/inventoryManagementService";
import * as process from "process";
import { IInventoryItem } from "components/interfaces";
import Warteschlange from "pages/warteschlange";

jest.mock("next/router", () => require("next-router-mock"));

describe("Warteschlange", () => {

    it("renders Header", () => {
        createServiceSpy([]);
        renderElement(false);
        expect(screen.queryByText("Warteschlange")).toBeVisible();
    });
    it("renders EmptyTable", async () => {
        createServiceSpy([]);
        const dom =renderElement(true);

        await waitFor(() => {
            expect(dom.container.querySelector(".MuiTablePagination-displayedRows")).toBeVisible();
            expect(dom.container.querySelector(".MuiTablePagination-displayedRows")?.innerHTML).toBe("0–0 of 0");
        });
    });
    it("renders TEST-2023-0001", async () => {
        createServiceSpy( [getTestInventoryItemComputer()]);
        const dom =renderElement(true);

        await waitFor(() => {
            expect(dom.container.querySelector(".MuiTablePagination-displayedRows")).toBeVisible();
            expect(dom.container.querySelector(".MuiTablePagination-displayedRows")?.innerHTML).toBe("1–1 of 1");
            expect(screen.queryByText("TEST-2023-0001")).toBeVisible();
        });
    });


});

function createServiceSpy(returnValue: IInventoryItem[]) {
    jest.spyOn(inventoryManagementService, "getDroppingQueueInventoryItemsByDepartmentId")
        .mockReturnValue(new Promise(resolve => {
            process.nextTick(() => resolve(returnValue));
        }));
}

function renderElement(droppingReviewer: boolean) {
    const context = getTestUserContext();
    context.droppingReviewer = droppingReviewer;
    return render(<UserContext.Provider value={context}>
        <Warteschlange />
    </UserContext.Provider>);
}
