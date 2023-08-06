import React from 'react';

const FilteredTracks = ({ filteredTracks }) => {
  return (
    <div>
      <h1>Filtered tracks</h1>
      <ul>
        {filteredTracks.map((track) => (
          <li key={track.id}>{track.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default FilteredTracks;

