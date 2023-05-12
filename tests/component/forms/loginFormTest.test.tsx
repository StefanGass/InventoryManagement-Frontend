import { render, screen, waitFor } from "@testing-library/react";
import LoginForm from "components/forms/LoginForm";
import { IConfiguration } from "components/interfaces";
import inventoryManagementService from "service/inventoryManagementService";
import userControlService from "service/userControlService";
import userEvent from "@testing-library/user-event";
import * as process from "process";
import Cookies from 'js-cookie';

jest.mock("next/router", () => require("next-router-mock"));

describe("LoginForm", () => {
    beforeEach(async () => {
        createServiceSpy();
    });

    it("renders a username", () => {
        const { container } = render(<LoginForm />);
        expect(container.querySelector("#username")).toBeVisible();
    });

    it("renders a password", () => {
        const { container } = render(<LoginForm />);
        expect(container.querySelector("#password")).toBeVisible();
    });

    it("renders a unchecked 'angemeldetBleiben' checkbox'", () => {
        const { container } = render(<LoginForm />);
        waitFor(() => expect(container.querySelector("#angemeldetBleiben")).toBeVisible());
        waitFor(() => expect(container.querySelector("#angemeldetBleiben")).not.toBeChecked());
    });

    it("should call Cookie.set with correct parameters", async () => {
        const cookiesSetSpy = jest.spyOn(Cookies, "set");
        render(<LoginForm />);
        await userEvent.click(screen.getByLabelText("Angemeldet bleiben?"));
        await userEvent.click(screen.getByTestId("loginButton"));
        expect(cookiesSetSpy).toHaveBeenCalledWith(expect.stringMatching("rememberMe"), expect.any(String), expect.objectContaining({ expires: 3 }));
    });
});

function createServiceSpy() {
    const remembermecookieconfig: IConfiguration = {
        id: 1,
        rememberMeCookieDaysUntilExpiration: 3
    }
    jest.spyOn(inventoryManagementService, "getRememberMeCookieConfig")
        .mockReturnValue(new Promise(resolve => {
            process.nextTick(() => resolve(remembermecookieconfig));
        }));
    jest.spyOn(userControlService, "checkUser")
        .mockReturnValue(new Promise(resolve => {
            process.nextTick(() => resolve({ ok: true }));
        }));
}