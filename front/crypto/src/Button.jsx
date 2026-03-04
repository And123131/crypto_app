import { useNavigate } from "react-router-dom"

function Button() {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/stock")
  }

  return (
    <button
      onClick={handleClick}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
    >
      START
    </button>
  )
}

export default Button