const EventHelperFunctions = {
    mapStatusToColor(status) {
        switch (status) {
          case "SCHEDULED":
            return "bg-primary";
          case "IN_PROGRESS":
            return "bg-warning";
          case "COMPLETED":
            return "bg-success";
          case "CANCELLED":
            return "bg-danger";
          default:
            return "bg-primary"; 
        }
    },

    determineStatus(startTime, endTime, status)  {
      if (status === "CANCELLED") {
        return "CANCELLED";
      }
    
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);
    
      if (now < start) {
        return "SCHEDULED";
      } else if (now >= start && now <= end) {
        return "IN_PROGRESS";
      } else if (now > end) {
        return "COMPLETED";
      }
    
      return "SCHEDULED"; 
    },
};

export default EventHelperFunctions;
