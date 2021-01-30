<script>
  import { fade, fly } from 'svelte/transition';
  import moment from 'moment';
  import { fullItinerary, notification, notificationTypes } from 'stores';
  import { ActivityDisplay, ActivityForm } from './Activity';
  import { Button, Modal } from 'carbon-components-svelte';
  import Reset24 from "carbon-icons-svelte/lib/Reset24";
  import Add16 from "carbon-icons-svelte/lib/Add16";

  export let dayInfo;
  let activities = [];
  let showActivityForm = false;
  let activityToEdit = null;
  let showClearConfirmation = false;

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

  const clearAllActivities = () => {
    showClearConfirmation = false;
    activities = [];
    const updatedItinerary = $fullItinerary.filter(day => day.order !== dayInfo.order)
    const updatedDay = $fullItinerary.find(day => day.order === dayInfo.order);
    updatedDay.activities = [];
    updatedItinerary.push(updatedDay);
    fullItinerary.update(() => updatedItinerary.sort((a, b) => { return a.order - b.order }));
  };

  $: {
    let selectedDay = $fullItinerary.find(day => day.order === dayInfo.order);
    if (selectedDay) {
      activities = selectedDay.activities;
    };
  };
</script>

<div class="day-plan" in:fly="{{ x: -10, duration: 500 }}">
  <div class="day-plan__header">
    <div class="day-plan__header-text">
      <h3 class="title">
        Plan for Day {dayInfo.order}
      </h3>
      <span class="long-date">
        {moment(dayInfo.date).format('dddd Do MMMM')}
      </span>
    </div>

    {#if activities.length > 0}
      <div transition:fade>
        <Button
          kind="secondary"
          icon={Reset24}
          on:click={() => showClearConfirmation = true}
        >
          Clear all activities
        </Button>
      </div>
    {/if}
  </div>
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

<!-- Clear all activities confirmation -->
<Modal
  danger
  bind:open={showClearConfirmation}
  modalHeading="Are you sure you want to clear?"
  primaryButtonText="Clear"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => showClearConfirmation = false}
  on:close={() => showClearConfirmation = false}
  on:submit={clearAllActivities}
>
  <p>This will clear <strong>all</strong> activities for Day {dayInfo.order}.</p>
</Modal>

<style lang="scss">
  .day-plan {
    width: 100%;
    max-width: 800px;
    padding: 16px 36px;
    border-top: 1px solid lightgrey;

    .day-plan__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 1px solid lightgrey;
      font-size: 32px;

      .day-plan__header-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .title {
          margin-bottom: 8px;
          font-size: 32px;
        }

        .long-date {
          font-size: 16px;
          font-style: italic;
        }
      }
    }

    .day-plan__empty-text {
      margin: 16px 0;
      font-style: italic;
    }
  }
</style>