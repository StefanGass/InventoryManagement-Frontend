import { render, screen } from "@testing-library/react";
import PageHeader from "components/layout/PageHeader";

describe("PageHeader", () => {

    it("renders header", () => {
        render(<PageHeader title="Inventar" id="inventarHeader" />);
        const header = screen.getByText("Inventar");
        expect(header).toBeVisible();
        expect(header.id).toBe("inventarHeader")

    });
});
