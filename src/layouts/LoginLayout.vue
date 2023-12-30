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
                  style="width: 240px">
                  <div
                    class="full-width row no-wrap justify-between items-center content-start">
                    <q-img
                      left
                      src="/passport_logo_64px.svg"
                      style="max-width: 50px" />
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

<script>
import { usePassportStore } from '/src/stores/passport-store';
import { onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAssetStore } from 'src/stores/asset-store';

export default {
  setup() {
    const passport = usePassportStore();
    const token_id = computed(() => useRoute().params.token_id);
    const assetStore = useAssetStore();
    const router = useRouter();

    onMounted(() => {
      checkAuthentication();
      assetStore.loadMetadata(token_id.value);
    });

    function login() {
      passport.login();
    }
    function logout() {
      passport.logout();
    }

    async function checkAuthentication() {
      try {
        const userInfo = await passport.getUserInfo();
        if (userInfo) {
          router.push(`/${token_id.value}/asset`);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    }

    return {
      token_id,
      asset: computed(() => assetStore),
      login,
      logout,
      buttonState: passport.buttonState,
    };
  },
};
</script>
