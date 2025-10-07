import App from "./App"
import Error from "./pages/Error"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NewReservation from "./pages/NewReservation"
import ReservationCard from "./pages/ReservationCard"
import ReservationList from "./pages/ReservationList"


const routes = [
  { 
    path: "/", 
    element: <App />, 
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "new", element: <NewReservation /> },
      { path: "reservation/:id", element: <ReservationCard /> },
      { path: "reservations", element: <ReservationList /> },
    ]
  }
]

export default routes