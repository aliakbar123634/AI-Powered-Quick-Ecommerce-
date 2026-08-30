// import { loginUser } from "../api/authApi";
// import { useNavigate } from "react-router-dom";
// import useAuthStore from "../store/authStore";
// import AuthLayout from "../components/auth/AuthLayout";
// import AuthCard from "../components/auth/AuthCard";
// import PrimaryButton from "../components/PrimaryButton";
// import Input from "../components/Input";
// import PasswordInput from "../components/PasswordInput";
// import { Link } from "react-router-dom";
// import { useState } from "react";
// const Login = () => {
//   const login = useAuthStore((state) => state.login);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
// });

// const validateForm = () => {

//     let newErrors = {};

//     if (!formData.email.trim()) {
//         newErrors.email = "Email is required.";
//     }
//     else if (
//         !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
//     ) {
//         newErrors.email = "Enter a valid email.";
//     }

//     if (!formData.password.trim()) {
//         newErrors.password = "Password is required.";
//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;
// }
//   const [loading, setLoading] = useState(false);

//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();
//   const [rememberMe, setRememberMe] = useState(false);

// const handleChange = (e) => {

//     const { name, value } = e.target;

//     setFormData((prev) => ({

//         ...prev,

//         [name]: value,

//     }));

//     setErrors((prev) => ({

//         ...prev,

//         [name]: "",

//     }));

// };
//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     setMessage("");
//     if (!validateForm()) {

//     return;

//    }

//     try {

//         setLoading(true);

// const response = await loginUser(formData);
// console.log(response.data);

// login(

//     response.data.access,

//     response.data.refresh

// );
// localStorage.setItem("access", response.data.access);
// localStorage.setItem("refresh", response.data.refresh);

//         navigate("/");

//     }

//     catch (error) {

//         console.log(error);

//         if (error.response?.data) {

//             const errors = error.response.data;

//             if (errors.error) {

//                 setMessage(errors.error);

//             }

//             else if (errors.detail) {

//                 setMessage(errors.detail);

//             }

//             else {

//                 setMessage("Login failed.");

//             }

//         }

//         else {

//             setMessage("Something went wrong.");

//         }

//     }

//     finally {

//         setLoading(false);

//     }

// };
//     return (
        
//         <AuthLayout>

//             <AuthCard

//                 title="Welcome Back"

//                 subtitle="Login to continue shopping."

//             >

//                 {/* Login Form */}

//             <form onSubmit={handleSubmit}>

//     {
//         message && (

//             <div
//                 className={`mb-5 px-4 py-3 rounded-xl

