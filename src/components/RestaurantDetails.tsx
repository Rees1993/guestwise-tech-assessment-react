import React, { useEffect, useState } from "react";
import { Card, Container } from "react-bootstrap";
import { getRestaurantDetails } from "../services/api";
import { useQuery } from "@tanstack/react-query";

type RestaurantDetailsProps = {
  restaurantId: number;
};

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({
  restaurantId,
}) => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["restaurants", restaurantId],
    queryFn: () => getRestaurantDetails(restaurantId),
  });

  //TODO: Better loading state
  if (isPending) return <p>Loading...</p>;

  if (isError) {
    return <p>An error has occurred: " + {error.message}</p>;
  }

  if (data === undefined) return <p>Restaurant not found!</p>;

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Restaurant Details</Card.Title>
          <Card.Text>Address: {data.details.address}</Card.Text>
          <Card.Text>
            Opening Hours: <br />
            Weekday: {data.details.openingHours.weekday} <br />
            Weekend: {data.details.openingHours.weekend}
          </Card.Text>
          <Card.Text>Review Score: {data.details.reviewScore}</Card.Text>
          <Card.Text>Contact: {data.details.contactEmail}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetails;
