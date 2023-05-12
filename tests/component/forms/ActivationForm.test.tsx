import { render, screen, waitFor } from "@testing-library/react";
import { UserContext } from "pages/_app";
import { getTestInventoryItemComputer, getTestUserContext } from "../../helper";
import inventoryManagementService from "service/inventoryManagementService";
import * as process from "process";
import { IDetailInventoryItem, IUserContext } from "components/interfaces";
import userEvent from "@testing-library/user-event";
import ActivationForm from "components/forms/inventory-form/ActivationForm";


jest.mock("next/router", () => require("next-router-mock"));

describe("ActivationForm", () => {
    let context:IUserContext;
    beforeEach(async () => {
        context = getTestUserContext();
    });

    it("active not queued", async () => {
        const item = getTestInventoryItemComputer();
        renderElement(context,item);

        await waitFor(() => expect(screen.queryByText("Deaktivieren anfordern")).toBeVisible());
    });
    it("queued with admin reject", async () => {
        const item = getTestInventoryItemComputer();
        item.droppingQueue = "Deaktivieren";
        const dom = renderElement(context,item);

        await waitFor(() => expect(screen.queryByText("Deaktivieren ablehnen")).toBeVisible());
        await clickAblehnen(dom);
    });
    it("queued same user", async () => {
        const item = getTestInventoryItemComputer();
        item.droppingQueueRequester=1;
        item.droppingQueue = "Deaktivieren";
        renderElement(context,item);

        await waitFor(() => expect(screen.queryByText("Deaktivierung wurde angefordert.")).toBeVisible());
    });
    it("queued ausscheiden", async () => {
        const item = getTestInventoryItemComputer();
        item.droppingQueueRequester=1;
        item.droppingQueue = "Ausscheiden";
        renderElement(context,item);

        await waitFor(() => expect(screen.queryByLabelText("Ausscheiden wurde angefordert.")).toBeVisible());
    });
    it("queued with admin bestaetigen", async () => {
        const item = getTestInventoryItemComputer();
        item.droppingQueue = "Deaktivieren";
        const dom = renderElement(context,item);
        const button = getBestaetigenButton(dom);
        await waitFor(() => expect(button).toBeDisabled());
        await clickEnableBestaetigen(dom);
        await waitFor(() => expect(button).toBeEnabled());
        createDactivierenSpy();
        await clickBestaetigen(dom);
    });
    it("inactive without Admin", async () => {
        const item = getTestInventoryItemComputer();
        item.active= false;
        const dom = renderElement(context,item);

        await waitFor(() => expect(screen.queryByText("Reaktivieren")).toBeVisible());
        expect(dom.container.querySelector("#reaktivierenButton")).toBeDisabled();
    });
    it("inactive with Admin", async () => {
        createReactivierenSpy()
        context.admin=true;
        context.superAdmin=true;
        const item = getTestInventoryItemComputer();
        item.active= false;
        const dom = renderElement(context,item);
        await waitFor(() => expect(screen.queryByText("Reaktivieren")).toBeVisible());
        await clickReaktivieren(dom);
    });

});

async function clickReaktivieren(dom) {
    await userEvent.click(dom.container.querySelector("#reaktivierenButton"));
}
async function clickEnableBestaetigen(dom) {
    await userEvent.click(dom.container.querySelector("#deaktivierenCheckbox"));
}
async function clickAblehnen(dom) {
    await userEvent.click(dom.container.querySelector("#ablehnenButton"));
}
function getBestaetigenButton(dom){
    return dom.container.querySelector("#bestaetigenButton");
}
async function clickBestaetigen(dom) {
    await userEvent.click(getBestaetigenButton(dom));
}
function createReactivierenSpy() {
    jest.spyOn(inventoryManagementService, "reactivateInventoryItem")
        .mockReturnValue(new Promise(resolve => {
            // @ts-ignore
            process.nextTick((v) => resolve({ok:true}));
        }));
}
function createDactivierenSpy() {
    jest.spyOn(inventoryManagementService, "deactivateInventoryItem")
        .mockReturnValue(new Promise(resolve => {
            // @ts-ignore
            process.nextTick((v) => resolve({ok:true}));
        }));
}

function renderElement(context:IUserContext,item:IDetailInventoryItem ) {
    return render(<UserContext.Provider value={context}>
        <ActivationForm inventoryItem={item} setActivationMessage={(m) => {}} setFormError={()=>{}} setUpdated={() =>{}} onFormSent={()=>{}} />
    </UserContext.Provider>);
}
