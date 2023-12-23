import { ToastContainer, toast } from "react-toastify";

const Home = ({ username }) => {
  return (
    <>
      <div className="home_page">
        <h4>
          Welcome <span>{username}</span>
        </h4>
        <div className="w-10 h-10 rounded bg-primary"></div>
        <div className="w-10 h-10 rounded bg-secondary"></div>
        <div className="w-10 h-10 rounded bg-accent"></div>
        <div className="w-10 h-10 rounded bg-neutral"></div>
        <div className="w-10 h-10 rounded bg-base-100"></div>
        <div className="w-10 h-10 rounded bg-info"></div>
        <div className="w-10 h-10 rounded bg-success"></div>
        <div className="w-10 h-10 rounded bg-warning"></div>
        <div className="w-10 h-10 rounded bg-error"></div>
      </div>
      {/* <ToastContainer /> */}
    </>
  );
};

export default Home;
