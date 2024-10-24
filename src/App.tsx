import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./App.css";
import BookTable from "./components/BookTable";
import RestaurantDetails from "./components/RestaurantDetails";
import RestaurantList from "./components/RestaurantList";

const queryClient = new QueryClient();

function App() {
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    number | null
  >(null);

  return (
    <QueryClientProvider client={queryClient}>
      <Container>
        <Row>
          <Col md={4}>
            <RestaurantList onRestaurantSelect={setSelectedRestaurantId} />
          </Col>
          <Col md={8}>
            {selectedRestaurantId && (
              <>
                <RestaurantDetails restaurantId={selectedRestaurantId} />
                <BookTable />
              </>
            )}
          </Col>
        </Row>
      </Container>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
