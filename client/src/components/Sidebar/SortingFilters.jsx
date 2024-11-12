import React from "react";

const SortingFilters = ({ selectedSorting, onSortingChange }) => {
  const handleSortingChange = (e) => {
    onSortingChange(e.target.value); // Only one sorting option can be selected
  };

  return (
    <div>
      <label>
        <input
          type="radio"
          name="sortingFilter"
          value="newestFirst"
          checked={selectedSorting === "newestFirst"}
          onChange={handleSortingChange}
        />
        {" Newest First"}
      </label>

      <label>
        <input
          type="radio"
          name="sortingFilter"
          value="oldestFirst"
          checked={selectedSorting === "oldestFirst"}
          onChange={handleSortingChange}
        />
        {" Oldest First"}
      </label>

      <label>
        <input
          type="radio"
          name="sortingFilter"
          value="startTimeAsc"
          checked={selectedSorting === "startTimeAsc"}
          onChange={handleSortingChange}
        />
        {" Start Time Ascending"}
      </label>

      <label>
        <input
          type="radio"
          name="sortingFilter"
          value="startTimeDesc"
          checked={selectedSorting === "startTimeDesc"}
          onChange={handleSortingChange}
        />
        {" Start Time Descending"}
      </label>
    </div>
  );
};

export default SortingFilters;
