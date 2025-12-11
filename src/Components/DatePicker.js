import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { TextField } from "@mui/material";
import dayjs from "dayjs";

const CustomDateTimePicker = ({ label, value, onChange }) => {
  const [touched, setTouched] = useState(false); // Track if user interacted

  const isPastDate = value && dayjs(value).isBefore(dayjs()); // Check if past
  const isEmpty = touched && !value; // Check if empty after user interaction

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={(newValue) => {
          setTouched(true);
          if (newValue && dayjs(newValue).isAfter(dayjs())) {
            onChange(newValue);
          }
        }}
        onBlur={() => setTouched(true)} // Mark as touched on blur
        inputFormat="YYYY-MM-DD HH:mm"
        mask="____-__-__ __:__"
        ampm={false}
        minDateTime={dayjs()} // Restrict past dates
        minutesStep={1}
        secondStep={1}
        slots={{
          textField: (params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              placeholder="Select date and time"
              required
              error={isPastDate || isEmpty} // Show error if past date or empty
              helperText={
                isPastDate
                  ? "Please select a future date and time"
                  : isEmpty
                  ? "This field is required"
                  : ""
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#1E1E1E",
                  color: "#FFFFFF",
                  "& fieldset": { borderColor: "#3A3A3A" },
                  "&:hover fieldset": { borderColor: "#555555" },
                  "&.Mui-focused fieldset": { borderColor: "#1976d2" },
                },
                "& .MuiInputBase-input": {
                  color: "#FFFFFF",
                },
                "& .MuiSvgIcon-root": {
                  color: "#FFFFFF !important",
                },
              }}
            />
          ),
        }}
        slotProps={{
          desktopPaper: {
            sx: {
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
            },
          },
          mobilePaper: {
            sx: {
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              "& .MuiPickersCalendarHeader-root, & .MuiDayCalendar-weekDayLabel, & .MuiDayCalendar-day":
                {
                  color: "#FFFFFF",
                },
              "& .Mui-selected": {
                backgroundColor: "#1976d2 !important",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default CustomDateTimePicker;
