const PlaylistSongsHeader = () => {
  return (
    <div className='text-xs text-muted-foreground font-semibold h-8 flex flex-row items-center rounded pl-2 pr-6 py-2'>
      <p className='w-3/6 flex flex-row '>Песня</p>
      <p className='w-2/6 flex justify-start'>Альбом</p>
      <p className='w-2/6 flex justify-start'>Исполнитель</p>
      <p className='w-1/6 flex justify-end'>Время</p>
      <p className='flex ml-11'></p>
    </div>
  );
};

export default PlaylistSongsHeader;
