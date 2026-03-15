// ---------------------------------------------------------------------------
// Geocoding helper using Nominatim (OpenStreetMap)
// ---------------------------------------------------------------------------

interface NominatimResult {
  lat: string;
  lon: string;
}

export async function geocode(
  municipality: string
): Promise<{ lat: number; lon: number } | null> {
  const query = encodeURIComponent(`${municipality}, Girona, Spain`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "arafinestra-cli/1.0",
      Accept: "application/json",
    },
  });

  if (!res.ok) return null;

  const results: NominatimResult[] = await res.json();

  if (results.length === 0) return null;

  return {
    lat: parseFloat(results[0].lat),
    lon: parseFloat(results[0].lon),
  };
}
