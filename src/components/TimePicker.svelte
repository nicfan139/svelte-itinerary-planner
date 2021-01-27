<script>
  import { createEventDispatcher } from 'svelte';
  import { Select, SelectItem } from 'carbon-components-svelte';

  const dispatch = createEventDispatcher();

  export let name = '';
  export let label;
  export let hour = '12';
  export let min = '00';
  export let period = 'AM';

  $: {
    dispatch('change', {
      name,
      time: `${hour}:${min} ${period}`
    });
  }
</script>

<div class="time-picker">
  {#if label}
     <label for="time-picker-input" class="time-picker__label">
       {label}
     </label>
  {/if}
  <div class="time-picker__row">
    <Select bind:selected={hour}>
      <SelectItem value="12" text="12" />
      <SelectItem value="01" text="01" />
      <SelectItem value="02" text="02" />
      <SelectItem value="03" text="03" />
      <SelectItem value="04" text="04" />
      <SelectItem value="05" text="05" />
      <SelectItem value="06" text="06" />
      <SelectItem value="07" text="07" />
      <SelectItem value="08" text="08" />
      <SelectItem value="09" text="09" />
      <SelectItem value="10" text="10" />
      <SelectItem value="11" text="11" />
    </Select>
    <span class="time-picker__separator">:</span>
    <Select bind:selected={min}>
      <SelectItem value="00" text="00" />
      <SelectItem value="15" text="15" />
      <SelectItem value="30" text="30" />
      <SelectItem value="45" text="45" />
    </Select>
    <span class="time-picker__separator"></span>
    <Select bind:selected={period}>
      <SelectItem value="AM" text="AM" />
      <SelectItem value="PM" text="PM" />
    </Select>
  </div>
</div>

<style lang="scss">
  .time-picker {
    width: 300px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    .time-picker__label {
      font-size: 12px;
    }

    .time-picker__row {
      display: flex;
      flex-direction: row;
      align-items: center;

      .time-picker__separator {
        padding: 4px;
      }
    }
  }
</style>