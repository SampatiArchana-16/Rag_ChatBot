import { Link, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const token =
    localStorage.getItem("token");

  const username =
    localStorage.getItem("username");

  const logout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("username");

    navigate("/login");
  };

  return (

    <nav className="navbar">

      <h2>AI PDF RAG</h2>

      <div className="nav-links">

        <Link to="/">
          Home
        </Link>

        {

          token ? (

            <>

              <Link to="/chat">
                Chat
              </Link>

              <span>
                👤 {username}
              </span>

              <button
                onClick={logout}
              >
                Logout
              </button>

            </>

          ) : (

            <>

              <Link to="/register">
                Register
              </Link>

              <Link to="/login">
                Login
              </Link>

            </>

          )

        }

      </div>

    </nav>

  );
}

export default Navbar;