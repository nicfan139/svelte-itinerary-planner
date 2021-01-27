<script>
  import { createEventDispatcher } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { fullItinerary } from 'stores';
  import { SectionHeader } from 'components';
  import { Icon } from 'carbon-components-svelte';
  import AddAlt32 from "carbon-icons-svelte/lib/AddAlt32";
  import ChevronRight24 from "carbon-icons-svelte/lib/ChevronRight24";
  import CheckboxCheckedFilled32 from "carbon-icons-svelte/lib/CheckboxCheckedFilled32";
  import { DayPlan } from './DayPlan';
  
  const dispatch = createEventDispatcher();

  let selectedDay = null;
  let showCompleteButton = false;
  let itineraryCompleted = false;

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
      <!-- TODO: Create "Add extra day" button -->
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
        padding: 16px 16px 16px 8px;
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
          margin-left: 8px;

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