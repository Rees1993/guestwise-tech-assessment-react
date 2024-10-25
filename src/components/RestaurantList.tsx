import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { ListGroup, Container, Form, Button } from "react-bootstrap";
import { getRestaurants } from "../services/api";
import useDebounce from "../hooks/useDebounce";

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  // TODO: Look at moving all state to URL
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const debouncedValue = useDebounce(search, 300);

  const {
    data: restaurants,
    isPending,
    isError,
    error,
  } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: ["resturants", debouncedValue],
    queryFn: () => getRestaurants(debouncedValue),
  });

  //TODO: Better loading state
  if (isPending) return <p>Loading...</p>;

  if (isError) {
    return <p>An error has occurred: " + {error.message}</p>;
  }

  if (restaurants === undefined) return <p>No restaurants found!</p>;

  const sortedRestaurants = restaurants.sort((a, b) => {
    // Ensures Resturant 3 will come before Restuarant 10
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      });
    }

    return b.name.localeCompare(a.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return (
    <Container>
      <h2>Restaurants</h2>
      <Form.Group className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search restaurants"
          onChange={(e) => setSearch(e.target.value)} // Update search query on input change
        />
      </Form.Group>
      <Button
        onClick={() =>
          setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
        }
      >
        Sort Alphabetically {sortOrder === "asc" ? "Descending" : "Ascending"}
      </Button>
      <ListGroup>
        {/* TODO: Add a loading state  */}
        {sortedRestaurants.map((restaurant) => (
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
