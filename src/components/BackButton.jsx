import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="inline-flex items-center gap-2 rounded-full 
                 border border-accent/70 bg-white/70 px-4 py-2 
                 text-sm font-semibold text-secondary 
                 transition hover:bg-accent/40"
    >
      <FiArrowLeft />
      {label}
    </button>
  );
};

export default BackButton;
