import { Link } from "react-router-dom"

function MovieDetail() {
  return (
    <>
    <h1>Movie Detail</h1>
    
    <h1><Link to={`/`}>Go to Main page</Link></h1>
    </>
  )
}

export default MovieDetail