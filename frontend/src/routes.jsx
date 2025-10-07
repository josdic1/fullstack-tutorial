import App from "./App"
import Error from "./pages/Error"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NewReservation from "./pages/NewReservation"
import EditReservation from "./pages/EditReservation"
import ReservationsItem from "./pages/ReservationsItem"
import ReservationsPage from "./pages/ReservationsPage"

const routes = [
  { 
    path: "/", 
    element: <App />, 
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "reservations/new", element: <NewReservation /> },
      { path: "reservations/:id/edit", element: <EditReservation /> },
      { path: "reservations/:id", element: <ReservationsItem /> },
      { path: "reservations", element: <ReservationsPage /> }
    ]
  }
]

export default routes