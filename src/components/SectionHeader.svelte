<script>
  import { Icon } from 'carbon-components-svelte';
  export let icon;
  export let title;
  export let subtitle;
</script>

<h2 class="title">
  <Icon render={icon} />
  <span class="title-text">
    {title}
  </span>
</h2>

{#if subtitle}
  <p class="subtitle">{subtitle}</p>
{/if}

<style lang="scss">
  .title {
    display: flex;
    align-items: center;

    .title-text {
      margin-left: 8px;
    }
  }

  .subtitle {
    margin: 12px 0;
    font-style: italic;
  }
</style>