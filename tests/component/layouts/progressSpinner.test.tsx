import { render } from "@testing-library/react";
import LoadingSpinner from "components/layout/LoadingSpinner";

describe("LoadingSpinner", () => {

    it("renders a spinner", () => {
        const { container } = render(<LoadingSpinner />);
        expect(container.getElementsByClassName("MuiCircularProgress-circle").length).toBe(1);
    });
    it("renders no Spinner", () => {
        const { container } = render(<LoadingSpinner hidden />);
        expect(container.getElementsByClassName("MuiCircularProgress-circle").length).toBe(0);
    });
});
