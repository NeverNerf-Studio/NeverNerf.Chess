<template>
  <!-- Passport Login -->
  <div style="padding-top: 10px">
    <q-btn
      push
      no-caps
      rounded
      color="grey-1"
      @click="login"
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
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'passport-login-component',
  setup() {
    const passport = usePassportStore();

    function login() {
      passport.login();
    }
    function logout() {
      passport.logout();
    }

    return {
      login,
      logout,
    };
  },
});
</script>
