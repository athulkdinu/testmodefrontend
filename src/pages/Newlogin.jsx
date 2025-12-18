import React, { useState } from "react";
import { SiJsonwebtokens } from "react-icons/si";

function Newlogin() {
  const [isLogin, setIsLogin] = useState(true);

  // Login states
  const [loginRole, setLoginRole] = useState("patient");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  // Register states
  const [regRole, setRegRole] = useState("patient");
  const [regUser, setRegUser] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPass, setRegPass] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
const savedUser = JSON.parse(localStorage.getItem("user"));

    if (
      savedUser &&
      savedUser.username === loginUser &&
      savedUser.password === loginPass &&
      savedUser.role === loginRole
    ) {
      alert("Login Successful!");
    } else {
      alert("Invalid Credentials!");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newUser = {
      role: regRole,
      username: regUser,
      email: regEmail,
      password: regPass,

    }

    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Registration Successful!");
    setIsLogin(true)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">

        {/* Title */}
        <h2 className="text-center text-2xl font-bold mb-4">
          {isLogin ? "LOGIN" : "REGISTER"}
        </h2>

        {/* ---------------- LOGIN FORM ---------------- */}
        {isLogin && (

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="block mb-1">Select Role</label>
              <select
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value)}
                className="border p-2 w-full rounded"
              >
                <option value="admin">ADMIN</option>
                <option value="doctor">DOCTOR</option>
                <option value="patient">PATIENT</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="enter username"
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="mb-4">
              <label>Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="enter password"
                className="border p-2 w-full rounded"
              />
            </div>

            <button className="bg-blue-600 text-white w-full py-2 rounded">
              LOGIN
            </button>

            <p className="text-center mt-3 text-sm">
              Don't have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Register
              </span>
            </p>
          </form>
        )}

        {/* ---------------- REGISTER FORM ---------------- */}
        {!isLogin && (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label>Select Role</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="border p-2 w-full rounded"
              >
                <option value="admin">ADMIN</option>
                <option value="doctor">DOCTOR</option>
                <option value="patient">PATIENT</option>
              </select>
            </div>

            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="enter email"
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="mb-3">
              <label>Username</label>
              <input
                type="text"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
                placeholder="enter username"
                className="border p-2 w-full rounded"
              />
            </div>

            <div className="mb-4">
              <label>Password</label>
              <input
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                placeholder="enter password"
                className="border p-2 w-full rounded"
              />
            </div>

            <button className="bg-blue-600 text-white w-full py-2 rounded">
              REGISTER
            </button>

            <p className="text-center mt-3 text-sm">
              Already have an account?{" "}
              <span
                className="text-blue-600 cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Login
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default Newlogin;
