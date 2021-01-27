import { writable } from 'svelte/store';

export const notificationTypes = {
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning-alt',
  ERROR: 'error',
}

function createNotification() {
	const { subscribe, set, update } = writable(null);
	return {
		subscribe,
		update,
		reset: () => set(null),
	};
}

export const notification = createNotification();