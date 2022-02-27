<script>
  import { createEventDispatcher } from "svelte";
  import { updateUser } from "../utils.js";

  const dispatch = createEventDispatcher();

  function accept() {
    dispatch("change-state", { action: "accept" });
  }
  function reject() {
    dispatch("change-state", { action: "reject" });
  }
</script>

<div class="flex flex-col text-center">
  <h1 class="mb-4 text-2xl">This is the consent page</h1>
  <div class="flex mx-auto gap-x-2">
    <button
      on:click={accept}
      class="px-4 py-4 text-white rounded-full bg-violet-500 hover:bg-violet-700 focus:outline-none hover:cursor-pointer"
      >Accept</button
    >
    <button
      on:click={reject}
      class="px-4 py-4 text-white rounded-full bg-violet-500 hover:bg-violet-700 focus:outline-none hover:cursor-pointer"
      >Reject</button
    >
  </div>
</div>
