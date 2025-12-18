export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const params = new URLSearchParams({
    input: query.input as string,
    key: config.googleMapsApiKey as string,
  });

  if (query.types) {
    params.append('types', query.types as string);
  }

  if (query.components) {
    params.append('components', query.components as string);
  }

  try {
    const response = await $fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error('Places autocomplete error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch place suggestions',
    });
  }
});
