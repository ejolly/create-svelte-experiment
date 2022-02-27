<!-- This is the Footer component that contains contact info as well as a firebase
document reset button when developing locally to re-initialize a user document as if it
was just created -->
<script>
  import { getAuth, signOut } from "firebase/auth";
  import { createEventDispatcher } from "svelte";
  import { userStore, initUser } from "../utils.js";
  import { loggedIn } from "../db.js";

  const dispatch = createEventDispatcher();

  // Get current auth status
  const auth = getAuth();

  // Reset a user's data. Useful during development
  async function resetUser() {
    console.log("Reinitializing user data");
    await initUser();
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
      console.log("Successfully logged out of firebase");
    } catch (error) {
      console.error(error);
    }
  }
</script>

<style>
  .banner {
    @apply flex items-center text-center text-white fixed left-0 bottom-0 w-[100vw] p-2 font-bold;
  }
</style>

<div
  class="banner"
  class:justify-center={!$loggedIn}
  class:justify-around={$loggedIn}
  class:bg-red-600={import.meta.env.DEV}
  class:bg-gray-600={!import.meta.env.DEV}
>
  {#if $loggedIn}
    <button
      class="px-4 py-1 text-xs font-bold bg-yellow-500 rounded"
      on:click={resetUser}>Reset User Data</button
    >
  {/if}
  <p>If you have questions please ask the experimenter</p>
  {#if $loggedIn}
    <button
      class="px-4 py-1 text-xs font-bold bg-blue-500 rounded"
      on:click={logout}>logout</button
    >
  {/if}
</div>
