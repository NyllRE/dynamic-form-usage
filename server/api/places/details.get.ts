export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);

  const params = new URLSearchParams({
    place_id: query.place_id as string,
    key: config.googleMapsApiKey as string,
    fields: 'address_components,formatted_address,geometry,name',
  });

  try {
    const response = await $fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`
    );
    return response;
  } catch (error) {
    console.error('Place details error:', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch place details',
    });
  }
});
