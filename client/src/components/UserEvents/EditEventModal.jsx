import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import axios from "axios";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import "./EditEventModal.css";
const API_URL = process.env.REACT_APP_API_URL;

const EditEventModal = ({ event, setOpenEditModal, fetchEvents }) => {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const [finalRSVPDateTime, setFinalRSVPDateTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const imageInputRef = useRef();
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(8, "Title must be at least 8 characters")
      .max(30, "Title must be at most 30 characters")
      .required("Event title is required"),
    venue: Yup.string()
      .max(50, "Venue must be at most 50 characters")
      .required("Venue is required"),
    description: Yup.string()
      .max(240, "Description must be at most 240 characters")
      .required("Description is required"),
    maxReservations: Yup.number()
      .min(1, "Max Reservations must be at least 1")
      .max(100, "Max Reservations must be at most 100")
      .required("Max Reservations is required"),
    maxReservationsPerUser: Yup.number()
      .min(1, "Reservations per user must be at least 1")
      .required("Reservations per user is required")
      .lessThan(
        Yup.ref("maxReservations"),
        "Reservations per user cannot be more than max reservations"
      ),
    startDate: Yup.date()
      .min(dayjs(), "Start date must be greater than the current time")
      .required("Start date is required"),
    endDate: Yup.date()
      .min(Yup.ref("startDate"), "End date must be after start date")
      .required("End date is required"),
    finalRSVPTime: Yup.date()
      .nullable()
      .test(
        "rsvp-time-valid",
        "Final RSVP time must be less than or equal to start date",
        function (value) {
          const { startDate } = this.parent;
          const currentTime = new Date();
          if (value) {
            if (value > startDate) {
              return this.createError({
                message:
                  "Final RSVP time must be less than or equal to start date",
              });
            }
            if (value < currentTime) {
              return this.createError({
                message: "Final RSVP time cannot be before the current date",
              });
            }
          }
          return true;
        }
      ),
    image: Yup.mixed()
      .nullable()
      .test("fileValidation", "Invalid image file", (value) => {
        return validateImage(value); // Use your helper function to validate
      }),

    specialNote: Yup.string()
      .max(240, "Special note must be at most 240 characters")
      .nullable(),
  });

  const validateImage = (image) => {
    if (!image) return true; // Allow null values

    // If it's a base64 string, check for its format and size
    if (typeof image === "string" && image.startsWith("data:image")) {
      const base64Size = Math.round((image.length * 3) / 4); // Approximate size in bytes
      return base64Size <= 2 * 1024 * 1024; // Check if it's within 2MB
    }

    // If it's a File object, validate its type and size
    if (image instanceof File) {
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "image/webp",
      ];
      return (
        validImageTypes.includes(image.type) && image.size <= 2 * 1024 * 1024
      );
    }

    return false; // Invalid if it's neither a valid base64 nor File
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: event?.title || "",
      venue: event?.venue || "",
      description: event?.description || "",
      maxReservations: event?.maxReservations || "",
      maxReservationsPerUser: event?.maxReservationsPerUser || "",
      specialNote: event?.specialNote || "",
      startDate: event?.startTime ? dayjs(event.startTime) : dayjs(),
      endDate: event?.endTime ? dayjs(event.endTime) : dayjs().add(1, "hour"),
      finalRSVPTime: event?.finalRSVPTime
        ? dayjs(event.finalRSVPTime)
        : dayjs().add(30, "minutes"),
      image: event?.image || null,
    },
  });
  console.log(errors);
  useEffect(() => {
    if (event && setValue) {
      setValue("startDate", dayjs(event.startTime));
      setValue("endDate", dayjs(event.endTime));
      setValue("finalRSVPTime", dayjs(event.finalRSVPTime));
      if (event.image) {
        setImagePreview(event.image);
        setValue("image", event.image);
      }
    }
  }, [event, setValue]);

  const handleEditEvent = async (data) => {
    const postData = {
      ...data,
      startTime: data.startDate ? data.startDate.toISOString() : null,
      endTime: data.endDate ? data.endDate.toISOString() : null,
      finalRSVPTime: data.finalRSVPTime
        ? data.finalRSVPTime.toISOString()
        : null,
      image: data.image || null,
    };

    try {
      const response = await axios.put(
        `${API_URL}/event/${event.id}`,
        postData
      );
      setErrorMessage("");
      console.log("Event updated successfully:", response.data);
      alert("Event updated successfully!");
      setOpenEditModal(false);
      fetchEvents();
    } catch (error) {
      console.error(
        "Error updating event:",
        error.response ? error.response.data : error.message
      );
      setErrorMessage(
        error.response ? error.response.data.error : error.message
      );
      alert("There was an error updating the event. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (!file.type.startsWith("image/") || file.type === "image/gif") {
        setImageError("File must be an image.");
        setImagePreview(null);
      } else if (file.size > 2 * 1024 * 1024) {
        setImageError("File size must be under 2MB.");
        setImagePreview(null);
      } else {
        setImageError(""); // Clear error if file is valid
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          setImagePreview(base64String);
          setValue("image", base64String); // Set the Base64 string in the form value
        };
        reader.readAsDataURL(file); // Convert the file to base64
      }
    } else {
      setImagePreview(null);
      setImageError(""); // Clear any previous error
      setValue("image", null); // Reset the image value
    }
  };

  return (
    <Modal show={true} onHide={() => setOpenEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && (
          <div
            className="error"
            style={{
              color: "var(--bs-danger)",
              fontWeight: "bolder",
              fontSize: "1rem",
            }}
          >
            {errorMessage}
          </div>
        )}

        <Form onSubmit={handleSubmit(handleEditEvent)}>
          {/* Event Title */}
          <Form.Group className="mb-3" controlId="formEventTitle">
            <Form.Label>Event Title</Form.Label>
            <Controller
              name="title"
              control={control}
              defaultValue={event?.title || ""}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Enter event title"
                  isInvalid={!!errors.title}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <Form.Text className="text-danger">
                {errors.title.message}
              </Form.Text>
            )}
          </Form.Group>

          {/* Venue */}
          <Form.Group className="mb-3" controlId="formEventVenue">
            <Form.Label>Venue</Form.Label>
            <Controller
              name="venue"
              control={control}
              defaultValue={event?.venue || ""}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Enter venue"
                  isInvalid={!!errors.venue}
                  {...field}
                />
              )}
            />
            {errors.venue && (
              <Form.Text className="text-danger">
                {errors.venue.message}
              </Form.Text>
            )}
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3" controlId="formEventDescription">
            <Form.Label>Description</Form.Label>
            <Controller
              name="description"
              control={control}
              defaultValue={event?.description || ""}
              render={({ field }) => (
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter event description"
                  isInvalid={!!errors.description}
                  {...field}
                />
              )}
            />
            {errors.description && (
              <Form.Text className="text-danger">
                {errors.description.message}
              </Form.Text>
            )}
          </Form.Group>

          {/* Start Date */}
          <Form.Group className="mb-3" controlId="formStartDate">
            <Form.Label>Start Date</Form.Label>

            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    {...field}
                    renderInput={(params) => (
                      <Form.Control {...params.inputProps} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Form.Group>
          {errors.startDate && (
            <Form.Text className="text-danger">
              {errors.startDate.message}
            </Form.Text>
          )}
          {/* End Date */}
          <Form.Group className="mb-3" controlId="formEndDate">
            <Form.Label>End Date</Form.Label>

            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    {...field}
                    renderInput={(params) => (
                      <Form.Control {...params.inputProps} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Form.Group>
          {errors.endDate && (
            <Form.Text className="text-danger">
              {errors.endDate.message}
            </Form.Text>
          )}
          {/* Final RSVP Time */}
          <Form.Group className="mb-3" controlId="formFinalRSVPTime">
            <Form.Label>Final RSVP Time</Form.Label>

            <Controller
              name="finalRSVPTime"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    {...field}
                    renderInput={(params) => (
                      <Form.Control {...params.inputProps} />
                    )}
                  />
                </LocalizationProvider>
              )}
            />
          </Form.Group>
          {errors.finalRSVPTime && (
            <Form.Text className="text-danger">
              {errors.finalRSVPTime.message}
            </Form.Text>
          )}
          {/* Max Reservations */}
          <Form.Group className="mb-3" controlId="formMaxReservations">
            <Form.Label>Max Reservations</Form.Label>
            <Controller
              name="maxReservations"
              control={control}
              defaultValue={event?.maxReservations || ""}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  placeholder="Enter max reservations"
                  isInvalid={!!errors.maxReservations}
                  {...field}
                />
              )}
            />
            {errors.maxReservations && (
              <Form.Text className="text-danger">
                {errors.maxReservations.message}
              </Form.Text>
            )}
          </Form.Group>

          {/* Reservations Per User */}
          <Form.Group className="mb-3" controlId="formaxReservationsPerUser">
            <Form.Label>Reservations Per User</Form.Label>
            <Controller
              name="reservationPerUser"
              control={control}
              defaultValue={event?.maxReservationsPerUser || ""}
              render={({ field }) => (
                <Form.Control
                  type="number"
                  placeholder="Enter reservations per user"
                  isInvalid={!!errors.reservationPerUser}
                  {...field}
                />
              )}
            />
            {errors.maxReservationsPerUser && (
              <Form.Text className="text-danger">
                {errors.maxReservationsPerUser.message}
              </Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEventImage">
            <Form.Label>Event Image</Form.Label>
            <Form.Control
              type="file"
              ref={imageInputRef}
              onChange={handleFileChange}
              isInvalid={!!imageError}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </div>
            )}
            {errors.image && (
              <Form.Text className="text-danger">
                {errors.image.message}
              </Form.Text>
            )}
            <br />
            {imageError && (
              <Form.Text className="text-danger">{imageError}</Form.Text>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="forspecialNote">
            <Form.Label>Special Note To Attendees</Form.Label>
            <Controller
              name="specialNote"
              className="createEventFormInput createEventFormDirect"
              id="specialNote"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  placeholder="Edit Special Note To Attendees"
                  isInvalid={!!errors.specialNote}
                  {...field}
                />
              )}
            />
            {errors.specialNote && (
              <p className="error-message">{errors.specialNote.message}</p>
            )}
          </Form.Group>

          <Button variant="primary" type="submit" className="me-2">
            Save Changes
          </Button>
          <Button variant="secondary" onClick={() => setOpenEditModal(false)}>
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditEventModal;
