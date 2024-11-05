const EventHelperFunctions = {
    mapStatusToColor(status) {
        switch (status) {
          case "SCHEDULED":
            return "bg-secondary";
          case "IN_PROGRESS":
            return "bg-warning";
          case "COMPLETED":
            return "bg-success";
          case "CANCELLED":
            return "bg-danger";
          default:
            return "bg-secondary"; 
        }
    },
};

export default EventHelperFunctions;
