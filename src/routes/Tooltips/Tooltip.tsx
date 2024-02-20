import { useEffect, useState, useCallback } from 'react';
import { useFetchData } from '@/utils/dataHelpers';
import learnMoreSVG from '@assets/learnMoreIcon.svg';

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

function Tooltip() {
  const [data, setData] = useState<Attributes | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const fetchData = useCallback(useFetchData('tooltips', '1'), []);

  useEffect(() => {
    const getData = async () => {
      try {
        const fetchedData = (await fetchData()) as FetchedData;
        setData(fetchedData.data as Attributes); // Explicitly type fetchedData as Attributes

        // Create a URL for the video blob
        if (fetchedData.videoData) {
          const url = URL.createObjectURL(fetchedData.videoData);
          setVideoUrl(url);
        } else {
          setVideoUrl(null); // Clear the video URL if media.data is null
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    getData();
  }, [fetchData]);

  if (data === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="tooltip-wrapper">
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      <div className="quick-tooltip">
        <div className="quick-first-row">
          <span className="tooltip-title">{data.title}</span>
          <span>({data.shortcut})</span>
        </div>
        <div>{data.description}</div>
      </div>
      <div className="expanded-tooltip">
        <div>{data.extendedDescription}</div>
        <div className="tooltip-learn-more">
          <img src={learnMoreSVG} alt="Learn More" />
          Learn More
        </div>
        <div className="media-wrapper">
          {videoUrl && <video src={videoUrl} autoPlay muted loop />}
        </div>
      </div>
    </div>
  );
}

export default Tooltip;
