const PlayButton = () => {
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
      className='lucide lucide-circle-play'
    >
      <circle cx='12' cy='12' r='10' />
      <polygon
        className='stroke-background fill-background'
        points='10 8 16 12 10 16 10 8'
      />
    </svg>
  );
};

export default PlayButton;
