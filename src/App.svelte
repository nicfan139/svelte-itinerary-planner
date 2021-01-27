<script>
	import { fly } from 'svelte/transition';
	import { ToastNotification, Icon } from 'carbon-components-svelte';
	import FaceDissatisfied32 from "carbon-icons-svelte/lib/FaceDissatisfied32";
	import { notification } from 'stores';
	import { FormContainer } from './Form';

	let screenWidth;
</script>

<main bind:clientWidth={screenWidth}>
	{#if screenWidth >= 900}
		<h1 class="title">Itinerary planner by @nicfan139</h1>
		<p class="subtitle">Use this generator to create an itinerary on the fly!</p>

		<FormContainer />

		<div class="toast-notification-container">
			{#if $notification}
				<div in:fly="{{ x: -100, duration: 1500 }}">				
					<ToastNotification
						lowContrast
						kind={$notification.type}
						title={$notification.title}
						caption={$notification.caption}
						timeout={10000}
						on:close={() => notification.reset()}
					/>
				</div>
			{/if}
		</div>
	{:else}
		<div class="small-screen-warning">
			<Icon render={FaceDissatisfied32} />
			<p>Unfortunately this webapp isn't optimized for small screen sizes, sorry</p>
			<p>-- Nic (<a href="https://github.com/nicfan139">@nicfan139</a>)</p>
		</div>
	{/if}
</main>

<style lang="scss">
	:global(body) {
		background-color: whitesmoke !important;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 24px 96px 88px;

		.title {
			font-weight: bold;
			margin-bottom: 12px;
		}

		.subtitle {
			font-size: 20px;
		}
	}

	.toast-notification-container {
		z-index: 1000;
		position: fixed;
		top: 10px;
		right: 10px;
	}

	.small-screen-warning {
		z-index: 10000;
		position: fixed;
		top: 0;
		lefT: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: white;
	}
</style>