<template>
  <div v-if="asset.loading">Loading...</div>
  <div v-else>
    <q-layout view="hHh lpR fFf">
      <q-header elevated justify-between>
        <q-toolbar>
          <q-avatar>
            <img src="/imx_metadata/collection_icon.png" />
          </q-avatar>
          <q-toolbar-title>
            <span v-if="asset.imx">{{ asset.imx.collection.name }}</span>
          </q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-page-container>
        <div v-if="asset.imx">
          <!-- Asset hero image -->
          <!-- <img src="/imx_metadata/176708/Thumbnail_Hero_Tikor_Base.png" /> -->
          <q-img :src="asset.imx.metadata.image_url" class="fixed-full">
            <div class="absolute-bottom text-center">
              <span class="text-h5">
                {{ asset.imx.metadata.name }}: {{ asset.imx.metadata.tagline }}
              </span>

              <!-- Passport Login -->
              <div style="padding-top: 10px">
                <q-btn
                  push
                  no-caps
                  rounded
                  color="grey-1"
                  @click="login"
                  style="width: 240px"
                >
                  <div
                    class="full-width row no-wrap justify-between items-center content-start"
                  >
                    <q-img
                      left
                      src="/passport_logo_64px.svg"
                      style="max-width: 50px"
                    />
                    <div class="text-center text-dark">
                      Sign in with Immutable
                    </div>
                  </div>
                </q-btn>
              </div>

              <!-- Guest Access -->
              <div style="padding-bottom: 20px">
                <q-btn flat no-caps :to="`/${token_id}/asset`">
                  <div class="text-center"><u>View as Guest</u></div>
                </q-btn>
              </div>
            </div>
          </q-img>
        </div>
      </q-page-container>
      <q-footer right>
        <q-btn flat href="https://nevernerf.com" push no-caps>
          <div class="row items-center no-wrap">
            <q-icon left name="img:/NeverNerfLogo.svg" />
            <div class="text-center">NeverNerf.com</div>
          </div>
        </q-btn>
      </q-footer>
    </q-layout>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';
import { config, passport } from '@imtbl/sdk';

const token_id = computed(() => useRoute().params.token_id);
const asset = computed(() => useAssetStore());
const isAuthenticated = localStorage.getItem('authToken');

const passportInstance = new passport.Passport({
  baseConfig: {
    environment: config.Environment.PRODUCTION,
    publishableKey: 'neverNerf',
  },
  clientId: 'gYbNCjXOPjhiYp3n0n7RQLMYq8tC3zAL',
  redirectUri: 'https://localhost:9000/redirect',
  logoutRedirectUri: 'https://localhost:3000/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact',
});

async function login() {
  try {
    await passportInstance.login(); // This method opens the Passport window
  } catch (error) {
    console.error('Login failed:', error);
  }

  if (token_id.value && isAuthenticated) {
    router.push({ path: `/${token_id.value}/asset` });
  } else {
    console.error('Route or route parameters are undefined');
  }
}
</script>
