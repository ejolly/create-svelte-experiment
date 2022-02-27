<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser } from "../utils.js";

  export let pageData = "";

  const dispatch = createEventDispatcher();

  function goToDebrief() {
    dispatch("change-state", { action: "done" });
  }
</script>

<div class="text-center">
  <h1 class="mb-4 text-2xl">This is the experiment page</h1>
  <p>{pageData.message}</p>
  <button
    on:click={goToDebrief}
    class="px-4 py-4 text-white bg-green-500 rounded-full focus:outline-none hover:cursor-pointer"
  >
    Go to debrief
  </button>
</div>
