import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState(1);
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const navigate = useNavigate();

  // 🔥 Generate CAPTCHA
  const generateCaptcha = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let captcha = "";

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captcha += characters[randomIndex];
    }

    setGeneratedCaptcha(captcha);
  };

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      alert("Enter valid email");
      return;
    }

    if (step === 1) {
      generateCaptcha();
      setStep(2);
      return;
    }

    // 🔥 CAPTCHA CHECK
    if (captchaInput.toUpperCase() !== generatedCaptcha) {
      alert("Invalid CAPTCHA ❌");
      generateCaptcha();
      setCaptchaInput("");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
  email: email.trim(),
  password: password.trim(),
});

      localStorage.setItem("token", res.data.token);
localStorage.setItem("email", email);

// 🔥 IMPORTANT FIX (force App.tsx to update)
window.dispatchEvent(new Event("storage"));

alert("Login successful ✅");

// small delay ensures state update
setTimeout(() => {
  navigate("/dashboard");
}, 100);

    } catch (err: any) {
  console.error(err.response?.data);

  alert(err.response?.data?.message || "Login failed ❌");
}
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">

        <h2 className="text-2xl font-bold text-center mb-6">Welcome Back</h2>

        <input
          className="w-full p-2 mb-4 border rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full p-2 border rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            👁️
          </span>
        </div>

        {/* CAPTCHA */}
        {step === 2 && (
          <div className="mb-4">
            <p className="mb-2 font-semibold">Captcha: {generatedCaptcha}</p>

            <input
              className="w-full p-2 border rounded mb-2"
              placeholder="Enter CAPTCHA"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
            />

            <button
              className="text-sm text-blue-500"
              onClick={generateCaptcha}
            >
              Refresh Captcha
            </button>
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {step === 1 ? "Next" : "Login"}
        </button>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}