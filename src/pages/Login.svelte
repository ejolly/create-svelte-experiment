<script>
  import {
    getAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
  } from "firebase/auth";
  import { userStore, userId } from "../utils";
  import Button from "../components/Button.svelte";
  let password, passwordDoubleCheck, loginError;

  $: email = `${$userId}@experiment.com`;

  // Get the current auth status
  const auth = getAuth();

  // Set default login UI state
  let showLoginButton = true;
  let showNewAccountButton = false;
  let passwordMatchError = false;

  async function login() {
    localStorage.setItem("svelte-experiment-userId", $userId);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        showLoginButton = false;
        showNewAccountButton = true;
        loginError = null;
      } else {
        loginError = error.code;
      }
    }
  }

  async function createNewAccount() {
    if (password === passwordDoubleCheck) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        await signInWithEmailAndPassword(auth, email, password);
      } catch (error) {
        loginError = error.code;
      }
    } else {
      passworedMatchError = true;
      loginError = "Passwords don't match";
    }
  }
</script>

<style>
</style>

<div class="w-full max-w-md mb-6">
  <form class="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
    <div class="mb-4">
      <label class="block mb-2 text-sm font-bold text-gray-700" for="subId">
        Subject ID
      </label>
      <input
        class="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="subId"
        type="text"
        placeholder="Type a username or userid to auto-create a db entry"
        bind:value={$userId}
      />
    </div>
    <div class:mb-6={!showNewAccountButton} class:mb-4={showNewAccountButton}>
      <label class="block mb-2 text-sm font-bold text-gray-700" for="password">
        Password
      </label>
      <input
        class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
        id="password"
        type="password"
        placeholder="Set any password you like, but don't forget it!"
        bind:value={password}
        on:keyup={async ({ keyCode }) =>
          keyCode === 13 ? await login() : null}
      />
      {#if loginError}
        <p class="text-xs italic text-red-500">{loginError}</p>
      {/if}
    </div>
    {#if showLoginButton}
      <div class="text-center">
        <Button color={"blue"} on:click={login}>Login</Button>
      </div>
    {/if}
    {#if showNewAccountButton}
      <div class="mb-6">
        <label
          class="block mb-2 text-sm font-bold text-gray-700"
          for="password2"
        >
          Please re-type your password to create a new account
        </label>
        <input
          class="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="password2"
          type="password"
          placeholder="Please retype your password"
          bind:value={passwordDoubleCheck}
          on:keyup={async ({ keyCode }) =>
            keyCode === 13 ? await createNewAccount() : null}
        />
        {#if passwordMatchError}
          <p class="text-xs italic text-red-500">{loginError}</p>
        {/if}
      </div>
      <div class="text-center">
        <Button color={"blue"} on:click={createNewAccount}
          >Create New Account</Button
        >
      </div>
    {/if}
  </form>
</div>
