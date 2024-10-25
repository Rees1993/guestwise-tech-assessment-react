import { TZDate } from "@date-fns/tz";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { differenceInHours } from "date-fns";
import React from "react";
import { Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .min(11, "Phone number must be 11 digits")
    .max(11, "Phone number must be 11 digits"),
  date: z
    .string()
    .min(1, "Date is required")
    .superRefine((val, ctx) => {
      const bookingDateTime = new Date(val).toJSON().substring(0, 10);
      const now = TZDate.tz("Europe/London").toJSON().substring(0, 10);

      if (bookingDateTime < now) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Date must not be in the past",
        });
      }
    }),
  time: z
    .string()
    .min(1, "Time is required")
    .superRefine((val, ctx) => {
      const now = TZDate.tz("Europe/London");
      const todayWithTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(val.split(":")[0]),
        parseInt(val.split(":")[1])
      );

      const result = differenceInHours(
        todayWithTime.getTime(),
        now.setSeconds(0, 0)
      );

      if (result < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must at least been an hour later!or",
        });
      }
    }),
  guests: z
    .number({ coerce: true })
    .min(1, "Must have at least 1 guest")
    .max(12, "If have more than 12 guests, please contact us"),
});

const BookTable: React.FC = ({}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: TZDate.tz("Europe/London").toJSON().substring(0, 10),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (bookingValues: z.infer<typeof formSchema>) => {
      return fetch("http://localhost:3001/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingValues),
      });
    },

    // TODO: Handle Errors
    onSuccess: () => alert("Success!"),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, { onSuccess: () => reset() });
  }

  return (
    <Container>
      <h2>Book a Table</h2>
      {/* TODO: Make pretty */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name</label>
        <input {...register("name")} type="text" id="name" name="name" />
        {errors?.name && <span>{errors.name.message}</span>}
        <br />
        <label htmlFor="email">Email</label>
        <input {...register("email")} type="email" id="email" name="email" />
        {errors?.email && <span>{errors.email.message}</span>}
        <br />
        <label htmlFor="phone">Phone</label>
        <input {...register("phone")} type="tel" id="phone" name="phone" />
        {errors?.phone && <span>{errors.phone.message}</span>}
        <br />
        <label htmlFor="date">Date</label>
        <input {...register("date")} type="date" id="date" name="date" />
        {errors?.date && <span>{errors.date.message}</span>}
        <br />
        <label htmlFor="time">Time</label>
        <input {...register("time")} type="time" id="time" name="time" />
        {errors?.time && <span>{errors.time.message}</span>}
        <br />
        <label htmlFor="guests">Guests</label>
        <input
          {...register("guests")}
          type="number"
          id="guests"
          name="guests"
        />
        {errors?.guests && <span>{errors.guests.message}</span>}
        <br />
        <button disabled={isPending} type="submit">
          Book
        </button>
      </form>
    </Container>
  );
};

export default BookTable;
