import { render, screen} from "@testing-library/react";
import ImageUpload from "components/image-upload/ImageUpload";
import {IPicture} from "components/interfaces";

jest.mock("next/router", () => require("next-router-mock"));

describe("Kamera-Upload", () => {

    it("Check Buttons", () => {
        const dom =renderElement();
        expect(dom.container).toBeVisible()
        expect(screen.queryByText("Dateien hochladen")).toBeVisible();
        expect(screen.queryByText("Kamera starten")).toBeVisible();
        expect(screen.queryByText("Kamera stoppen")).toBeNull();
    });

    it("Start Kamera Button not clickable ", async ()  => {
        const dom = renderElement();
        expect(dom.container.querySelector("#kameraButton")).toHaveAttribute('aria-disabled', 'true');
    });

});

function renderElement() {
    const array: IPicture[] = [];
    return render(<ImageUpload setPictures={()=> array}/>);
}
