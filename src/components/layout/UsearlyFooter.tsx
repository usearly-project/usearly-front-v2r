import UsearlyDrawing from "@src/components/background/Usearly";
import Footer from "./Footer";
import "./UsearlyFooter.scss";

type UsearlyFooterProps = {
  animationDuration?: string | number;
};

const UsearlyFooter = ({ animationDuration = "25" }: UsearlyFooterProps) => (
  <div className="usearly-drawing-container">
    <UsearlyDrawing animationDuration={animationDuration} />
    <Footer />
  </div>
);

export default UsearlyFooter;
