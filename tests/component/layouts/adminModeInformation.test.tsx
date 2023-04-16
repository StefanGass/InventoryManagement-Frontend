import { render, screen, waitFor } from "@testing-library/react";
import AdminModeInformation from "components/layout/AdminModeInformation";
import { UserContext } from "pages/_app";
import { getTestUserContext } from "../../helper";

describe("AdminInformation", () => {

    it("no Admin", () => {
        const element = renderData(false,false,false);
        expect(element).toBeNull();
    });
    it("Admin no adminMode", () => {
        const element = renderData(true,false,false);
        expect(element).not.toBeNull();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
    it("SuperAdmin no adminMode", () => {
        const element = renderData(false,true,false);
        expect(element).not.toBeNull();
        expect(screen.getByRole('checkbox')).not.toBeChecked();
    });
    it("Admin adminMode", () => {
        const element = renderData(true,false,true);
        expect(element).not.toBeNull();
        waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked());
    });
    it("SuperAdmin adminMode", () => {
        const element = renderData(false,true,true);
        expect(element).not.toBeNull();
        waitFor(() => expect(screen.getByRole('checkbox')).toBeChecked());
    });

});

function renderData(admin:boolean,superAdmin:boolean,adminMode:boolean){
    const context = getTestUserContext();
    context.admin=admin;
    context.superAdmin=superAdmin;
    const dom =  render(
        <UserContext.Provider value={context}>
            <AdminModeInformation />
        </UserContext.Provider>);
    return dom.container.querySelector("#adminModeSwitchInformation");

}
