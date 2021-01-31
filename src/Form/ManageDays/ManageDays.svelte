<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import moment from 'moment';
  import { fullItinerary, basicDetails } from 'stores';
  import { SectionHeader } from 'components';
  import { Icon, Button, Modal } from 'carbon-components-svelte';
  import AddAlt32 from "carbon-icons-svelte/lib/AddAlt32";
  import Add24 from "carbon-icons-svelte/lib/Add24";
  import Close24 from "carbon-icons-svelte/lib/Close24";
  import Save24 from "carbon-icons-svelte/lib/Save24";
  import ChevronRight24 from "carbon-icons-svelte/lib/ChevronRight24";
  import CheckboxCheckedFilled32 from "carbon-icons-svelte/lib/CheckboxCheckedFilled32";
  import { DayPlan } from './DayPlan';
  
  const dispatch = createEventDispatcher();

  let selectedDay = null;
  let showRemoveLastDayConfirmation = false;
  let showCompleteButton = false;
  let itineraryCompleted = false;

  onMount(() => {
    const existingSelectedDay = $fullItinerary.find(day => day.selected);
    if (existingSelectedDay) {
      selectedDay = existingSelectedDay;
    };
  });

  const onDaySelect = (dayNumber) => {
    selectedDay = $fullItinerary.find(day => day.order === dayNumber);
    selectedDay.selected = true;
    const newList = $fullItinerary.reduce((list, day) => {
      if (day.order !== dayNumber) {
        day.selected = false;
        return [...list, day];
      };
      return list;
    }, []);
    newList.push(selectedDay);
    newList.sort((a, b) => a.order - b.order);
    fullItinerary.update(() => newList);
  };

  const onAddExtraDay = () => {
    const newList = $fullItinerary.map(day => {
      day.selected = false;
      return day;
    });
    const lastDay = newList[newList.length - 1];
    const newDay = {
      order: lastDay.order + 1,
      selected: true,
      date: moment(lastDay.date).add(1, 'day').format('MM/DD/YYYY'),
      activities: [],
    }
    selectedDay = newDay;
    newList.push(newDay);
    fullItinerary.update(() => newList);
    basicDetails.update(() => {
      return {
        ...$basicDetails,
        endDate: newDay.date,
        duration: newList.length,
      }
    });
  };

  const onRemoveLastDay = () => {
    showRemoveLastDayConfirmation = false;
    const newList = [...$fullItinerary];
    newList.pop();
    const lastDay = newList[newList.length - 1];
    fullItinerary.update(() => newList);
    basicDetails.update(() => {
      return {
        ...$basicDetails,
        endDate: lastDay.date,
        duration: newList.length,
      }
    });
  };

  const completeItinerary = () => {
    dispatch('complete');
    showCompleteButton = false;
    itineraryCompleted = true;
  };

  $: {
    showCompleteButton = !$fullItinerary.some(day => day.activities.length === 0);
  };
</script>

<div
  class="itinerary-form__days-management"
  in:fly="{{ y: -30, duration: 500 }}"
  out:fly="{{ y: 30, duration: 500 }}"
>
  <SectionHeader
    icon={AddAlt32}
    title="Step 2 - Select a day and manage activities"
    subtitle="The 'Complete itinerary' button will appear when each day has at least one activity"
  />
  <div class="itinerary-form__days-dashboard">
    <!-- Left column with day links -->
    <div class="days-links">
      {#each $fullItinerary as day}
        <div
          class={`day-link ${day.selected ? 'day-link__active' : ''}`}
          on:click={() => onDaySelect(day.order)}
        >
          <div class={`day-link__arrow ${day.selected ? 'day-link__arrow-active' : ''}`}>
            <Icon render={ChevronRight24} />
          </div>
          <div class="day-link__text">
            <div class="day-link__text-title">
              Day {day.order}
            </div>
            <div>
              {day.date}
            </div>
          </div>
        </div>
      {/each}
      <div class="days-links__actions_buttons">
        <!-- "Add extra day" button -->
        <Button
          kind="primary"
          hasIconOnly
          tooltipPosition="bottom"
          iconDescription="Add an extra day to your itinerary"
          icon={Add24}
          on:click={onAddExtraDay}
        />

        <!-- "Remove last day" button -->
        <Button
          kind="danger"
          hasIconOnly
          disabled={$fullItinerary.length <= 1}
          tooltipPosition="bottom"
          iconDescription="Remove last day from itinerary"
          icon={Close24}
          on:click={() => showRemoveLastDayConfirmation = true}
        />

        <!-- "Save changes" button -->
        <Button
          kind="secondary"
          hasIconOnly
          tooltipPosition="bottom"
          iconDescription="Save changes"
          icon={Save24}
          on:click={() => dispatch("save")}
        />
      </div>
    </div>
    
    <!-- Right column with day plan for specific day -->
    {#if selectedDay && $fullItinerary.find(day => day.order === selectedDay.order)}
      <DayPlan dayInfo={selectedDay} />
    {/if}
  </div>

  {#if showCompleteButton && !itineraryCompleted}
    <div class="complete-button" on:click={completeItinerary} transition:fade>
      <span class="complete-button__text">Complete itinerary</span>
      <Icon render={CheckboxCheckedFilled32} />
    </div>
  {/if}
</div>

<!-- Remove last day confirmation -->
{#if $fullItinerary.length > 0}  
  <Modal
    danger
    bind:open={showRemoveLastDayConfirmation}
    modalHeading="Confirm remove?"
    primaryButtonText="Remove"
    secondaryButtonText="Cancel"
    on:click:button--secondary={() => showRemoveLastDayConfirmation = false}
    on:close={() => showRemoveLastDayConfirmation = false}
    on:submit={onRemoveLastDay}
  >
    <p>This will remove Day {$fullItinerary[$fullItinerary.length - 1].order} ({$fullItinerary[$fullItinerary.length - 1].date}) from your itinerary.</p>
  </Modal>
{/if}

<style lang="scss">
  .itinerary-form__days-management {
    margin: 32px 0;
  }

  .itinerary-form__days-dashboard {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 16px 0;

    .days-links {
      display: flex;
      flex-direction: column;
      align-items: center;

      .day-link {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 16px 16px 16px 10px;
        background-color: whitesmoke;
        border: 1px solid lightgrey;
        transition: all 0.3s;

        &:hover {
          cursor: pointer;
          color: white;
          background-color: #0353e9;
        }

        .day-link__arrow {
          opacity: 0;
        }

        .day-link__arrow-active {
          opacity: 1;
        }

        .day-link__text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          margin-left: 10px;

          .day-link__text-title {
            margin-bottom: 8px;
          }
        }
      }

      .day-link__active {
        background-color: white;
        border-right: 1px solid white;
        font-weight: bold;

        &:hover {
          color: black;
          background-color: white;
        }
      }

      .days-links__actions_buttons {
        width: 100%;
        display: flex;
      }
    }
  }

  .complete-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 16px;
    color: white;
    background-color: green;
    opacity: 1;
    transition: opacity 0.3s;

    &:hover {
      cursor: pointer;
      opacity: 0.8;
    }

    .complete-button__text {
      margin-right: 8px;
    }
  }
</style>