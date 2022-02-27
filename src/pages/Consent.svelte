<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser } from "../utils.js";
  import { go } from "../router";

  const dispatch = createEventDispatcher();

  function goToExperiment() {
    dispatch("to-experiment");
  }
</script>

<div class="text-center">
  <h1 class="mb-4 text-2xl">This is the consent page</h1>
  <button
    on:click={goToExperiment}
    class="px-4 py-4 text-white rounded-full bg-violet-500 focus:outline-none hover:cursor-pointer"
  >
    Go to experiment
  </button>
  <button
    class="px-4 py-4 text-white bg-red-400 rounded-full focus:outline:none hover:cursor-pointer"
    on:click={() => go("debrief")}>Try router</button
  >
</div>
