import { render, screen, waitFor } from "@testing-library/react";
import { CustomTooltip } from "components/form-fields/CustomTooltip";

describe("CustomTooltip", () => {
    it("renders Title", async () => {
        render(<CustomTooltip title={"Test Tooltip"} />);
        await waitFor(() => expect(screen.queryByLabelText("Test Tooltip")).toBeVisible());
    });

});
