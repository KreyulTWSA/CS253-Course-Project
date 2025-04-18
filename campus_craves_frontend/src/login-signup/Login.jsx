import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../reduxfeatures/userSlice";
import "./Forms.css";
import Header from "../components/Header";

const Login = () => {
  const dispatch = useDispatch();
  const [data, setData] = useState({email:"", password:""})
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const forgotPasswordRedirect = () => {
    navigate("/forgot-password");
  };

  const handleLogin = async () => {
    dispatch(loginStart());
    try {
    const res = await axios.post('http://127.0.0.1:8000/users/login/', data);
    console.log('Login successful:', res.data);
    dispatch(loginSuccess(res.data)); 
    if(res.data?.user.role=='seller') {
        const sellerId = res.data?.user.id;
        navigate(`/seller/${sellerId}/ordersview`); 
    }
    else{ 
        navigate('/'); 
    }
    } catch (error) {
    console.error('Login failed:', error.response.data);
    setError(error.response.data.error || 'Login failed. Please try again.');
    dispatch(loginFailure(error.response.data.error));
    }
  };

  const handleChange=(e)=> {
    setData({...data, [e.target.name]:e.target.value});
  }

  return (
    <div className="login">
      <Header />
      <div className="login-form">
        <h2>{"Log in to Your Account"}</h2>

        <input type="email" placeholder="Email" name="email" value={data.email} onChange={handleChange} />
        <input type="password" placeholder="Password" name="password" value={data.password} onChange={handleChange} />

        {error && <p className="error-message">{error}</p>}
      
        <button
          className="forgot-password"
          onClick={forgotPasswordRedirect}
          style={{
            background: "none",
            border: "none",
            color: "skyblue",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "1rem",
          }}
        >
          Forgot your password?
        </button>

        <button className="login-button" onClick={handleLogin}>
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/sign-up" className="signup-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;