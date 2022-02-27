<script>
  export let pageData;
</script>

<div class="text-center">
  {#if pageData.done}
    <h1 class="mb-4 text-2xl">Thanks for participating!</h1>
    <p>You successfully finished everything!</p>
  {:else if pageData.reason}
    {#if pageData.reason === "reject"}
      <h1 class="mb-4 text-2xl">You didn't consent</h1>
      <p>Please return this HIT</p>
    {/if}
    {#if pageData.reason === "error"}
      <h1 class="mb-4 text-2xl">Oops something went wrong</h1>
      <p>We had to end the experiment early</p>
    {/if}
  {/if}
</div>
