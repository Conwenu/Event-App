import React from "react";

const SortingFilters = ({ selectedSorting, onSortingChange }) => {
  const handleSortingChange = (e) => {
    onSortingChange(e.target.value); // Only one sorting option can be selected
  };

  return (
    <div>
      <select
        id="sortingFilter"
        className="form-select events-page-sorting-filter"
        aria-label="Sorting options"
        value={selectedSorting}
        onChange={handleSortingChange}
      >
        <option value="newestFirst">Newest First</option>
        <option value="oldestFirst">Oldest First</option>
        <option value="startTimeAsc">Start Time Ascending</option>
        <option value="startTimeDesc">Start Time Descending</option>
      </select>
    </div>
  );
};

export default SortingFilters;
