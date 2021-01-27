<script>
  import { createEventDispatcher, onMount } from 'svelte';
  import { Modal, TextInput, TextArea, InlineNotification, FileUploader } from 'carbon-components-svelte';
  import { TimePicker } from 'components';

  const dispatch = createEventDispatcher();

  export let open;
  export let activityToEdit;
  let name;
  let location;
  let startTime = '12:00 AM';
  let endTime = '12:00 AM';
  let notes;
  let thumbnail;
  let formError;
  
  onMount(() => {
    if (activityToEdit) {
      name = activityToEdit.name;
      location = activityToEdit.location;
      startTime = activityToEdit.startTime;
      endTime = activityToEdit.endTime;
      notes = activityToEdit.notes;
      thumbnail = activityToEdit.thumbnail;
    }
  });

  const onTimeChange = (e) => {
    const { detail } = e;
    if (detail.name === 'startTime') startTime = detail.time;
    if (detail.name === 'endTime') endTime = detail.time;
  };

  const onFileUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      const dataURL = reader.result;
      thumbnail = dataURL;
    };
  }

  const onCancel = () => {
    dispatch('close');
  };

  const isFormValid = () => {
    if (!name || !location) {
      formError = true;
      return false;
    }
    formError = false;
    return true;
  };

  const onSubmit = () => {
    if (isFormValid()) {
      const action = activityToEdit ? 'update' : 'create';
      const payload = {
        name,
        startTime,
        endTime,
        location,
        notes,
        thumbnail,
      };
      if (activityToEdit) {
        payload.index = activityToEdit.index;
      };
      dispatch(action, payload);
      name = '';
      location = '';
      startTime = '';
      endTime = '';
      notes = '';
      thumbnail = '';
    }
  };
</script>
  
<Modal
  bind:open={open}
  modalHeading={activityToEdit ? "Edit activity" : "Create activity"}
  primaryButtonText={activityToEdit ? "Save changes" : "Add to itinerary"}
  secondaryButtonText="Cancel"
  on:click:button--secondary={onCancel}
  on:submit={onSubmit}
  preventCloseOnClickOutside
  shouldSubmitOnEnter={false}
>
  {#if formError}  
    <InlineNotification
      kind="error"
      title="Activity must have a name and location"
      on:close={() => formError = false}
    />
  {/if}
  <!-- Name -->
  <TextInput
    labelText="Activity name"
    placeholder="E.g. 'Surfing'"
    bind:value={name}
  />

  <!-- Location -->
  <TextInput
    labelText="Location"
    placeholder="E.g. 'The beach'"
    bind:value={location}
  />

  <!-- Time -->
  <TimePicker label="Start time" name="startTime" on:change={onTimeChange} />
  <TimePicker label="End time" name="endTime" on:change={onTimeChange} />

  <!-- Notes -->
  <TextArea labelText="Notes" placeholder="E.g. 'Gonna be hot, bring sunscreen!'" bind:value={notes} />

  <!-- Upload thumbnail -->
  <FileUploader
    labelTitle="Upload picture"
    buttonLabel="Add file"
    labelDescription="Only .jpg, .jpeg, and .png files accepted"
    accept={['.jpg', '.jpeg', 'png']}
    status="complete"
    on:change={onFileUpload}
  />
</Modal>
