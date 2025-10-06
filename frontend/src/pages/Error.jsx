import { useRouteError, Link } from 'react-router-dom'

function Error() {
  const error = useRouteError()
  console.error(error)

  return (
    <>
    <header></header>
    <main>
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>                                                          
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/">Back to home</Link>
    </div>
    </main>
    </>
  )
}

export default Error