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

    formatTimestamps(startTime1, startTime2) {
      function formatDateTime(timestamp) {
        const options = {
          month: "2-digit",
          day: "2-digit",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        };
        const dateTimeString = new Date(timestamp).toLocaleDateString(
          "en-US",
          options
        );
        const [date, time, period] = dateTimeString.split(/, | /);
        const formattedTime = `${time}${period.toLowerCase()}`;
        return `${date} ${formattedTime}`;
      }
  
      const formattedStartTime1 = formatDateTime(startTime1);
      const formattedStartTime2 = formatDateTime(startTime2);
  
      const date1 = formattedStartTime1.split(" ")[0];
      const date2 = formattedStartTime2.split(" ")[0];
  
      if (date1 === date2) {
        return `${date1} ${formattedStartTime1.split(" ")[1]} - ${
          formattedStartTime2.split(" ")[1]
        }`;
      } else {
        return `${formattedStartTime1} - ${formattedStartTime2}`;
      }
    },

    generateReservationString (resLeft, maxRes) {
      return `${maxRes - resLeft + " / " + maxRes}`;
    },
};

export default EventHelperFunctions;
