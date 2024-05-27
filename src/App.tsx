import React, { useState } from "react";
import "./App.css";
import Logo from "/images/logo.png";
import toast, { Toaster } from "react-hot-toast";
import {validate} from 'email-validator'

type Props = {};

const App: React.FC<Props> = () => {
  const [email, setEmail] = useState<string>("");
  const subscribe = async () => {
    console.log(import.meta.env.VITE_AUTH_TOKEN)
    if (!email || !validate(email)) {
      toast.error("Invalid Email");
      return;
    }
    toast.promise(
      fetch("https://leetcode-potd-email-service.vercel.app/send", {
        method: "POST",
        body: JSON.stringify({ email, authToken:import.meta.env.VITE_AUTH_TOKEN }),
        headers: { "Content-Type": "application/json" },
      })
        .then(async (res) => {
          const response = await res.json();
          if (!res.ok) {
            toast.error(response.error);
            throw new Error(response.error);
          }
          return response;
        })
        .then((data) => console.log(data))
        .catch((err) => {
          console.log(err);
          throw err;
        }),
      {
        loading: "Subscribing",
        error: "Something Went Wrong",
        success: "Subscribed",
      }
    );
  };

  return (
    <>
      <Toaster position="top-center" />
      <main className="w-3/5 mx-auto flex flex-col gap-6 py-10">
        <div className="flex items-center justify-center gap-4">
          <img src={Logo} alt="logo" className="w-16 h-16" />
          <h1 className="text-4xl font-medium text-slate-100">
            Leetcode POTD Email Service
          </h1>
        </div>
        <p className="w-3/5 mx-auto text-center text-slate-300">
          Subscribe to our service to recieve details about Leetcode POTD
          Serviceat 8:00 AM daily
        </p>
        <input
          type="email"
          className="w-4/5 mx-auto bg-zinc-700 px-5 py-3 rounded-lg outline-none duration-300 border-2 border-neutral-800 focus:border-indigo-600 my-7"
          value={email}
          autoFocus
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email, e.g, john@gmail.com"
          onKeyUp={(e) => {
            if (e.key === "Enter") subscribe();
          }}
        />
        <button
          onClick={subscribe}
          className="bg-zinc-800 w-max mx-auto px-8 py-3 rounded-lg border-2 border-zinc-900 duration-300 hover:border-indigo-700 active:scale-90"
        >
          Subscribe
        </button>
      </main>
    </>
  );
};

export default App;
