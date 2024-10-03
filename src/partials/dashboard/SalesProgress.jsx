import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const SalesProgress = () => {
  return (
    <div>
      <CircularProgressbar value={30} text={`${30}%`} />;
    </div>
  );
};

export default SalesProgress;
