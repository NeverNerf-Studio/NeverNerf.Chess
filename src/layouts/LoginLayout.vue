<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated justify-between>
      <q-toolbar>
        <q-avatar>
          <img src="/imx_metadata/collection_icon.png" />
        </q-avatar>
        <q-toolbar-title>
          <span v-if="metadata">{{ metadata.collection.name }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <!-- Asset hero image -->
      <q-img
        v-if="metadata"
        :src="metadata.image_url"
        style="max-height: 500px"
      >
        <div class="absolute-bottom text-center">
          <span v-if="metadata"
            >{{ metadata.name }}: {{ metadata.metadata.tagline }}</span
          >
        </div>
      </q-img>

      <!-- Passport Login -->
      <div class="column items-center justify-evenly" style="height: 150px">
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
              <div class="text-center text-dark">Sign in with Immutable</div>
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
    </q-page-container>
    <q-footer right>
      <q-btn href="https://nevernerf.com" push no-caps>
        <div class="row items-center no-wrap">
          <q-icon left name="img:/NeverNerfLogo.svg" />
          <div class="text-center">NeverNerf.com</div>
        </div>
      </q-btn>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { ref, watch, onMounted } from 'vue';
const router = useRouter();
const route = useRoute();

const token_id = route.params.token_id;
const metadata = ref(null); // To store the JSON data

// Function to load JSON data
async function loadMetadata() {
  if (token_id) {
    try {
      const response = await fetch(`/imx_metadata/${token_id}.json`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      metadata.value = await response.json();
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  }
}
// Load metadata when component is mounted or token_id changes
onMounted(loadMetadata);
watch(() => token_id, loadMetadata);

const isAuthenticated = localStorage.getItem('authToken');

function login() {
  localStorage.setItem('authToken', 'foo');

  if (token_id && isAuthenticated) {
    router.push({ path: `/${token_id}/asset` });
  } else {
    console.error('Route or route parameters are undefined');
    //handle token listing UI
  }
}
</script>
