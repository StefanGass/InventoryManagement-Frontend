import { render, screen, waitFor } from "@testing-library/react";
import LoginForm from "components/forms/LoginForm";

jest.mock("next/router", () => require("next-router-mock"));

describe("LoginForm", () => {

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
        screen.debug();
        waitFor(() => expect(container.querySelector("#angemeldetBleiben")).toBeVisible());
        waitFor(() => expect(container.querySelector("#angemeldetBleiben")).not.toBeChecked());
    });
});