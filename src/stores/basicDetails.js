import { writable } from 'svelte/store';

function createBasicDetails() {
	const { subscribe, set, update } = writable();
	return {
		subscribe,
		update,
		reset: () => set(null),
	};
}

export const basicDetails = createBasicDetails();