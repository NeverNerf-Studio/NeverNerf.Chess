<template>
  <!-- Passport Login -->
  <div style="padding-top: 10px">
    <q-btn
      push
      no-caps
      rounded
      color="grey-1"
      @click="login"
      :loading="loggingIn"
      style="width: 240px">
      <div
        class="full-width row no-wrap justify-between items-center content-start">
        <q-img left src="/passport_logo_64px.svg" style="max-width: 50px" />
        <div class="text-center text-dark">Sign in with Immutable</div>
      </div>
    </q-btn>
  </div>
</template>

<script lang="ts">
import { usePassportStore } from 'src/stores/passport-store';
import { defineComponent, ref } from 'vue';

const loggingIn = ref(false);

export default defineComponent({
  name: 'passport-login-component',
  setup() {
    const passport = usePassportStore();

    function login() {
      loggingIn.value = true;
      passport.login();
    }
    function logout() {
      passport.logout();
    }

    return {
      loggingIn,
      login,
      logout,
    };
  },
});
</script>
