import App from "./App"
import Error from "./pages/Error"
import Home from "./pages/Home"
import Login from "./pages/Login"


const routes = [
  { 
    path: "/", 
    element: <App />, 
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
    ]
  }
]

export default routes