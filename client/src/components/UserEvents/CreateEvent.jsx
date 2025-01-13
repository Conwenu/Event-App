import React, { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./CreateEvent.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import "bootstrap/dist/css/bootstrap.min.css";
import dayjs from "dayjs";
import axios from "axios";
const API_URL = process.env.REACT_APP_API_URL;
const CreateEvent = () => {
  const [startDateTime, setStartDateTime] = useState(null);
  const [endDateTime, setEndDateTime] = useState(null);
  const [finalRSVPTime, setFinalRSVPTime] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageError, setImageError] = useState("");
  const userID = 10;
  const imageInputRef = useRef();
  const currentTime = dayjs();

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
      .max(1000, "Max Reservations must be at most 1000")
      .required("Max Reservations is required"),
    reservationsPerUser: Yup.number()
      .min(1, "Reservations per user must be at least 1")
      .required("Reservations per user is required")
      .lessThan(
        Yup.ref("maxReservations"),
        "Reservations per user cannot be more than max reservations"
      ),
    startDate: Yup.date()
      .min(currentTime, "Start date must be greater than the current time")
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
          const { startDate } = this.parent; // get the startDate field
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
      .optional(),
  });

  const validateImage = (image) => {
    if (!image) return true; // Allow null values
    if (typeof image === "string" && image.startsWith("data:image")) {
      const base64Size = Math.round((image.length * 3) / 4);
      return base64Size <= 2 * 1024 * 1024;
    }

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

    return false;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleCreateEvent = async (data) => {
    console.log("Form data submitted:", data);
    console.log("Validation errors:", errors);

    const startDateTimeISO = data.startDate
      ? data.startDate.toISOString()
      : null;
    const endDateTimeISO = data.endDate ? data.endDate.toISOString() : null;
    const finalRSVPTimeISO = data.finalRSVPTime
      ? data.finalRSVPTime.toISOString()
      : null;

    const postData = {
      title: data.title,
      venue: data.venue,
      description: data.description,
      maxReservations: data.maxReservations,
      maxReservationsPerUser: data.reservationsPerUser,
      startTime: startDateTimeISO,
      endTime: endDateTimeISO,
      finalRSVPTime: finalRSVPTimeISO,
      creatorId: userID,
      image: data.image ? data.image : null,
      specialNote: data.specialNote ? data.specialNote : null,
    };

    try {
      const response = await axios.post(`${API_URL}/event/`, postData);
      console.log("Event created successfully:", response.data);

      alert("Event created successfully!");

      reset();

      setStartDateTime(null);
      setEndDateTime(null);
      setFinalRSVPTime(null);
      setImagePreview(null);
      setImageError("");
      if (imageInputRef.current) {
        imageInputRef.current.value = null;
      }
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response ? error.response.data : error.message
      );
      alert("There was an error creating the event. Please try again.");
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
        setImageError("");
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result;
          setImagePreview(base64String);
          setValue("image", base64String);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImagePreview(null);
      setImageError("");
      setValue("image", null);
    }
  };

  return (
    <div className="createEventContainer">
      <div className="createEventHeader">
        <h2>Create Event</h2>
      </div>
      <div className="createEventFormContainer">
        <form
          onSubmit={(e) => {
            console.log("Form submitted!");
            handleSubmit(handleCreateEvent)(e);
          }}
        >
          <label htmlFor="eventName">Event Name</label>
          <Controller
            name="title"
            className="createEventFormInput createEventFormDirect"
            id="title"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="createEventFormInput"
                placeholder="Birthday Party"
                value={field.value || ""}
              />
            )}
          />
          {errors.title && (
            <p className="error-message">{errors.title.message}</p>
          )}

          <label htmlFor="venueName">Venue</label>
          <Controller
            className="createEventFormInput createEventFormDirect"
            id="venueName"
            name="venue"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="createEventFormInput"
                placeholder="1 Hacker Wy, Menlo Park, CA 94025"
                value={field.value || ""}
              />
            )}
          />
          {errors.venue && (
            <p className="error-message">{errors.venue.message}</p>
          )}

          <label htmlFor="description">Description</label>
          <Controller
            name="description"
            className="createEventFormInput createEventFormDirect"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                className="createEventFormInput"
                placeholder="Describe the event..."
                value={field.value || ""}
              />
            )}
          />
          {errors.description && (
            <p className="error-message">{errors.description.message}</p>
          )}

          <label htmlFor="startDate">Start Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    {...field}
                    label="Select Start Date & Time"
                    value={startDateTime}
                    onChange={(newValue) => {
                      setStartDateTime(newValue);
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => <input {...params.inputProps} />}
                  />
                </LocalizationProvider>
              )}
            />
          </LocalizationProvider>
          {errors.startDate && (
            <p className="error-message">{errors.startDate.message}</p>
          )}

          <label htmlFor="endDate">End Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    {...field}
                    label="Select End Date & Time"
                    value={endDateTime}
                    onChange={(newValue) => {
                      setEndDateTime(newValue);
                      field.onChange(newValue);
                    }}
                    renderInput={(params) => <input {...params.inputProps} />}
                  />
                </LocalizationProvider>
              )}
            />
          </LocalizationProvider>
          {errors.endDate && (
            <p className="error-message">{errors.endDate.message}</p>
          )}

          <label htmlFor="finalRSVPTime">Final RSVP Time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="finalRSVPTime"
              control={control}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  label="Select Final RSVP Time"
                  value={
                    finalRSVPTime && finalRSVPTime.isValid()
                      ? finalRSVPTime
                      : null
                  }
                  onChange={(newValue) => {
                    setFinalRSVPTime(newValue);
                    field.onChange(newValue);
                  }}
                  renderInput={(params) => <input {...params.inputProps} />}
                />
              )}
            />
          </LocalizationProvider>
          {errors.finalRSVPTime && (
            <p className="error-message">{errors.finalRSVPTime.message}</p>
          )}

          <div className="mb-3">
            <label htmlFor="image" className="form-label">
              Image
            </label>
            <input
              className="form-control"
              type="file"
              id="image"
              name="image"
              onChange={handleFileChange}
              ref={imageInputRef}
            />
          </div>

          {imageError && <p className="error-message">{imageError}</p>}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="image-preview" />
          )}

          <label htmlFor="maxReservations">Max Reservations</label>
          <Controller
            name="maxReservations"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="createEventFormInput"
                placeholder="20"
                min={1}
                value={field.value || ""}
              />
            )}
          />
          {errors.maxReservations && (
            <p className="error-message">{errors.maxReservations.message}</p>
          )}

          <label htmlFor="reservationsPerUser">Reservations Per User</label>
          <Controller
            name="reservationsPerUser"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="createEventFormInput"
                placeholder="1"
                min={1}
                value={field.value || ""}
              />
            )}
          />
          {errors.reservationsPerUser && (
            <p className="error-message">
              {errors.reservationsPerUser.message}
            </p>
          )}

          <label htmlFor="specialNote">Special Note To Attendees</label>
          <Controller
            name="specialNote"
            className="createEventFormInput createEventFormDirect"
            id="specialNote"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                className="createEventFormInput"
                placeholder="Zoom Link:"
                value={field.value || ""}
              />
            )}
          />
          {errors.specialNote && (
            <p className="error-message">{errors.specialNote.message}</p>
          )}

          <button type="submit" className="create-event-submit-button btn mt-3">
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
