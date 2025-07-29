import React from "react";
import { useState } from "react";
import Summarizer from "./Summarizer";
import {useNavigate} from "react-router-dom";
import { supabase } from './supabaseClient';

function SignIn() {

    const [emailForm, setEmailForm] = useState('');
    const [usernameForm, setUsernameForm] = useState('');
    const [passwordForm, setPasswordForm] = useState('');
    const [confirmPasswordForm, setConfirmPasswordForm] = useState('');
    
    const navigate = useNavigate();

    const checkEqualPassword = async () => {
        if(passwordForm === confirmPasswordForm && 
            emailForm !== '' && usernameForm !== '' &&
            passwordForm !== ''){
                
            const { success } = await signUp(emailForm, passwordForm);
            if(success){
                navigate("/summarizer");
            }
            
        } else if(emailForm === '' || usernameForm === '' || passwordForm === ''){
            alert("You have not entered all the element required")
        } else {
            alert("You used different password");
        }
    };

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert(error.message);
            return { success: false };
        }

        const user = data.user;

        const { error: insertError } = await supabase
            .from("users")
            .insert([
            {
                id: user.id,
                email: email,
                username: usernameForm,
                password: password,
            },
            ]);

        return { success: true };
    };

    const handleLogin = () => {
        navigate("/login");
    }

    return (
        <div className="h-screen flex flex-col ">

            <header className="text-center text-white2 font-bold text-4xl py-6">
                Paperbridge
            </header>

            <main className="flex-1 flex justify-center items-center ">
                <div className="form" style={{ transform: "translateY(-5%)" }} >
                    <p className="mb-10 font-bold text-lgred text-[28px]">Welcome!</p>


                    <label className="w-full text-left mb-2 text-xl ">e-mail:</label>
                    <input
                        type="text"
                        placeholder="Enter your e-mail..."
                        value={emailForm}
                        onChange={(e) => setEmailForm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="w-full text-left mb-2 text-xl ">Username:</label>
                    <input
                        type="text"
                        placeholder="Enter the username..."
                        value={usernameForm}
                        onChange={(e) => setUsernameForm(e.target.value)}
                        className="mb-4 p-2 border border-gray-300 rounded w-full"
                    />

                    <label className="w-full text-left mb-2 text-xl">Password:</label>
                    <input
                        type="password"
                        placeholder="Enter the password..."
                        value={passwordForm}
                        onChange={(e) => setPasswordForm(e.target.value)}
                        className="mb-10 p-2 border border-gray-300 rounded w-full "
                    />

                    <label className="w-full text-left mb-2 text-xl">Confirm Password:</label>
                    <input
                        type="password"
                        placeholder="Enter the password again..."
                        value={confirmPasswordForm}
                        onChange={(e) => setConfirmPasswordForm(e.target.value)}
                        className="mb-10 p-2 border border-gray-300 rounded w-full "
                    />

                    <button 
                        className="btn max-w-xs text-xl mb-12 shadow-2xl"
                        onClick={checkEqualPassword} >
                        Register
                    </button>

                    <p className="text-lg mb-2">Or if you already have an account</p>
                    <button className="btn max-w-xs text-xl mb-2 bg-white shadow-2xl text-lgred hover:bg-[#dcd7d7]" onClick={handleLogin}>Login</button>
                </div>
            </main>
        </div>
    )
}

export default SignIn;