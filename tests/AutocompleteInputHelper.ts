import { fireEvent, screen, within } from "@testing-library/react";

export class AutocompleteInputHelper{

    public static fillInAutocomplete(inputValue:string){
        const autocomplete = screen.getByTestId('addUserAutoComplete');
        const input = within(autocomplete).getByRole('combobox');
        autocomplete.focus();
        fireEvent.change(input, { target: { value: inputValue } });
        fireEvent.keyDown(autocomplete, { key: 'ArrowDown' });
        fireEvent.keyDown(autocomplete, { key: 'Enter' });
    }
}
