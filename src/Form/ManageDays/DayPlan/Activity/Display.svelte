<script>
  import { createEventDispatcher } from 'svelte';
  import { Tile, Icon, Button, Modal } from "carbon-components-svelte";
  import Location20 from "carbon-icons-svelte/lib/Location20";
  import Time20 from "carbon-icons-svelte/lib/Time20";
  import Information20 from "carbon-icons-svelte/lib/Information20";
  import Edit20 from "carbon-icons-svelte/lib/Edit20";
  import Delete20 from "carbon-icons-svelte/lib/Delete20";

  export let index;
  export let activity;
  let showDeleteConfirmation;

  const dispatch = createEventDispatcher();

  const onEdit = () => {
    dispatch('edit', {
      index,
    });
  };

  const onDelete = () => {
    dispatch('delete', {
      index,
      name: activity.name,
    });
  };
</script>

<div class="activity-display">
  <Tile>
    <div class="activity-display__tile-row">
      <div class="activity-display__tile-col">
        <h3>{activity.name}</h3>
        <div class="activity-display__subtitle">
          <Icon render={Location20} />
          <span class="activity-display__subtitle-text">{activity.location}</span>
        </div>
        <div class="activity-display__subtitle">
          <Icon render={Time20} />
          <span class="activity-display__subtitle-text">{activity.startTime} to {activity.endTime}</span>
        </div>
        {#if activity.notes}
           <div class="activity-display__subtitle">
             <Icon render={Information20} />
             <span class="activity-display__subtitle-text">{activity.notes}</span>
           </div>
        {/if}

        <div>
          <Button
            hasIconOnly
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Edit activity"
            icon={Edit20}
            on:click={onEdit}
          />
         
          <Button
            kind="danger"
            hasIconOnly
            tooltipPosition="bottom"
            tooltipAlignment="center"
            iconDescription="Delete activity"
            icon={Delete20}
            on:click={() => showDeleteConfirmation = true}
          />
        </div>
      </div>
      <div class="activity-display__tile-col">
        {#if activity.thumbnail}
          <div class="activity-display__pic" style="background-image: url({activity.thumbnail});" />
        {:else}
          <div class="activity-display__pic" style="background-image: url('https://images.unsplash.com/photo-1519046904884-53103b34b206?&auto=format&fit=crop&w=1350&q=80');" />
        {/if}
      </div>
    </div>
  </Tile>
</div>

<Modal
  danger
  bind:open={showDeleteConfirmation}
  modalHeading="Delete this activity?"
  primaryButtonText="Delete"
  secondaryButtonText="Cancel"
  on:click:button--secondary={() => showDeleteConfirmation = false}
  on:close={() => showDeleteConfirmation = false}
  on:submit={onDelete}
>
  <p>Once deleted, it cannot be undone.</p>
</Modal>

<style lang="scss">
  .activity-display {
    margin: 16px 0;

    .activity-display__tile-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;

      .activity-display__tile-col {
        .activity-display__subtitle {
          margin: 12px 0;
          display: flex;
          align-items: center;

          .activity-display__subtitle-text {
            margin-left: 8px;
          }
        }

        .activity-display__pic {
          height: 175px;
          width: 300px;
          background-position: center;
          background-size: cover;
        }
      }
    }
  }
</style>