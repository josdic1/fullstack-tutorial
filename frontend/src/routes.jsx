import App from "./App"
import Error from "./pages/Error"
import Home from "./pages/Home"
import Login from "./pages/Login"
import NewReservation from "./pages/NewReservation"


const routes = [
  { 
    path: "/", 
    element: <App />, 
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "new", element: <NewReservation /> },
    ]
  }
]

export default routes