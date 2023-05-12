import { render, screen, waitFor } from "@testing-library/react";
import { UserContext } from "pages/_app";
import { getTestUserContext } from "../../helper";
import inventoryManagementService from "service/inventoryManagementService";
import * as process from "process";
import { IDepartment, IUser } from "components/interfaces";
import ParameterDroppingReviewer from "components/forms/ParameterDroppingReviewer";
import userManagementService from "service/userManagementService";
import userEvent from "@testing-library/user-event";
import { AutocompleteInputHelper } from "../../AutocompleteInputHelper";

jest.mock("next/router", () => require("next-router-mock"));

describe("ParameterDroppingReviewer", () => {
    let user: IUser;
    let department: IDepartment;
    beforeEach(async () => {
        user = createUser();
        department = createDepartment();
        department.departmentMembers = [{ id: 1, department, droppingReviewer: false, userId: user.id }];
        createServiceSpy([user], [department]);

    });

    it("invalid click add", async () => {
        const dom = await renderComponent();
        await clickAddUser(dom);
        await waitFor(() => expect(screen.queryByText("Mindestens ein:e User:in auswählen!")).toBeVisible());
    });
    it("valid click add", async () => {
        const dom = await renderComponent();
        AutocompleteInputHelper.fillInAutocomplete("T");
        await clickAddUser(dom);
        await waitFor(() => expect(screen.queryByText("User:in erfolgreich hinzugefügt!")).toBeVisible());
    });
    it("display user with department name ", async () => {
        if(department.departmentMembers) department.departmentMembers[0].droppingReviewer=true;
        await renderComponent();
        await waitFor(() => expect(screen.queryByText("Muster Max (Testdepartment)")).toBeVisible());
    });
});

async function clickAddUser(dom) {
    await userEvent.click(dom.container.querySelector("#hinzufuegenButton"));
}

async function renderComponent(){
    const dom = renderElement();
    await waitFor(() => expect(screen.queryByText("Hinzufügen / entfernen")).toBeVisible());
    return dom;
}

function createUser(): IUser {
    return {
        admin: false,
        superAdmin: false,
        id: 1,
        firstName: "Max",
        lastName: "Muster"

    };
}

function createDepartment(): IDepartment {
    return {
        id: 99,
        departmentName: "Testdepartment"
    };
}

function createServiceSpy(users: IUser[], departments: IDepartment[]) {
    jest.spyOn(inventoryManagementService, "getAllDepartments")
        .mockReturnValue(new Promise(resolve => {
            process.nextTick(() => resolve(departments));
        }));
    jest.spyOn(userManagementService, "getAllUsers")
        .mockReturnValue(new Promise(resolve => {
            process.nextTick(() => resolve(users));
        }));
    jest.spyOn(inventoryManagementService, "updateReviewer")
        .mockReturnValue(new Promise(resolve => {
            process.nextTick((v) => resolve(v));
        }));
}

function renderElement() {
    const context = getTestUserContext();
    return render(<UserContext.Provider value={context}>
        <ParameterDroppingReviewer />
    </UserContext.Provider>);
}
