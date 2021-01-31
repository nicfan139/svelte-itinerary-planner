<script>
  import { onMount } from 'svelte';
  import moment from 'moment';
  import { basicDetails, fullItinerary, notification, notificationTypes } from 'stores';
  import { SectionHeader } from 'components';
  import { TextInput, TextArea, DatePicker, DatePickerInput, Button, Modal } from 'carbon-components-svelte';
  import InformationSquare32 from "carbon-icons-svelte/lib/InformationSquare32";
  import CalendarHeatMap24 from "carbon-icons-svelte/lib/CalendarHeatMap24";

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
      
      if (duration < 1) {
        duration = '';
        return notification.update(() => {
          return {
            type: notificationTypes.ERROR,
            title: 'End date error',
            caption: "The selected end date cannot be before the start date.",
          }
        });
      };

      return generateDaysList();
    };
  };

  const generateDaysList = () => {
    showDateChangeConfirmation = false;

    const startDateMoment = moment(startDate).startOf('day');
    const endDateMoment = moment(endDate).startOf('day');
    const newDaysList = [
      {
        order: 1,
        selected: true,
        date: startDate,
        activities: [],
      },
    ];
    
    let i = 1;
    while(startDateMoment.add(1, 'days').diff(endDateMoment) <= 0) {
      newDaysList.push({
        order: i += 1,
        selected: false,
        date: startDateMoment.format('MM/DD/YYYY'),
        activities: [],
      });
    };
    
    fullItinerary.update(() => newDaysList);
  };

  const onChangeDatesButtonClick = () => {
    if (duration > 0) {
      showDateChangeConfirmation = true;
    } else {
      changeDates();
    }
  };

  const changeDates = () => {
    showDateChangeConfirmation = false;
    startDate = '';
    endDate = '';
    basicDetails.update(() => {
      return {
        ...$basicDetails,
        startDate: '',
        endDate: '',
      }
    });
    fullItinerary.reset();
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
      {#if startDate && endDate}
        <Button
          kind="secondary"
          icon={CalendarHeatMap24}
          on:click={onChangeDatesButtonClick}
        >
          Change dates
        </Button>
      {:else}        
        <!-- Start date -->
        <DatePicker light datePickerType="single" minDate={moment().format('MM/DD/YYYY')} bind:value={startDate} on:change={e => onDateChange(e.detail, 'start')}>
          <DatePickerInput labelText="Select start date" />
        </DatePicker>
      
        <!-- End date -->
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
  modalHeading="Confirm change dates?"
  primaryButtonText="Proceed"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => showDateChangeConfirmation = false}
  on:close={() => showDateChangeConfirmation = false}
  on:submit={changeDates}
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