import React from 'react';

// Memory storage: only lasts while the page is open, ie. it is lost when we do a refresh
export function useMemoryStorage(keyName:string,defaultValue:string) {
	const [storedValue,setStoredValue]=React.useState(() => {
		return defaultValue;
	});
	return [storedValue,setStoredValue];
}

// Session Storage: only lasts for the current session
export function useSessionStorage(keyName:string,defaultValue:string) {
	const [storedValue,setStoredValue]=React.useState(() => {
		try {
			const value=window.sessionStorage.getItem(keyName);
			if(value) {
				return JSON.parse(value);
			} else {
				window.sessionStorage.setItem(keyName,JSON.stringify(defaultValue));
				return defaultValue;
			}
		} catch(err) {
			return defaultValue;
		}
	});
	const setValue=(newValue:string) => {
		try {
			window.sessionStorage.setItem(keyName,JSON.stringify(newValue));
		} catch(err) {}
		setStoredValue(newValue);
	};
	return [storedValue,setValue];
}

// Local Storage: lasts forever
export function useLocalStorage(keyName:string,defaultValue:string) {
	const [storedValue,setStoredValue]=React.useState(() => {
		try {
			const value=window.localStorage.getItem(keyName);
			if(value) {
				return JSON.parse(value);
			} else {
				window.localStorage.setItem(keyName,JSON.stringify(defaultValue));
				return defaultValue;
			}
		} catch(err) {
			return defaultValue;
		}
	});
	const setValue=(newValue:string) => {
		try {
			window.localStorage.setItem(keyName,JSON.stringify(newValue));
		} catch(err) {}
		setStoredValue(newValue);
	};
	return [storedValue,setValue];
}
