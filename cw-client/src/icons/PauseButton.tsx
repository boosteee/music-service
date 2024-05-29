const PauseButton = () => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='36'
      height='36'
      viewBox='0 0 24 24'
      fill='currentColor'
      stroke='currentColor'
      strokeWidth={1}
      strokeLinecap='round'
      strokeLinejoin='round'
      className='lucide lucide-circle-pause'
    >
      <circle cx='12' cy='12' r='10' />
      <line
        strokeWidth={2}
        className='stroke-background'
        x1='9.75'
        x2='9.75'
        y1='15.25'
        y2='8.75'
      />
      <line
        strokeWidth={2}
        className='stroke-background'
        x1='14.25'
        x2='14.25'
        y1='15.25'
        y2='8.75'
      />
    </svg>
  );
};

export default PauseButton;
