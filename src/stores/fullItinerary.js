import { writable } from 'svelte/store';

function createItinerary() {
	const { subscribe, set, update } = writable([]);
	return {
		subscribe,
		update,
		reset: () => set([]),
	};
}

export const fullItinerary = createItinerary();