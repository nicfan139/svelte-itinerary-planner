<script>
  import { onMount } from 'svelte';
  import moment from 'moment';
  import { basicDetails, fullItinerary } from 'stores';
  import { SectionHeader } from 'components';
  import { TextInput, TextArea, DatePicker, DatePickerInput, Modal } from 'carbon-components-svelte';
  import InformationSquare32 from "carbon-icons-svelte/lib/InformationSquare32";

  export let basicDetailsToEdit;
  let name = '';
  let description = '';
  let startDate = '';
  let endDate = '';
  let duration;
  let showDateChangeConfirmation = false;

  onMount(() => {
    if (basicDetailsToEdit) {
      name = basicDetailsToEdit.name;
      description = basicDetailsToEdit.description;
      startDate = basicDetailsToEdit.startDate;
      endDate = basicDetailsToEdit.endDate;
      duration = basicDetailsToEdit.duration;
    }
  });

  const onDateChange = (detail, type) => {
    const { dateStr } = detail;
    if (type === 'start') {
      startDate = dateStr;
    };
    if (type === 'end') {
      endDate = dateStr;
    };
    if (startDate && endDate) {
      duration = moment(endDate).diff(moment(startDate), 'days') + 1;

      if ($fullItinerary.some(day => day.activities.length > 0)) {
        return showDateChangeConfirmation = true;
      };

      return generateDaysList();
    };
  };

  const generateDaysList = () => {
    showDateChangeConfirmation = false;
    const newDaysList = [];

    for (let i = 0; i < duration; i++) {
      const dateArray = startDate.split('/');
      const oldDay = dateArray[1];
      const newDayInt = Number(oldDay) + i;
      const newDay = newDayInt < 10 ? `0${newDayInt}` : String(newDayInt);
      dateArray.splice(1, 1, newDay);
      const newString = dateArray.join('/');
      newDaysList.push({
        order: i + 1,
        selected: false,
        date: newString,
        activities: [],
      });
    };

    fullItinerary.update(() => newDaysList);
  };

  $: {
    if (endDate) {
      basicDetails.update(() => {
        return {
          name,
          description,
          startDate,
          endDate,
          duration,
        }
      });
    };
  };
</script>

<div class="itinerary-form__basic-info">
  <SectionHeader
    icon={InformationSquare32}
    title="Step 1 - Enter basic info"
  />
  <div class="row">
    <div class="col">
      <!-- Name -->
      <TextInput light labelText="Itinerary name" placeholder="E.g. 'Trip to Hawaii'" bind:value={name} />
      <!-- Description -->
      <TextArea light labelText="Description" placeholder="E.g. 'Taking a break from the world!'" bind:value={description} />
    </div>
  
    <div class="col">
      <!-- Start date -->
      <DatePicker light datePickerType="single" minDate={moment().format('MM/DD/YYYY')} bind:value={startDate} on:change={e => onDateChange(e.detail, 'start')}>
        <DatePickerInput labelText="Select start date" />
      </DatePicker>
    
      <!-- End date -->
      {#if startDate}
        <DatePicker light datePickerType="single" minDate={moment().format('MM/DD/YYYY')} bind:value={endDate} on:change={e => onDateChange(e.detail, 'end')}>
          <DatePickerInput labelText="Select end date" />
        </DatePicker>
      {/if}
    </div>
  </div>
</div>

<!-- Date change confirmation -->
<Modal
  danger
  bind:open={showDateChangeConfirmation}
  modalHeading="Confirm date changes?"
  primaryButtonText="Change dates"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => showDateChangeConfirmation = false}
  on:close={() => showDateChangeConfirmation = false}
  on:submit={generateDaysList}
>
  <p>Everything that is currently in your itinerary will be cleared.</p>
</Modal>

<style lang="scss">
  .itinerary-form__basic-info {
    margin: 0 0 32px;

    .row {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin: 16px 0;

      .col {
        display: flex;
        flex-direction: column;
        margin-right: 32px;
      }
    }
  }
</style>