//                 ${
//                     message.includes("success")
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                 }`}
//             >

//                 {message}

//             </div>

//         )
//     }

//     {/* <Input

//         label="Email"

//         name="email"

//         type="email"

//         placeholder="Enter your email"

//         value={formData.email}

//         onChange={handleChange}

//     /> */}
//     <Input

//     label="Email"

//     name="email"

//     type="email"

//     placeholder="Enter your email"

//     value={formData.email}

//     onChange={handleChange}

//     error={errors.email}

// />

//     {/* <PasswordInput

//         label="Password"

//         name="password"

//         placeholder="Enter your password"

//         value={formData.password}

//         onChange={handleChange}

//     /> */}

//     <PasswordInput

//     label="Password"

//     name="password"

//     placeholder="Enter your password"

//     value={formData.password}

//     onChange={handleChange}

//     error={errors.password}

// />

//     <div className="flex items-center justify-between mb-6">

//         <label className="flex items-center gap-2">

//             <input

//                 type="checkbox"

//                 checked={rememberMe}

//                 onChange={(e) =>
//                     setRememberMe(e.target.checked)
//                 }

//                 className="accent-green-600"

//             />

//             Remember Me

//         </label>

//         <Link
//            to="/forgot-password"
//            className="text-green-600 hover:underline"
//         >
//             Forgot Password?
//         </Link>

//         {/* <button

//             type="button"

//             className="text-green-600 hover:underline"

//         >

//             Forgot Password?

//         </button> */}

//     </div>

//     <PrimaryButton

//         type="submit"

//         loading={loading}

//     >

//         {

//             loading

//                 ? "Logging In..."

//                 : "Login"

//         }

//     </PrimaryButton>

// </form>  
// <div className="mt-6 text-center">

//     <p className="text-gray-500">

//         Don't have an account?

//         <button

//             onClick={() => navigate("/register")}

//             className="text-green-600 font-semibold ml-2 hover:underline"

//         >

//             Register

//         </button>

//     </p>

// </div>

//             </AuthCard>

//         </AuthLayout>

//     );

// };

// export default Login;











import { loginUser } from "../api/authApi";

import { useNavigate, Link } from "react-router-dom";

import useAuthStore from "../store/authStore";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import PrimaryButton from "../components/PrimaryButton";
import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";

import { useState } from "react";


const Login = () => {

  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();


  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });


  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [rememberMe, setRememberMe] = useState(false);


  // ============================================================
  // VALIDATION
  // ============================================================

  const validateForm = () => {

    const newErrors = {};

    // Email
    if (!formData.email.trim()) {

      newErrors.email = "Email is required.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {

      newErrors.email = "Enter a valid email.";

    }


    // Password
    if (!formData.password.trim()) {

      newErrors.password = "Password is required.";

    }


    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));


    setMessage("");
  };


  // ============================================================
  // LOGIN
  // ============================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");


    // Validate
    if (!validateForm()) {
      return;
    }


    try {

      setLoading(true);


      // ========================================================
      // LOGIN API
      // ========================================================

      const response = await loginUser(formData);

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );


      const {
        access,
        refresh,
        user,
      } = response.data;


      // ========================================================
      // CHECK TOKENS
      // ========================================================

      if (!access || !refresh) {

        throw new Error(
          "Login response does not contain access/refresh tokens."
        );
      }


      // ========================================================
      // CHECK USER
      // ========================================================

      if (!user) {

        console.error(
          "Login response does not contain user data."
        );

        throw new Error(
          "User information was not returned by the server."
        );
      }


      console.log(
        "LOGGED IN USER:",
        user
      );

      console.log(
        "USER ROLE:",
        user.role
      );


      // ========================================================
      // SAVE AUTH DATA IN ZUSTAND
      // ========================================================

      login(
        access,
        refresh,
        user
      );


      // ========================================================
      // KEEP EXISTING LOCAL STORAGE TOKENS
      // ========================================================

      localStorage.setItem(
        "access",
        access
      );

      localStorage.setItem(
        "refresh",
        refresh
      );


      // ========================================================
      // REDIRECT
      // ========================================================

      if (user.role === "ADMIN") {

        navigate("/admin", {
          replace: true,
        });

      } else if (user.role === "RIDER") {

        navigate("/rider", {
          replace: true,
        });

      } else {

        navigate("/", {
          replace: true,
        });

      }

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );


      if (error.response?.data) {

        const apiErrors =
          error.response.data;


        if (apiErrors.error) {

          setMessage(
            apiErrors.error
          );

        } else if (apiErrors.detail) {

          setMessage(
            apiErrors.detail
          );

        } else if (apiErrors.message) {

          setMessage(
            apiErrors.message
          );

        } else {

          setMessage(
            "Login failed."
          );
        }

      } else if (error.message) {

        setMessage(
          error.message
        );

      } else {

        setMessage(
          "Something went wrong."
        );
      }

    } finally {

      setLoading(false);
    }
  };


  // ============================================================
  // UI
  // ============================================================

  return (

    <AuthLayout>

      <AuthCard
        title="Welcome Back"
        subtitle="Login to continue shopping."
      >

        {/* =====================================================
            ERROR MESSAGE
        ====================================================== */}

        {message && (

          <div
            className="
              mb-5
              px-4
              py-3
              rounded-xl
              bg-red-100
              text-red-700
            "
          >
            {message}
          </div>

        )}


        {/* =====================================================
            LOGIN FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>

          {/* Email */}

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />


          {/* Password */}

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />


          {/* Remember / Forgot */}

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <label
              className="
                flex
                items-center
                gap-2
                cursor-pointer
              "
            >

              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) =>
                  setRememberMe(
                    e.target.checked
                  )
                }
                className="accent-green-600"
              />

              Remember Me

            </label>


            <Link
              to="/forgot-password"
              className="
                text-green-600
                hover:underline
              "
            >
              Forgot Password?
            </Link>

          </div>


          {/* Login Button */}

          <PrimaryButton
            type="submit"
            loading={loading}
          >

            {loading
              ? "Logging In..."
              : "Login"
            }

          </PrimaryButton>

        </form>


        {/* =====================================================
            REGISTER
        ====================================================== */}

        <div className="mt-6 text-center">

          <p className="text-gray-500">

            Don't have an account?

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="
                text-green-600
                font-semibold
                ml-2
                hover:underline
              "
            >
              Register
            </button>

          </p>

        </div>

      </AuthCard>

    </AuthLayout>
  );
};


export default Login;