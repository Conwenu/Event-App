import React from "react";

const EventCharacteristicsFilters = ({
  selectedEventStatus,
  onEventStatusChange,
}) => {
  const handleStatusChange = (e) => {
    onEventStatusChange(e.target.value);
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          value="scheduled"
          checked={selectedEventStatus.includes("scheduled")}
          onChange={handleStatusChange}
        />
        {" Scheduled"}
      </label>

      <label>
        <input
          type="checkbox"
          value="inProgress"
          checked={selectedEventStatus.includes("inProgress")}
          onChange={handleStatusChange}
        />
        {" In Progress"}
      </label>

      <label>
        <input
          type="checkbox"
          value="completed"
          checked={selectedEventStatus.includes("completed")}
          onChange={handleStatusChange}
        />
        {" Completed"}
      </label>

      <label>
        <input
          type="checkbox"
          value="cancelled"
          checked={selectedEventStatus.includes("cancelled")}
          onChange={handleStatusChange}
        />
        {" Cancelled"}
      </label>
    </div>
  );
};

export default EventCharacteristicsFilters;
