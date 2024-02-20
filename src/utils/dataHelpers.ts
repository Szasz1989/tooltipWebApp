import axios from 'axios';
import { useIndexedDB } from 'react-indexed-db-hook';

export const useFetchData = (endpoint: string, id: string) => {
  const { getByID, add } = useIndexedDB('TooltipsObjectStore');

  const fetchData = async () => {
    // Try to get the data from the cache
    const cachedData = await getByID(id);

    if (cachedData) {
      // If the data exists in the cache, return it
      return cachedData;
    } else {
      // If the data doesn't exist in the cache, fetch it from the API
      const tempAPIDomain = 'http://hu1w2021288.graphisoft.hu:1337';
      const response = await axios.get(
        `${tempAPIDomain}/api/${endpoint}/${id}?populate=media`
      );
      const data = response.data.data.attributes;

      let videoData = null;
      // Check if media.data exists before trying to fetch the video data
      if (data.media.data) {
        const videoResponse = await axios.get(
          tempAPIDomain + data.media.data.attributes.url,
          {
            responseType: 'blob',
          }
        );
        videoData = await videoResponse.data;
      }

      // Store the fetched data and video data in IndexedDB for future use
      await add({ id, data, videoData });

      // Return the fetched data and video data
      return { data, videoData };
    }
  };

  return fetchData;
};
