import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthCard from "../components/auth/AuthCard";
import PasswordInput from "../components/PasswordInput";
import PrimaryButton from "../components/PrimaryButton";
import { resetPassword } from "../api/authApi";

export default function ResetPassword() {

    const navigate = useNavigate();

    const { uid, token } = useParams();

    const [formData, setFormData] = useState({
        password: "",
        password2: "",
    });

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrors({});

        if (!formData.password) {
            setErrors({
                password: "Password is required",
            });
            return;
        }

        if (formData.password !== formData.password2) {
            setErrors({
                password2: "Passwords do not match",
            });
            return;
        }

        try {

            setLoading(true);

            const response = await resetPassword(
                uid,
                token,
                formData
            );

            alert(response.data.message);

            navigate("/login");

        } catch (error) {

            if (error.response) {

                if (error.response.data.error) {

                    alert(error.response.data.error);

                } else {

                    setErrors(error.response.data);

                }

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <AuthCard
                title="Reset Password"
                subtitle="Enter your new password"
            >

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <PasswordInput
                        name="password"
                        label="New Password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <PasswordInput
                        name="password2"
                        label="Confirm Password"
                        value={formData.password2}
                        onChange={handleChange}
                        error={errors.password2}
                    />

                    <PrimaryButton
                        type="submit"
                        loading={loading}
                    >
                        Reset Password
                    </PrimaryButton>

                </form>

            </AuthCard>

        </AuthLayout>

    );

}