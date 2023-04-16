
import { render, screen } from '@testing-library/react'
import ErrorInformation from "components/layout/ErrorInformation";

describe('ErrorInformation', () => {
    const text = "Serverfehler - bitte kontaktiere die IT!";

    it('renders an error', () => {
        render(<ErrorInformation />)
        const heading = screen.queryByText(text);
        expect(heading).toBeInTheDocument();
    })
    it('renders no error', () => {
        render(<ErrorInformation hidden />)
        const heading = screen.queryByText(text);
        expect(heading).not.toBeInTheDocument();
    })
})
