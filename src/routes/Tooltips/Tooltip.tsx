import { useFetchData } from '@/utils/dataHelpers';
import learnMoreSVG from '@assets/learnMoreIcon.svg';

function Tooltip() {
  const { data, videoUrl } = useFetchData('tooltips', '1');

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
