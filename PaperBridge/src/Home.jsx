import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/login");
    };

    const handleSignIn = () => {
        navigate("/register");
    }

    return(
        <div className="flex flex-col justify-center items-center m-60">
            <h1 className="text-white2 font-bold text-[50px] p-5">PaperBridge.ai</h1>
            <p className="text-lgred font-bold text-[30px] text-center mb-15">Boost your research productivity effortlessly!</p>
            <button className="btn mb-15" onClick={handleGetStarted}>Get Started</button>
            <button className="btn bg-white2 text-lgred hover:bg-[#dcd7d7]" onClick={handleSignIn}>Sign in</button>
        </div>
    )
}

export default Home