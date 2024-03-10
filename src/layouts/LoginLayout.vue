<template>
  <q-layout view="hHh lpR fFf">
    <q-header style="height: 48px" class="flex-center">
      <div class="absolute-center">
        <a href="https://nevernerf.com/">
          <img style="max-height: 25px" src="/NeverNerfLogo.png" />
        </a>
      </div>
    </q-header>
    <div v-if="asset.loading">Loading...</div>
    <div v-else>
      <q-page-container>
        <div v-if="asset.metadata">
          <div class="fixed-full">
            <video
              class="video absolute-center"
              muted
              autoplay
              loop
              webkit-playsinline
              playsinline
              style="height: 80%; width: 100%">
              <source :src="asset.metadata.animation_url" type="video/mp4" />
            </video>
          </div>

          <!-- Asset hero image -->
          <div>
            <div
              class="absolute-center text-center shadow-5"
              style="
                background: rgba(0, 0, 0, 0.5) !important;
                padding-top: 10px;
                padding-left: 20px;
                padding-right: 20px;
              ">
              <span class="text-h5">
                {{ asset.metadata.name }}
              </span>
              <div>{{ asset.metadata.description }}</div>
              <passport-login-component />
              <!-- Guest Access -->
              <div style="padding-bottom: 20px">
                <q-btn flat no-caps :to="`/${asset.metadata.token_id}/asset`">
                  <div class="text-center"><u>View as Guest</u></div>
                </q-btn>
              </div>
            </div>
          </div>
        </div>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script>
import { computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import PassportLoginComponent from 'src/components/PassportLoginComponent.vue';
import { useAssetStore } from 'src/stores/asset-store';
import { usePassportStore } from 'src/stores/passport-store';

export default {
  components: {
    PassportLoginComponent,
  },

  setup() {
    const router = useRouter();
    watch(
      () => usePassportStore().isAuthenticated,
      () => {
        if (usePassportStore().isAuthenticated) {
          const token_id = useAssetStore().metadata?.token_id;
          token_id > 0
            ? router.push(`/${token_id}/gameplay`)
            : router.push('/1/gameplay');
        }
      }
    );
    // const passport = usePassportStore();
    // const token_id = computed(() => useRoute().params.token_id);
    // const assetStore = useAssetStore();
    // const router = useRouter();

    // onMounted(() => {
    //   checkAuthentication();
    // });

    // async function checkAuthentication() {
    //   try {
    //     const userInfo = await passport.getUserInfo();
    //     if (userInfo) {
    //       router.push(`/${token_id.value}/asset`);
    //     }
    //   } catch (error) {
    //     console.error('Error checking authentication:', error);
    //   }
    // }

    return {
      asset: computed(() => useAssetStore()),
    };
  },
};
</script>
