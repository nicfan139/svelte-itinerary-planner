<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
  import moment from 'moment';
  import { jsPDF } from 'jspdf';
  import { basicDetails, fullItinerary } from 'stores';
  import { SectionHeader } from 'components';
  import { Button, Modal } from 'carbon-components-svelte';
  import ShapeIntersect32 from "carbon-icons-svelte/lib/ShapeIntersect32";
  import Reset24 from "carbon-icons-svelte/lib/Reset24";
  import Save24 from "carbon-icons-svelte/lib/Save24";
  import DocumentExport24 from "carbon-icons-svelte/lib/DocumentExport24";

  const dispatch = createEventDispatcher();

  let showResetConfirmation = false;
  let showSaveConfirmation = false;

  const onSave = () => {
    dispatch('save');
    showSaveConfirmation = false;
  };

  const onExportPdf = () => {
    const doc = new jsPDF();
    
    /**
     * Page 1
    */
    // Itinerary title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(32);
    doc.text($basicDetails.name, 105, 120, null, null, "center");

    // Itinerary description
    doc.setFont("helvetica", "italic");
    doc.setFontSize(20);
    doc.text($basicDetails.description, 105, 135, null, null, "center");

    // Itinerary timeframe
    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.text(`From ${$basicDetails.startDate} to ${$basicDetails.endDate} (${$basicDetails.duration} days)`, 105, 150, null, null, "center");

    /**
     * Page 2 onwards
    */
    $fullItinerary.forEach(day => {
      doc.addPage("a4", "p");

      // Day page indicator
      doc.setFont("helvetica", "bold");
      doc.setFontSize(32);
      doc.text(`Day ${day.order} - ${moment(day.date).format('dddd Do MMMM')}`, 105, 140, null, null, "center");

      day.activities.forEach((activity, index) => {
        doc.addPage("a4", "p");

        // Day number + activity number
        doc.setFont("helvetica", "italic");
        doc.setFontSize(16);
        doc.text(`Day ${day.order} - Activity #${index + 1}`, 15, 15, null, null, "left");

        // Activity name
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text(activity.name, 20, 40, null, null, "left");

        // Activity location + time
        doc.setFont("helvetica", "italic");
        doc.setFontSize(16);
        doc.text(`Location: ${activity.location}`, 20, 50, null, null, "left");
        doc.text(`${activity.startTime} - ${activity.endTime}`, 20, 60, null, null, "left");

        // Activity image
        if (activity.thumbnail) {
          doc.addImage(activity.thumbnail, 'PNG', 20, 70, 160, 100);
        };

        // Activity notes
        const yOffset = activity.thumbnail ? 185 : 70; 
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text(activity.notes, 20, yOffset, null, null, "left");
      });
    });

    doc.save("itinerary.pdf");
  };
</script>

<div
  class="itinerary-form__final-actions"
  in:fly="{{ y: -30, duration: 500 }}"
  out:fly="{{ y: 30, duration: 500 }}"
>
  <SectionHeader
    icon={ShapeIntersect32}
    title="Step 3 - What would you like to do with your itinerary?"
  />
  <div class="action-buttons">
    <!-- Clear/reset itinerary -->
    <div class="action-button__container">
      <Button
        kind="danger"
        icon={Reset24}
        on:click={() => showResetConfirmation = true}
      >
        Reset itinerary
      </Button>
    </div>

    <!-- Save itinerary -->
    <div class="action-button__container">
      <Button
        kind="secondary"
        icon={Save24}
        on:click={() => showSaveConfirmation = true}
      >
        Save itinerary
      </Button>
    </div>
  
    <!-- Export CSV -->
    <div class="action-button__container">
      <Button
        kind="primary"
        icon={DocumentExport24}
        on:click={onExportPdf}
      >
        Export PDF
      </Button>
    </div>
  </div>
</div>

<!-- Reset confirmation -->
<Modal
  danger
  bind:open={showResetConfirmation}
  modalHeading="Are you sure you want to reset?"
  primaryButtonText="Reset"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => showResetConfirmation = false}
  on:close={() => showResetConfirmation = false}
  on:submit={() => dispatch('reset')}
>
  <p>This will delete <strong>everything</strong> in your itinerary.</p>
</Modal>

<!-- Save confirmation -->
<Modal
  bind:open={showSaveConfirmation}
  modalHeading="Confirm save?"
  primaryButtonText="Save"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => showSaveConfirmation = false}
  on:close={() => showSaveConfirmation = false}
  on:submit={onSave}
>
  <p>The changes to your itinerary will be retained the next time you visit this site.</p>
</Modal>

<style lang="scss">
  .itinerary-form__final-actions {
    margin: 32px 0;

    .action-buttons {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 32px 0;

      .action-button__container {
        margin-right: 16px;
      }
    }
  }
</style>