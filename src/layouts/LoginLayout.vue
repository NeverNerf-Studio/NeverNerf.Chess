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
        <div style="min-width: 360px" v-if="asset.imx">
          <!-- Asset hero image -->
          <!-- <img src="/imx_metadata/176708/Thumbnail_Hero_Tikor_Base.png" /> -->
          <q-img
            :src="asset.imx.metadata.image_url"
            style="
              max-width: 100vw;
              max-height: 90vh;
              min-height: 90vh;
              width: 100%;
              height: 100%;
            "
          >
            <div class="absolute-bottom text-center q-gutter-y-sm">
              <span class="text-h5">
                {{ asset.imx.metadata.name }}: {{ asset.imx.metadata.tagline }}
              </span>

              <!-- Passport Login -->
              <div>
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
              <div>
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
import { useRouter, useRoute } from 'vue-router';
import { watch, onMounted } from 'vue';
import { useMetadataStore } from 'src/stores/asset-store.ts';
import { config, passport } from '@imtbl/sdk';

const router = useRouter();
const route = useRoute();

const token_id = route.params.token_id;
const asset = useMetadataStore();

// Load metadata when component is mounted or token_id changes
onMounted(() => asset.loadMetadata(token_id));
watch(
  () => token_id,
  () => asset.loadMetadata(token_id)
);

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

  if (token_id && isAuthenticated) {
    router.push({ path: `/${token_id}/asset` });
  } else {
    console.error('Route or route parameters are undefined');
  }
}
</script>
