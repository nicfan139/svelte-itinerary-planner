<script>
  import { fade, fly } from 'svelte/transition';
  import { fullItinerary, notification, notificationTypes } from 'stores';
  import { ActivityDisplay, ActivityForm } from './Activity';
  import { Icon, Button } from 'carbon-components-svelte';
  import LocationStar32 from "carbon-icons-svelte/lib/LocationStar32";
  import Add16 from "carbon-icons-svelte/lib/Add16";

  export let dayInfo;
  let activities = [];
  let showActivityForm = false;
  let activityToEdit = null;

  const closeActivityForm = () => {
    showActivityForm = false;
    activityToEdit = false;
  };

  const updateFullItinerary = (activityList) => {
    const updatedDay = $fullItinerary.find(d => d.order === dayInfo.order);
    updatedDay.activities = activityList;
    const updatedItinerary = [
      ...$fullItinerary.filter(d => d.order !== dayInfo.order),
      updatedDay,
    ];
    updatedItinerary.sort((a, b) => a.order - b.order);
    fullItinerary.update(() => updatedItinerary);
  }

  const editActivity = (e) => {
    const { index } = e.detail;
    showActivityForm = true;
    activityToEdit = activities[index];
    activityToEdit.index = index;
  };

  const deleteActivity = (e) => {
    const { index, name } = e.detail;
    const newList = [...activities];
    newList.splice(index, 1);

    updateFullItinerary(newList);
    notification.update(() => {
      return {
        type: notificationTypes.INFO,
        title: 'Activity deleted',
        caption: `"${name}" has been deleted from Day ${dayInfo.order}.`,
      }
    });
  };

  const modifyItinerary = (e) => {
    const { detail } = e;
    const newList = [...activities];
    newList.splice(detail.index, 1, detail);

    updateFullItinerary(newList);
    notification.update(() => {
      return {
        type: notificationTypes.SUCCESS,
        title: 'Changes saved!',
        caption: `"${e.detail.name}" in Day ${dayInfo.order} has been modified.`,
      }
    });
    showActivityForm = false;
    activityToEdit = false;
  };

  const addToItinerary = (e) => {
    const newList = [...activities, e.detail];
    
    updateFullItinerary(newList);
    notification.update(() => {
      return {
        type: notificationTypes.SUCCESS,
        title: 'Activity created!',
        caption: `"${e.detail.name}" has been added to Day ${dayInfo.order}.`,
      }
    });
    showActivityForm = false;
  };

  $: {
    let selectedDay = $fullItinerary.find(day => day.order === dayInfo.order);
    if (selectedDay) {
      activities = selectedDay.activities;
    };
  };
</script>

<div class="day-plan" in:fly="{{ x: -10, duration: 500 }}">
  <h3 class="day-plan__title">
    <span class="day-plan__title-text">
      Plan for Day {dayInfo.order}
    </span>
    <Icon render={LocationStar32} />
  </h3>
  {#if activities.length > 0}
    {#each activities as activity, i}
      <ActivityDisplay index={i} activity={activity} on:edit={editActivity} on:delete={deleteActivity} />
    {/each}
  {:else}
    <p class="day-plan__empty-text">
      No activities currently planned for the day!
    </p>
  {/if}
  <Button icon={Add16} on:click={() => showActivityForm = true}>
    Add activity
  </Button>
  {#if showActivityForm}
    <div transition:fade>
      <ActivityForm
        bind:open={showActivityForm}
        bind:activityToEdit={activityToEdit}
        on:close={closeActivityForm}
        on:update={modifyItinerary}
        on:create={addToItinerary}
      />
    </div>
  {/if}
</div>

<style lang="scss">
  .day-plan {
    width: 100%;
    max-width: 800px;
    padding: 16px 36px;
    border-top: 1px solid lightgrey;

    .day-plan__title {
      display: flex;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid lightgrey;
      font-size: 32px;

      .day-plan__title-text {
        margin-right: 8px;
      }
    }

    .day-plan__empty-text {
      margin: 16px 0;
      font-style: italic;
    }
  }
</style>