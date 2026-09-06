'use client';

import { useForm } from 'react-hook-form';

export default function AddStudentForm({ onStudentCreated }) {
    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
    });

    const onSubmit = async (data) => {
        try {
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.error?.fields) {
                    Object.entries(result.error.fields).forEach(
                        ([field, messages]) => {
                            form.setError(field, {
                                type: 'server',
                                message: messages[0],
                            });
                        }
                    );
                }

                return;
            }

            console.log('Student created:', result.data);

            alert('Student created successfully!');

            form.reset();

            if (onStudentCreated) {
                onStudentCreated(result.data);
            } 
        } catch (error) {
            console.error('Failed to create student:', error);

            alert('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="w-[30rem]">
            <h1 className="text-2xl font-bold mb-6">
                Student Registration
            </h1>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                {/* First Name */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="firstName">
                        First Name
                    </label>

                    <input
                        className="border border-gray-900 rounded-md px-2 py-2"
                        type="text"
                        id="firstName"
                        {...form.register('firstName', {
                            required: 'First name is required',
                            minLength: {
                                value: 2,
                                message: 'First name must be at least 2 characters',
                            },
                            maxLength: {
                                value: 50,
                                message: 'First name must be at most 50 characters',
                            },
                        })}
                    />

                    {form.formState.errors.firstName && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.firstName.message}
                        </p>
                    )}
                </div>

                {/* Last Name */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="lastName">
                        Last Name
                    </label>

                    <input
                        className="border border-gray-900 rounded-md px-2 py-2"
                        type="text"
                        id="lastName"
                        {...form.register('lastName', {
                            required: 'Last name is required',
                            minLength: {
                                value: 2,
                                message: 'Last name must be at least 2 characters',
                            },
                            maxLength: {
                                value: 50,
                                message: 'Last name must be at most 50 characters',
                            },
                        })}
                    />

                    {form.formState.errors.lastName && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.lastName.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        className="border border-gray-900 rounded-md px-2 py-2"
                        type="email"
                        id="email"
                        {...form.register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: 'Please enter a valid email address',
                            },
                        })}
                    />

                    {form.formState.errors.email && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.email.message}
                        </p>
                    )}
                </div>

                {/* Save button */}
                <button
                    disabled={
                        !form.formState.isValid ||
                        !form.formState.isDirty ||
                        form.formState.isSubmitting
                    }
                    type="submit"
                    className="bg-pink-600 text-white py-2 px-4 font-bold uppercase rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
}