<template>
  <div class="w-full">
    <GooglePlacesInput
      v-model="selectedArea"
      placeholder="Enter city or zip code..."
      :types="['(regions)']"
      @select="onAreaSelect"
    />

    <div v-if="selectedArea" class="bg-muted/10 mt-4 p-4 rounded-lg">
      <p class="text-muted text-sm">Selected area:</p>
      <p class="font-medium">{{ selectedArea.formattedAddress || selectedArea.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PlaceDetails } from '~/components/GooglePlacesInput.vue';

const { store } = useFormEngine();

const selectedArea = ref<PlaceDetails | null>(null);

// When area is selected, store it in form answers
const onAreaSelect = (place: PlaceDetails) => {
  store.setAnswer('area', place.formattedAddress || place.description);
  store.setAnswer('areaDetails', place);
};

// Initialize from stored value if exists
onMounted(() => {
  const storedDetails = store.answers.areaDetails as PlaceDetails | undefined;
  if (storedDetails) {
    selectedArea.value = storedDetails;
  }
});
</script>
