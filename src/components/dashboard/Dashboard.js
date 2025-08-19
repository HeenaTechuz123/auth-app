import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.scss";
import bannerImg from "../../assets/images/bnnner-right.png";

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User"; // ✅ fetch stored name

  const [count, setCount] = useState(3);



  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("authToken"); // if you plan to use token later
    navigate("/");
  };

  function increament(){
    setCount(count +1);
  }

  function decrement(){
    if(count > 0){
       setCount(count - 1);
    }
   
  }

 

  return (
    // <div className="dashboard">
    //   <h1>Welcome, {userName}!</h1>
    //   <div>
    //     <button onClick={decrement}>-</button>
    //     <span>{count}</span>        
    //      <button onClick={increament}>+</button>
         
    //   </div>
     
    //   <button onClick={handleLogout} className="common-btn">
    //     Logout
    //   </button>
    // </div>
    <div className="main">
      {/* baaner section */}
      <section className="banner">
        <div className="container">
          <div className="banner__content">
            <h1>
              Get More Done with <span>whitepace</span>
            </h1>
            <p>
              Project management software that enables your teams to collaborate,
              plan, analyze and manage everyday tasks
            </p>
            <button className="common-btn">Try Whitepace free →</button>
          </div>

          <div className="banner__image">
            <img src={bannerImg} alt="Project management dashboard" />
          </div>
        </div>
      </section>
    </div>
  );
}
