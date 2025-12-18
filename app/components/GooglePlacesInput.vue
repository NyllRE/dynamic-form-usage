<template>
  <div class="relative w-full">
    <UInput
      v-model="searchTerm"
      :placeholder="placeholder"
      :disabled="disabled"
      :loading="isLoading"
      class="w-full"
      icon="i-lucide-map-pin"
      @focus="showDropdown = true"
    />

    <!-- Dropdown -->
    <div
      v-if="showDropdown && (suggestions.length > 0 || searchTerm)"
      class="z-50 absolute bg-white dark:bg-gray-900 shadow-lg mt-1 border border-gray-200 dark:border-gray-700 rounded-lg w-full max-h-60 overflow-auto"
    >
      <template v-if="suggestions.length > 0">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion.placeId"
          type="button"
          class="hover:bg-gray-50 focus:bg-gray-50 dark:hover:bg-gray-800 dark:focus:bg-gray-800 px-4 py-3 focus:outline-none w-full text-left transition-colors"
          @click="selectPlace(suggestion)"
        >
          <div class="flex items-start gap-3">
            <UIcon name="i-lucide-map-pin" class="mt-0.5 w-4 h-4 text-muted shrink-0" />
            <div class="flex flex-col min-w-0">
              <span class="font-medium text-default truncate">{{ suggestion.mainText }}</span>
              <span class="text-muted text-sm truncate">{{ suggestion.secondaryText }}</span>
            </div>
          </div>
        </button>
      </template>

      <div v-else-if="searchTerm && !isLoading" class="px-4 py-6 text-muted text-center">
        <UIcon name="i-lucide-search" class="mx-auto mb-2 w-8 h-8" />
        <p>No places found for "{{ searchTerm }}"</p>
      </div>

      <div v-else-if="!searchTerm" class="px-4 py-6 text-muted text-center">
        <UIcon name="i-lucide-search" class="mx-auto mb-2 w-8 h-8" />
        <p>Start typing to search for a location</p>
      </div>
    </div>

    <!-- Click outside handler -->
    <div v-if="showDropdown" class="z-40 fixed inset-0" @click="showDropdown = false" />
  </div>
</template>

<script setup lang="ts">
export interface PlaceSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails extends PlaceSuggestion {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  lat?: number;
  lng?: number;
  formattedAddress?: string;
}

// Google Places API response types
interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text?: string;
  };
}

interface AutocompleteResponse {
  predictions: AutocompletePrediction[];
  status: string;
  error_message?: string;
}

interface PlaceDetailsResponse {
  result: {
    address_components?: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address?: string;
    geometry?: {
      location: {
        lat: number;
        lng: number;
      };
    };
    name?: string;
  };
  status: string;
  error_message?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: PlaceDetails | null;
    placeholder?: string;
    disabled?: boolean;
    types?: string[];
    componentRestrictions?: { country: string | string[] };
  }>(),
  {
    modelValue: null,
    placeholder: 'Search for an address...',
    disabled: false,
    types: () => ['address'],
    componentRestrictions: undefined,
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: PlaceDetails | null];
  select: [value: PlaceDetails];
}>();

const searchTerm = ref('');
const suggestions = ref<PlaceSuggestion[]>([]);
const isLoading = ref(false);
const showDropdown = ref(false);

// Debounce timeout
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

// Fetch autocomplete suggestions via server API
const fetchSuggestions = async (query: string) => {
  if (!query || query.length < 2) {
    suggestions.value = [];
    return;
  }

  isLoading.value = true;

  try {
    const params: Record<string, string> = {
      input: query,
    };

    // Add types if specified
    if (props.types && props.types.length > 0) {
      params.types = props.types.join('|');
    }

    // Add country restrictions if specified
    if (props.componentRestrictions?.country) {
      const countries = Array.isArray(props.componentRestrictions.country)
        ? props.componentRestrictions.country.join('|')
        : props.componentRestrictions.country;
      params.components = `country:${countries}`;
    }

    const response = await $fetch<AutocompleteResponse>('/api/places/autocomplete', {
      method: 'GET',
      query: params,
    });

    if (response.status === 'OK' && response.predictions) {
      suggestions.value = response.predictions.map((prediction) => ({
        placeId: prediction.place_id,
        description: prediction.description,
        mainText: prediction.structured_formatting.main_text,
        secondaryText: prediction.structured_formatting.secondary_text || '',
      }));
    } else if (response.status === 'ZERO_RESULTS') {
      suggestions.value = [];
    } else {
      console.error('Places API error:', response.status, response.error_message);
      suggestions.value = [];
    }
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    suggestions.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Debounced search function
const debouncedSearch = (query: string) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  debounceTimeout = setTimeout(() => {
    fetchSuggestions(query);
  }, 300);
};

// Watch search term changes
watch(searchTerm, (newValue) => {
  if (newValue) {
    showDropdown.value = true;
    debouncedSearch(newValue);
  } else {
    suggestions.value = [];
  }
});

// Fetch place details via server API
const fetchPlaceDetails = async (placeId: string): Promise<PlaceDetailsResponse | null> => {
  try {
    const response = await $fetch<PlaceDetailsResponse>('/api/places/details', {
      method: 'GET',
      query: {
        place_id: placeId,
      },
    });

    return response;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

// Handle place selection
const selectPlace = async (place: PlaceSuggestion) => {
  searchTerm.value = place.description;
  showDropdown.value = false;
  isLoading.value = true;

  try {
    const response = await fetchPlaceDetails(place.placeId);

    if (response?.status === 'OK' && response.result) {
      const details = parseAddressComponents(response.result, place);
      emit('update:modelValue', details);
      emit('select', details);
    } else {
      // Fallback to basic place info if details fail
      const basicDetails: PlaceDetails = {
        ...place,
        formattedAddress: place.description,
      };
      emit('update:modelValue', basicDetails);
      emit('select', basicDetails);
    }
  } catch (error) {
    console.error('Error fetching place details:', error);
    // Fallback
    const basicDetails: PlaceDetails = {
      ...place,
      formattedAddress: place.description,
    };
    emit('update:modelValue', basicDetails);
    emit('select', basicDetails);
  } finally {
    isLoading.value = false;
  }
};

// Parse address components from Google Place result
const parseAddressComponents = (
  result: PlaceDetailsResponse['result'],
  place: PlaceSuggestion
): PlaceDetails => {
  const components: Record<string, string> = {};

  result.address_components?.forEach((component) => {
    component.types.forEach((type) => {
      components[type] = component.short_name;
      components[`${type}_long`] = component.long_name;
    });
  });

  return {
    ...place,
    street: [components.street_number, components.route].filter(Boolean).join(' '),
    city:
      components.locality ||
      components.sublocality_level_1 ||
      components.administrative_area_level_2,
    state: components.administrative_area_level_1,
    zip: components.postal_code,
    country: components.country_long || components.country,
    lat: result.geometry?.location?.lat,
    lng: result.geometry?.location?.lng,
    formattedAddress: result.formatted_address,
  };
};

// Sync with external modelValue
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      searchTerm.value = newValue.formattedAddress || newValue.description;
    }
  },
  { immediate: true }
);
</script>
