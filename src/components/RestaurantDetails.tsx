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
  const {
    data: details,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["restaurants", restaurantId],
    queryFn: () => getRestaurantDetails(restaurantId),
  });

  //TODO: Better loading state
  if (isPending) return <p>Loading...</p>;

  if (isError) {
    return <p>An error has occurred: " + {error.message}</p>;
  }

  if (details === undefined) return <p>Restaurant not found!</p>;

  return (
    <Container>
      <Card>
        <Card.Body>
          <Card.Title>Restaurant Details</Card.Title>
          <Card.Text>Address: {details.address}</Card.Text>
          <Card.Text>Review Score: {details.reviewScore}</Card.Text>
          <Card.Text>Contact: {details.contactEmail}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetails;
