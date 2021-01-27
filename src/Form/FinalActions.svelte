<script>
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';
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
    
    // Page 1
    doc.setFont("helvetica", "bold");
    doc.text($basicDetails.name, 105, 80, null, null, "center");
    doc.setFont("helvetica", "italic", "normal");
    doc.text($basicDetails.description, 105, 90, null, null, "center");
    doc.setFont("helvetica", "normal");
    doc.text(`From ${$basicDetails.startDate} to ${$basicDetails.endDate}`, 105, 100, null, null, "center");

    // Page 2 onwards
    $fullItinerary.forEach(day => {
      doc.addPage("a4", "p");

      doc.setFont("helvetica", "bold");
      doc.text(`Day ${day.order} - ${day.date}`, 105, 20, null, null, "center");

      doc.setFont("helvetica", "normal");
      let yOffset = 30;
      day.activities.forEach((activity) => {
        yOffset += 10;
        doc.text(`-> ${activity.name}`, 20, yOffset, null, null, "left");
        yOffset += 10;
        doc.text(activity.location, 30, yOffset, null, null, "left");
        yOffset += 10;
        doc.text(`${activity.startTime} - ${activity.endTime}`, 30, yOffset, null, null, "left");
        yOffset += 10;
        doc.setFont("helvetica", "italic", "normal");
        doc.text(activity.notes, 30, yOffset, null, null, "left");
        yOffset += 10;
        // if (activity.thumbnail) {
        //   doc.addImage(activity.thumbnail, 'PNG', 30, yOffset, 300, 175);
        // };
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
    <!-- <div class="action-button__container">
      <Button
        kind="primary"
        icon={DocumentExport24}
        on:click={onExportPdf}
      >
        Export PDF
      </Button>
    </div> -->
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
  <p>This will delete <strong>all the changes</strong> made to your itinerary.</p>
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