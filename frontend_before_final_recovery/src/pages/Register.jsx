import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";

import Input from "../components/Input";
import PasswordInput from "../components/PasswordInput";
import PrimaryButton from "../components/PrimaryButton";

const Register = () => {

    const navigate = useNavigate();
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [formData, setFormData] = useState({

        name: "",

        email: "",

        phone_number: "",

        password: "",

        password2: "",

    });

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");



    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: value,

        }));

    };



    const handleSubmit = async (e) => {

        e.preventDefault();

        setMessage("");

        if (formData.password !== formData.password2) {

            setMessage("Passwords do not match.");

            return;

        }

        try {

            setLoading(true);

            const response = await registerUser(formData);

            setMessage("✅ Account created successfully. Redirecting...");

            setFormData({

                name: "",

                email: "",

                phone_number: "",

                password: "",

                password2: "",

            });

            setTimeout(() => {

                navigate("/login");

            }, 1500);

        }

        catch (error) {

            console.log(error);

            if (error.response?.data) {

                if (error.response?.data) {

    const errors = error.response.data;

    if (errors.email) {

        setMessage(errors.email[0]);

    }

    else if (errors.phone_number) {

        setMessage(errors.phone_number[0]);

    }

    else if (errors.password) {

        setMessage(errors.password[0]);

    }

    else if (errors.non_field_errors) {

        setMessage(errors.non_field_errors[0]);

    }

    else {

        setMessage("Registration failed.");

    }

}

            }

            else {

                setMessage("Registration failed.");

            }

        }

        finally {

            setLoading(false);

        }

    };



    return (

        <AuthLayout>

            <AuthCard

                title="Create Account"

                subtitle="Create your QuickAI account."

            >

                {/* {

                    message && (

                        <div className="mb-5 rounded-xl bg-red-100 text-red-700 px-4 py-3">

                            {message}

                        </div>

                    )

                } */}

                {
    message && (

        <div
            className={`mb-5 px-4 py-3 rounded-xl

            ${
                message.includes("✅")

                    ? "bg-green-100 text-green-700"

                    : "bg-red-100 text-red-700"

            }`}
        >

            {message}

        </div>

    )
}

                <form onSubmit={handleSubmit}>

                    <Input

                        label="Full Name"

                        name="name"

                        placeholder="Enter your full name"

                        value={formData.name}

                        onChange={handleChange}

                    />

                    <Input

                        label="Email"

                        name="email"

                        type="email"

                        placeholder="Enter your email"

                        value={formData.email}

                        onChange={handleChange}

                    />

                    <Input

                        label="Phone Number"

                        name="phone_number"

                        placeholder="Enter your phone number"

                        value={formData.phone_number}

                        onChange={handleChange}

                    />

                    <PasswordInput

                        label="Password"

                        name="password"

                        placeholder="Enter your password"

                        value={formData.password}

                        onChange={handleChange}

                    />

                    <PasswordInput

                        label="Confirm Password"

                        name="password2"

                        placeholder="Confirm your password"

                        value={formData.password2}

                        onChange={handleChange}

                    />

                    <div className="flex items-center gap-3 mb-6">

                  <input

                  type="checkbox"

                  checked={acceptTerms}

                  onChange={(e) => setAcceptTerms(e.target.checked)}

                  className="w-5 h-5 accent-green-600"

                />

                <p className="text-sm text-gray-600">
 
                   I agree to the

                <span className="text-green-600 font-semibold cursor-pointer">

                  {" "}Terms & Conditions

                </span>

                </p>

              </div>

                    <PrimaryButton

                        type="submit"

                        loading={loading}

                    >

                        {

                            loading

                                ? "Registering..."

                                : "Register"

                        }

                    </PrimaryButton>
                    <div className="mt-6 text-center">

                      <p className="text-gray-500">

                        Already have an account?

                      <Link

                        to="/login"

                        className="text-green-600 font-semibold ml-2 hover:underline" >Login</Link>

                      </p>

                    </div>

                </form>

            </AuthCard>

        </AuthLayout>

    );

};

export default Register;