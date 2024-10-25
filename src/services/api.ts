// TODO: Potentially move types to separate file but colocation is fine currently
type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
};

type RestaurantDetailsData = {
  id: string;
  name: string;
  shortDescription: string;
  cuisine: string;
  rating: number;
  details: {
    id: number;
    address: string;
    openingHours: {
      weekday: string;
      weekend: string;
    };
    reviewScore: number;
    contactEmail: string;
  };
};

export const getRestaurants = async (searchQuery = "") => {
  const response = await fetch("http://localhost:3001/restaurants");
  const restaurants = (await response.json()) as Restaurant[];

  // If searchQuery is empty, return all restaurants
  if (!searchQuery) {
    return restaurants;
  }

  // Case-insensitive filtering by restaurant name
  return restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

export const getRestaurantDetails = async (id: number) => {
  const response = await fetch(`http://localhost:3001/restaurants/${id}`);
  return response.json() as unknown as RestaurantDetailsData;
};
