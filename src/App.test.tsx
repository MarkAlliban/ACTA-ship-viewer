import {render,screen,fireEvent} from "@testing-library/react";
import '@testing-library/jest-dom'
import App from "./App";

it('Check links exist',() => {
	render(<App />);

	const linkElements1=screen.getAllByText("Ship record sheets");				// Elements that are an exact match (case dependent)
	const linkElements2=screen.getAllByText("ship record sheets",{exact:false});		// Substring match (ignores case)
	const linkElements3=screen.getAllByText(/Ship/);					// Regex substring match
	const linkElements4=screen.getAllByText(/ship/i);					// Regex substring match, ignore case
	const linkElements5=screen.getAllByText(/^ship record sheets$/i);			// Regex full match, ignore case
	const linkElements=screen.getAllByRole("link",{name:/^Ship record sheets/});		// Get all links that start with Ship record sheets

	expect(linkElements1.length).toBe(3);
	expect(linkElements2.length).toBe(6);
	expect(linkElements3.length).toBe(6);
	expect(linkElements4.length).toBe(10);
	expect(linkElements5.length).toBe(3);
	expect(linkElements.length).toBe(5);

	linkElements.forEach(element => {
		expect(element).toBeInTheDocument();
	});

	linkElements.forEach(element => {
//		console.log(element.href);
		fireEvent.click(element);
//		expect(window.location.href).toBe(element.href);

	});

});
