import { render, screen, waitFor } from "@testing-library/react";
import { UserContext } from "pages/_app";
import { getTestInventoryItemComputer, getTestUserContext } from "../../helper";
import { IDetailInventoryItem, IUserContext } from "components/interfaces";
import userEvent from "@testing-library/user-event";
import IssueReturnDropForm from "components/forms/inventory-form/IssueReturnDropForm";
import { AUSSCHEIDEN, DEAKTIVIEREN } from "utils/droppingActivationUtil";


jest.mock("next/router", () => require("next-router-mock"));

describe("IssueReturnForm", () => {
    let context: IUserContext;
    let item: IDetailInventoryItem;
    beforeEach(async () => {
        context = getTestUserContext();
        item = getTestInventoryItemComputer();
    });

    it("default button state LAGERND", async () => {
        const dom = renderElement(context, item);
        await waitFor(() => expect(screen.queryByText("Ausgabe starten")).toBeVisible());
        expect(getAusgabeButton(dom)).toBeEnabled();
        expect(getRuecknahmeButton(dom)).toBeDisabled();
        expect(getAusscheidenButton(dom)).toBeEnabled();
    });
    it("default button state VERTEILT", async () => {
        item.piecesIssued = 1;
        const dom = renderElement(context, item);
        await waitFor(() => expect(screen.queryByText("Ausgabe starten")).toBeVisible());
        expect(getAusgabeButton(dom)).toBeEnabled();
        expect(getRuecknahmeButton(dom)).toBeEnabled();
        expect(getAusscheidenButton(dom)).toBeEnabled();
    });
    it("default button state AUSGEGEBEN", async () => {
        item.piecesIssued = 1;
        item.piecesStored = 0;
        const dom = renderElement(context, item);
        await waitFor(() => expect(screen.queryByText("Ausgabe starten")).toBeVisible());
        expect(getAusgabeButton(dom)).toBeDisabled();
        expect(getRuecknahmeButton(dom)).toBeEnabled();
        expect(getAusscheidenButton(dom)).toBeDisabled();
    });
    it("request drop form error", async () => {
        const dom = renderElement(context, item);
        await waitFor(() => expect(screen.queryByText("Ausgabe starten")).toBeVisible());
        await clickAusscheidenButton(dom);
        await waitFor(() => expect(screen.queryByText("Absenden")).toBeVisible());
        await clickAbsendenButton(dom);
        await waitFor(() => expect(screen.queryByText("Pflichtfelder beachten!")).toBeVisible());
    });
    it("request single drop form", async () => {
        const dom = renderElement(context, item);
        await waitFor(() => expect(screen.queryByText("Ausgabe starten")).toBeVisible());
        await clickAusscheidenButton(dom);
        await waitFor(() => expect(screen.queryByText("Absenden")).toBeVisible());
        expect(dom.container.querySelector("#inputPiecesAusgeschieden")).toBeDisabled();
        // @ts-ignore
        await userEvent.type(dom.container.querySelector("#inputAusscheidegrund"), "test");
        await expect((dom.container.querySelector("#inputPiecesAusgeschieden") as HTMLInputElement).value).toBe("1");
        await clickAbsendenButton(dom);
    });
    it("request multiple drop form", async () => {
        item.pieces = 2;
        item.piecesStored = 2;
        const dom = renderElement(context, item, false);
        await waitFor(() => expect(screen.queryByText("Ausgabe starten")).toBeVisible());
        await clickAusscheidenButton(dom);
        await waitFor(() => expect(screen.queryByText("Absenden")).toBeVisible());
        expect(dom.container.querySelector("#inputPiecesAusgeschieden")).toBeEnabled();
        // @ts-ignore
        await userEvent.type(dom.container.querySelector("#inputAusscheidegrund"), "test");
        await expect((dom.container.querySelector("#inputPiecesAusgeschieden") as HTMLInputElement).value).toBe("2");
        await clickAbsendenButton(dom);
    });
    it("disabled", async () => {
        setAusscheidenItem(item);

        const dom = renderElement(context, item);

        await waitFor(() => expect(getAusscheidenButton(dom)).toBeDisabled());
        await waitFor(() => expect(screen.queryByLabelText("Ausscheiden wurde angefordert.")).toBeVisible());
    });
    it("admin disabled", async () => {
        setAusscheidenItem(item);
        context.admin=true;
        const dom = renderElement(context, item);

        await waitFor(() => expect(getAusscheidenButton(dom)).toBeDisabled());
        await waitFor(() => expect(screen.queryByLabelText("Ausscheiden wurde angefordert.")).toBeVisible());
    });
    it("admin enabled", async () => {
        setAusscheidenItem(item);
        context.admin=true;
        context.adminMode=true;
        const dom = renderElement(context, item);

        await waitFor(() => expect(getAusscheidenButton(dom)).toBeEnabled());
    });

    it("reject single drop form", async () => {
        setAusscheidenItem(item);
        context.droppingReviewer=true;
        const dom = await prepareAusscheidenState(context, item);

        await waitFor(() => expect(getAblehnenButton(dom)).toBeEnabled());

        await clickAblehnenButton(dom);
    });
    it("button state single drop form", async () => {
        setAusscheidenItem(item);
        context.droppingReviewer=true;
        const dom = await prepareAusscheidenState(context, item);

        expect(getAusgabeButton(dom)).toBeDisabled();
        expect(getRuecknahmeButton(dom)).toBeDisabled();
        expect(dom.container.querySelector("#inputPiecesAusgeschieden")).toBeDisabled();
        expect(dom.container.querySelector("#inputAusscheideDatum")).toBeDisabled();
        expect(dom.container.querySelector("#inputAusscheidegrund")).toBeDisabled();
    });
    it("approve single drop form", async () => {
        setAusscheidenItem(item);
        context.droppingReviewer=true;
        const dom = await prepareAusscheidenState(context, item);
        await waitFor(() => expect(getAbsendenButton(dom)).toBeEnabled());

        await clickAbsendenButton(dom);
    });
    it("deactivate requested", async () => {

        item.droppingQueue = DEAKTIVIEREN;
        const dom = renderElement(context, item);
        await waitFor(() => expect(screen.queryByLabelText("Deaktivierung wurde angefordert.")).toBeVisible());

        await clickAbsendenButton(dom);
    });
    it("ausscheiden requested same user", async () => {

        item.droppingQueue = AUSSCHEIDEN;
        item.droppingQueueRequester = 1;
        const dom = renderElement(context, item);
        await waitFor(() => expect(screen.queryByLabelText("Ausscheiden wurde angefordert.")).toBeVisible());

        await clickAbsendenButton(dom);
    });


});

