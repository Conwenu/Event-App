const request = require("supertest");
const app = require("../../server/index");

const generateQuickEvent = () => {
  const randomString = Math.random().toString(36).substring(2, 8);
  const title = `Event_${randomString}`;
  const description = `Description for ${title}`;
  const venue = `Venue_${randomString}`;
  const startTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
  const endTime = new Date(Date.now() + 7200000).toISOString(); // 2 hours from now

  return {
    title,
    description,
    status: "SCHEDULED",
    creatorId: 1,
    venue,
    maxReservations: 100,
    maxReservationsPerUser: 5,
    startTime,
    endTime,
  };
};

describe("GET /events", () => {
  it("should return a list of events", async () => {
    const response = await request(app).get("/api/events");
    expect(response.status).toBe(200);
    expect(response.body.events).toBeInstanceOf(Array);
    expect(Array.isArray(response.body.events)).toBe(true);
    expect(response.body.events[0]).toHaveProperty("id");
    expect(response.body.events[0]).toHaveProperty("title");
    expect(response.body.events[0]).toHaveProperty("description");
    expect(response.body.events[0]).toHaveProperty("status");
    expect(response.body.events[0]).toHaveProperty("creatorId");
    expect(response.body.events[0]).toHaveProperty("venue");
    expect(response.body.events[0]).toHaveProperty("maxReservations");
    expect(response.body.events[0]).toHaveProperty("maxReservationsPerUser");
    expect(response.body.events[0]).toHaveProperty("startTime");
    expect(response.body.events[0]).toHaveProperty("endTime");
  });
  


  
  
  it("should return an event based on the provided id", async () => {
    const response = await request(app).get("/api/event/5");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("title");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("status");
    expect(response.body).toHaveProperty("creatorId");
    expect(response.body).toHaveProperty("venue");
    expect(response.body).toHaveProperty("maxReservations");
    expect(response.body).toHaveProperty("maxReservationsPerUser");
    expect(response.body).toHaveProperty("startTime");
    expect(response.body).toHaveProperty("endTime");
  });
});

describe("POST /event", () => {
  it("should return an error if title is missing", async () => {
    const newEvent = generateQuickEvent();
    delete newEvent.title;
    const response = await request(app).post("/api/event").send(newEvent);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required.");
  });

  it("should return an error if description is missing", async () => {
    const newEvent = generateQuickEvent();
    delete newEvent.description;
    const response = await request(app).post("/api/event").send(newEvent);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "All fields are required.");
  });

  it("should return an error if startTime is after endTime", async () => {
    const newEvent = generateQuickEvent();
    newEvent.startTime = new Date(Date.now() + 7200000).toISOString(); // 2 hours from now
    newEvent.endTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    const response = await request(app).post("/api/event").send(newEvent);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Start time must be before end time.");
  });

  it("should create a new event if all fields are provided", async () => {
    const newEvent = generateQuickEvent();
    const response = await request(app).post("/api/event").send(newEvent);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(newEvent.title);
    expect(response.body.description).toBe(newEvent.description);
    expect(response.body.status).toBe(newEvent.status);
    expect(response.body.creatorId).toBe(newEvent.creatorId);
    expect(response.body.venue).toBe(newEvent.venue);
    expect(response.body.maxReservations).toBe(newEvent.maxReservations);
    expect(response.body.maxReservationsPerUser).toBe(newEvent.maxReservationsPerUser);
    expect(response.body.startTime).toBe(newEvent.startTime);
    expect(response.body.endTime).toBe(newEvent.endTime);
  });
});

describe("PUT /event/:id", () => {
    const id = 50;
  it("should return an error if startTime is after endTime", async () => {
    const updatedEvent = generateQuickEvent();
    updatedEvent.startTime = new Date(Date.now() + 7200000).toISOString(); // 2 hours from now
    updatedEvent.endTime = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
    const response = await request(app).put(`/api/event/${id}`).send(updatedEvent);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Start time must be before end time.");
  });

  it("should update the event if all fields are provided", async () => {
    const updatedEvent = generateQuickEvent();
    const response = await request(app).put(`/api/event/${id}`).send(updatedEvent);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(updatedEvent.title);
    expect(response.body.description).toBe(updatedEvent.description);
    expect(response.body.status).toBe(updatedEvent.status);
    expect(response.body.creatorId).toBe(updatedEvent.creatorId);
    expect(response.body.venue).toBe(updatedEvent.venue);
    expect(response.body.maxReservations).toBe(updatedEvent.maxReservations);
    expect(response.body.maxReservationsPerUser).toBe(updatedEvent.maxReservationsPerUser);
    expect(response.body.startTime).toBe(updatedEvent.startTime);
    expect(response.body.endTime).toBe(updatedEvent.endTime);
  });
});

describe("DELETE /event/:id", () => {
  it("should throw an error if event deletion fails", async () => {
    const id = 10000000;
    const response = await request(app).delete(`/api/event/${id}`);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "Failed to delete event");
  });

// -- This works but I don't feel like changing the id every time....
//   it("should successfully delete an existing event", async () => {
//     const id = 14; // Assuming an event with ID 1 exists
//     const response = await request(app).delete(`/api/event/${id}`);
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("message", "Event deleted successfully");
//   });
});
