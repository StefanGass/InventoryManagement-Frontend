import { render, screen } from "@testing-library/react";
import { UserContext } from "pages/_app";
import Header from "components/layout/Header";
import { getTestInventoryItemComputer, getTestUserContext } from "../../helper";
import inventoryManagementService from "service/inventoryManagementService";
import * as process from "process";
import { IInventoryItem } from "components/interfaces";

jest.mock("next/router", () => require("next-router-mock"));

describe("Header", () => {

    it("renders default header navigation", () => {
        renderHeader(false, false, false, false, false);
        expect(screen.queryByText("Übersicht")).toBeVisible();
        expect(screen.queryByText("Inventar")).toBeVisible();
        expect(screen.queryByText("Erfassen")).toBeVisible();
        expect(screen.queryByText("Anlegen")).toBeVisible();
        expect(screen.queryByText("Abmelden")).toBeVisible();

    });

    it("renders no navigation for reviewer without Queue", () => {
        createServiceSpy(false, []);
        const dom = renderHeader(false, false, false, true, false);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeNull();
    });
    it("renders navigation for reviewer with Queue", () => {
        createServiceSpy(false, [getTestInventoryItemComputer()]);
        const dom = renderHeader(false, false, false, true, true);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeVisible();
    });
    it("renders no navigation for admin without without adminMode", () => {
        const dom = renderHeader(true, false, false, false, false);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeNull();
    });
    it("renders no navigation for admin with adminMode without Queue", () => {
        createServiceSpy(true, []);
        const dom = renderHeader(true, false, false, false, false);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeNull();
    });
    it("renders navigation for admin with adminMode with Queue", () => {
        createServiceSpy(true, [getTestInventoryItemComputer()]);
        const dom = renderHeader(true, false, true, false, true);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeVisible();
    });
    it("renders no navigation for superAdmin without without adminMode", () => {
        const dom = renderHeader(false, true, false, false, false);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeNull();
    });
    it("renders no navigation for superAdmin with adminMode without Queue", () => {
        createServiceSpy(true, []);
        const dom = renderHeader(false, true, false, false, false);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeNull();
    });
    it("renders navigation for superAdmin with adminMode with Queue", () => {
        createServiceSpy(true, [getTestInventoryItemComputer()]);
        const dom = renderHeader(false, true, true, false, true);
        expect(dom.container.querySelector("#linkWarteschlange")).toBeVisible();
    });
});

function createServiceSpy(isAdmin: boolean, returnValue: IInventoryItem[]) {
    jest.spyOn(inventoryManagementService, isAdmin ? "getAllDroppingQueueInventoryItems" : "getDroppingQueueInventoryItemsByDepartmentId")
        .mockReturnValue(new Promise(resolve => {
            process.nextTick(() => resolve(returnValue));
        }));
}

function renderHeader(admin: boolean, superAdmin: boolean, adminMode: boolean, droppingReviewer: boolean, showDroppingQueue: boolean) {
    const context = getTestUserContext();
    context.admin = admin;
    context.superAdmin = superAdmin;
    context.droppingReviewer = droppingReviewer;
    context.showDroppingQueue = showDroppingQueue; // no way yet found to wait for context change and trigger change
    return render(<UserContext.Provider value={context}>
        <Header />
    </UserContext.Provider>);
}