async function prepareAusscheidenState(context, item) {
    const dom = renderElement(context, item);
    await waitFor(() => expect(screen.queryByText("Ausscheid. bearbeiten")).toBeVisible());
    await clickAusscheidenButton(dom);
    return dom;
}

function setAusscheidenItem(item: IDetailInventoryItem) {
    item.droppingQueue = AUSSCHEIDEN;
    item.droppingQueueDate = String(new Date());
    item.droppingQueuePieces = 1;
    item.droppingQueueRequester = 2;
}

async function clickAusscheidenButton(dom) {
    await userEvent.click(getAusscheidenButton(dom));
}

async function clickAbsendenButton(dom) {
    await userEvent.click(getAbsendenButton(dom));
}

async function clickAblehnenButton(dom) {
    await userEvent.click(getAblehnenButton(dom));
}

function getAusscheidenButton(dom) {
    return dom.container.querySelector("#ausscheidenButton");
}

function getAbsendenButton(dom) {
    return dom.container.querySelector("#absendenButton");
}

function getAblehnenButton(dom) {
    return dom.container.querySelector("#ablehnenButton");
}

function getAusgabeButton(dom) {
    return dom.container.querySelector("#ausgabeButton");
}

function getRuecknahmeButton(dom) {
    return dom.container.querySelector("#ruecknahmeButton");
}

function renderElement(context: IUserContext, item: IDetailInventoryItem, isSinglePiece: boolean = true) {
    return render(<UserContext.Provider value={context}>
        <IssueReturnDropForm disabled={true} inventoryForm={item} onFormSent={() => {
        }} isSinglePieceItem={isSinglePiece} />
    </UserContext.Provider>);
}
