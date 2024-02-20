import axios from 'axios';
import { useIndexedDB } from 'react-indexed-db-hook';
import { useEffect, useState } from 'react';

interface FetchedData {
  data: Attributes;
  videoData?: Blob;
}

interface Attributes {
  title?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  description?: string;
  shortcut?: string;
  customID?: string;
  extendedDescription?: string;
  learnMore?: string;
  videoData?: string;
}

export function useFetchData(endpoint: string, id: string) {
  const { getByID, add, update } = useIndexedDB('TooltipsObjectStore');

  const [data, setData] = useState<Attributes | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Try to get the data from the cache
      const cachedData = await getByID(id);
      const tempAPIDomain = 'http://hu1w2021288.graphisoft.hu:1337';
      const cachedLastUpdated = cachedData?.data?.updatedAt;
      const updatedData = await axios.get(
        `${tempAPIDomain}/api/${endpoint}/${id}`
      );
      const dataWasModified =
        updatedData?.data?.data.attributes.updatedAt !== cachedLastUpdated;

      const fetchDataFromAPI = async () => {
        // If the data doesn't exist in the cache, fetch it from the API
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
        if (cachedData && dataWasModified) {
          await update({ id, data, videoData });
        } else {
          await add({ id, data, videoData });
        }

        // Return the fetched data and video data
        return { data, videoData };
      };

      if (cachedData && !dataWasModified) {
        // If the data exists in the cache, return it
        return cachedData;
      } else if (cachedData && dataWasModified) {
        return await fetchDataFromAPI();
      } else {
        return await fetchDataFromAPI();
      }
    };

    const getData = async () => {
      try {
        const fetchedData = (await fetchData()) as FetchedData;
        setData(fetchedData.data as Attributes); // Explicitly type fetchedData as Attributes

        // Create a URL for the video blob
        if (fetchedData.videoData) {
          const url = URL.createObjectURL(fetchedData.videoData);
          setVideoUrl(url);
        } else {
          setVideoUrl(null);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    getData();
  }, [endpoint, id, getByID, add, update]);

  return { data, videoUrl };
}
