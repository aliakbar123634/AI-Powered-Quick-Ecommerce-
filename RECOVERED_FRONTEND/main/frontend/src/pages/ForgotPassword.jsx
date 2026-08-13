import { useState } from "react";
import { Link } from "react-router-dom";

// import AuthLayout from "../../components/auth/AuthLayout";
// import AuthCard from "../../components/auth/AuthCard";
// import Input from "../../components/auth/Input";
// import PrimaryButton from "../../components/auth/PrimaryButton";

// import { forgotPassword } from "../../api/auth";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import PasswordInput from "../components/PasswordInput";
import PrimaryButton from "../components/PrimaryButton";
import Input from "../components/Input";
import { forgotPassword } from "../api/authApi";

export default function ForgotPassword() {

    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});

        if (!email.trim()) {

            setErrors({
                email: "Email is required",
            });

            return;

        }

        try {

            setLoading(true);

            const response = await forgotPassword({
                email,
            });

            alert(response.data.message);

        } catch (error) {

            if (error.response?.data) {

                setErrors(error.response.data);

            } else {

                alert("Something went wrong.");

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <AuthCard
                title="Forgot Password"
                subtitle="Enter your email to receive a password reset link."
            >

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <Input
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                    />

                    <PrimaryButton
                        type="submit"
                        loading={loading}
                    >
                        Send Reset Link
                    </PrimaryButton>

                </form>

                <div className="mt-5 text-center">

                    <Link
                        to="/login"
                        className="text-green-600 hover:underline"
                    >
                        Back to Login
                    </Link>

                </div>

            </AuthCard>

        </AuthLayout>

    );

}