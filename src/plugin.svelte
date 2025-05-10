<div class="plugin__mobile-header">
    {title}
</div>
<section class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={() => bcast.emit('rqstOpen', 'menu')}
    >
        {title}
    </div>
    
    GPS location of Kagou is TT: 
    
    {#if error}
      <p style="color: red;">Error: {error}</p>
    {:else if coordinates.length === 0}
      <p>Loading coordinates...</p>
    {:else}
      <p>Last known location: Lat: {coordinates[coordinates.length - 1].lat}, Lon: {coordinates[coordinates.length - 1].lon}</p>
    {/if}
</section>

<script lang="ts">
    import bcast from "@windy/broadcast";
    import { onDestroy, onMount } from 'svelte';
    import config from './pluginConfig';
	import { map } from '@windy/map';
	import { boatIcon } from './boatIcon';

    const { title } = config;

    let coordinates: { lat: number, lon: number }[] = [];
    let error: string = '';

    const KML_URL = 'https://sailingkagou.eu/track.kml'; // Replace with actual KML URL

    export const onopen = (_params: unknown) => {
        // Handle plugin opening logic here (if necessary)
    };

    onMount(async () => {
        try {
            // Fetch the KML data
            const response = await fetch(KML_URL, {
                method: 'GET',
                mode: 'cors',  // Explicitly enable CORS
            });

            if (!response.ok) {
                throw new Error('Failed to fetch KML file');
            }

            const text = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(text, 'application/xml');

            // Extract coordinates from <coordinates> tags
            const coordElements = xmlDoc.getElementsByTagName('coordinates');
			const when = xmlDoc.getElementsByTagName('when')[0].textContent?.trim() || '';
            let newCoordinates: { lat: number, lon: number }[] = []; // Create a new array

            for (let i = 0; i < coordElements.length; i++) {
                const rawCoords = coordElements[i].textContent?.trim() || '';
                const coordLines = rawCoords.split(/\s+/);

                coordLines.forEach((line) => {
                    const [lon, lat] = line.split(',').map(Number);
                    if (!isNaN(lat) && !isNaN(lon)) {
                        newCoordinates.push({ lat, lon });
                    }
                });
            }

            // Update the coordinates with the new array to trigger reactivity
            coordinates = [...newCoordinates]; // Create a new reference

            // If the coordinates array is populated, add a marker to the map on the last coordinates
			console.log(map);
            if (coordinates.length > 0 && map) {
                const lastCoord = coordinates[coordinates.length - 1];
				
				
                L.marker([lastCoord.lat, lastCoord.lon], {
                        icon: boatIcon,
                    }).addTo(map)
                  .bindPopup(`<b>Kagou</b><br />UTC:${when} <br />Lat: ${lastCoord.lat}, Lon: ${lastCoord.lon}`)
                  .openPopup();
            }

            // Logging for debugging
            console.log(coordinates);
        } catch (e) {
            error = `Error loading or parsing KML: ${e.message}`;
            console.error(error);
        }
    });

    onDestroy(() => {
        
    });
</script>

<style lang="less">
    // Your LESS or CSS styles go here
</style>