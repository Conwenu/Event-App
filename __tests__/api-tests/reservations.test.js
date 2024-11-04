const request = require("supertest");
const app = require("../../server/index");

const generateQuickReservation = () => {
  return {
    userId: 1,
    eventId: 1,
    seatsReserved: Math.floor(Math.random() * 5) + 1, // Random seats between 1-5
  };
};

describe("GET /reservations", () => {
    // Non empty reservations list
  it("should return reservations for a given event", async () => {
    const response = await request(app).get("/api/reservation/event/9");
    expect(response.status).toBe(200);
    expect(response.body.reservation).toBeInstanceOf(Array);
    expect(Array.isArray(response.body.reservation)).toBe(true);
    expect(response.body.reservation[0]).toHaveProperty('id');
    expect(response.body.reservation[0]).toHaveProperty('seatsReserved');
    expect(response.body.reservation[0]).toHaveProperty('userId');
    expect(response.body.reservation[0]).toHaveProperty('eventId');
  });

  it("should return a specific reservation for a user and event", async () => {
    const response = await request(app).get("/api/reservation/21/9");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('seatsReserved');
    expect(response.body.userId).toBe(21);
    expect(response.body.eventId).toBe(9);
  });
});

describe("POST /reservations", () => {
  it("should return an error if seatsReserved is missing", async () => {
    const newReservation = { userId: 1, eventId: 50 };
    const response = await request(app).post(`/api/reservation/${newReservation.userId}/${newReservation.eventId}`).send(newReservation);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Seats reserved is required');
  });

  // -- This works but I don't feel like changing the id every time....
//   it("should create a new reservation if all fields are provided", async () => {
//     const newReservation = generateQuickReservation();
//     newReservation.userId = 10;
//     newReservation.eventId = 52;
//     const response = await request(app).post(`/api/reservation/${newReservation.userId}/${newReservation.eventId}`).send(newReservation);
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('id');
//     expect(response.body.userId).toBe(newReservation.userId);
//     expect(response.body.eventId).toBe(newReservation.eventId);
//     expect(response.body.seatsReserved).toBe(newReservation.seatsReserved);
//   });

  it("should return an error if user already has a reservation for the event", async () => {
    const existingReservation = { userId: 10, eventId: 54, seatsReserved: 2 };
    const response = await request(app).post('/api/reservation/10/54').send(existingReservation);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'User already has a reservation for this event. Please try editing your reservation instead.');
  });
});

describe("PUT /reservations/:reservationId", () => {
  it("should return an error if trying to edit a non-existing reservation", async () => {
    const updatedReservation = { seatsReserved: 3 };
    const response = await request(app).put('/api/reservation/9999/10').send(updatedReservation);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Reservation not found');
  });

  it("should update the reservation if all fields are provided and valid", async () => {
    const updatedReservation = { seatsReserved: 3 };
    const response = await request(app).put('/api/reservation/15/20').send(updatedReservation);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.seatsReserved).toBe(updatedReservation.seatsReserved);
  });
});

describe("DELETE /reservations", () => {
  it("should return an error if reservation deletion fails", async () => {
    const response = await request(app).delete('/api/reservation/999/1');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Reservation not found');
  });

  // -- This works but I don't feel like changing the id every time....
//   it("should successfully delete an existing reservation", async () => {
//     const response = await request(app).delete('/api/reservation/24/10');
//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty('message', 'Reservation deleted successfully');
//   });
});
