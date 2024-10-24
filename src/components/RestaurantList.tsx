import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ListGroup, Container } from "react-bootstrap";
import { getRestaurants } from "../services/api";

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const {
    data: restaurants,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["resturants"],
    queryFn: getRestaurants,
  });

  //TODO: Better loading state
  if (isPending) return <p>Loading...</p>;

  if (isError) {
    return <p>An error has occurred: " + {error.message}</p>;
  }

  if (restaurants === undefined) return <p>No restaurants found!</p>;

  return (
    <Container>
      <h2>Restaurants</h2>
      <ListGroup>
        {/* TODO: Add a loading state  */}
        {restaurants.map((restaurant) => (
          <ListGroup.Item
            key={restaurant.id}
            action
            onClick={() => onRestaurantSelect(restaurant.id)}
          >
            <h5>{restaurant.name}</h5>
            <p>{restaurant.shortDescription}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RestaurantList;
