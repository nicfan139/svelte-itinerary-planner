<script>
  import { onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { basicDetails, fullItinerary, notification, notificationTypes } from 'stores';
  import { ProgressIndicator, ProgressStep } from 'carbon-components-svelte';
  import BasicInfo from './BasicInfo.svelte';
  import { ManageDays } from './ManageDays';
  import FinalActions from './FinalActions.svelte';

  let showProgressBar = false;
  let progressIndex = 0;
  let itineraryCompleted = false;

  onMount(() => {
    const data = localStorage.getItem('itineraryData');
    if (data) {
      const parsedData = JSON.parse(data);
      basicDetails.update(() => parsedData.basicDetails);
      fullItinerary.update(() => parsedData.fullItinerary);
    };
  });

  const onItineraryComplete = () => {
    itineraryCompleted = true;
    progressIndex = 2;
  };

  const onFormReset = () => {
    basicDetails.reset();
    fullItinerary.reset();
    localStorage.removeItem('itineraryData');
    itineraryCompleted = false;
    showProgressBar = false;
    notification.update(() => {
      return {
        type: notificationTypes.INFO,
        title: 'Itinerary cleared',
        caption: "Your changes have now been removed.",
      }
    });
  };

  const onFormSave = () => {
    const data = {
      basicDetails: $basicDetails,
      fullItinerary: $fullItinerary,
    };
    localStorage.setItem('itineraryData', JSON.stringify(data));
    notification.update(() => {
      return {
        type: notificationTypes.SUCCESS,
        title: 'Itinerary saved!',
        caption: `"${$basicDetails.name}" has been saved successfully.`,
      }
    });
  };

  $: {
    if ($basicDetails) {
      progressIndex = 1;
      showProgressBar = true;
    };
  };
</script>

<div class="itinerary-form">
  <!-- Step 1 - Basic information -->
  {#if $basicDetails}
     <BasicInfo basicDetailsToEdit={$basicDetails} />
  {:else}
     <BasicInfo />
  {/if}

  <!-- Step 2 - Manage itinierary -->
  {#if $fullItinerary.length > 0}
    <hr/>
    <ManageDays on:save={onFormSave} on:complete={onItineraryComplete} />
  {/if}

  <!-- Step 3 - Export data/Online viewer gallery -->
  {#if itineraryCompleted}
    <hr/>
    <FinalActions on:reset={onFormReset} on:save={onFormSave} />
  {/if}
</div>

{#if showProgressBar}
  <div
    class="itinerary-form__progress-indicator"
    in:fly="{{ y: 30, duration: 500 }}"
    out:fly="{{ y: -30, duration: 500 }}"
  >
    <ProgressIndicator currentIndex={progressIndex}>
      <ProgressStep
        label="Basics"
        complete={$basicDetails && $basicDetails.endDate}
      />
      <ProgressStep
        label="Manage itinerary"
        complete={itineraryCompleted}
      />
      <ProgressStep
        label="Export/share"
        complete={itineraryCompleted}
      />
    </ProgressIndicator>
  </div>
{/if}

<style lang="scss">
  .itinerary-form {
    width: 1024px;
    margin: 16px 0;
    padding: 36px;
    border: 1px solid black;
    background-color: white;

    @media screen and (max-width: 1200px) {
      width: 900px;
    }
  }

  .itinerary-form__progress-indicator {
    height: 70px;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid black;
    background-color: white;
  }
</style>