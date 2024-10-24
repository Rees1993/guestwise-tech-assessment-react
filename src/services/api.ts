// TODO: Potentially move types to separate file but colocation is fine currently
type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
};

type RestaurantDetailsData = {
  address: string;
  openingHours: {
    weekday: string;
    weekend: string;
  };
  reviewScore: number;
  contactEmail: string;
};

export const getRestaurants = async () => {
  const response = await fetch("http://localhost:3001/restaurants");
  return response.json() as unknown as Restaurant[];
};

export const getRestaurantDetails = async (id: number) => {
  const response = await fetch(`http://localhost:3001/restaurants/${id}`);
  return response.json() as unknown as RestaurantDetailsData;
};
