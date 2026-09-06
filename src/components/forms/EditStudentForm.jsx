'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function EditStudentForm({
    student,
    onStudentUpdated,
    onCancel,
}) {
    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
    });

    useEffect(() => {
        if (student) {
            form.reset({
                firstName: student.firstName,
                lastName: student.lastName,
                email: student.email,
            });
        }
    }, [student, form]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`/api/students/${student.id}`, {
                method: 'PUT',
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
                } else {
                    alert(
                        result.error?.message ||
                        'Failed to update student'
                    );
                }

                return;
            }

            alert('Student updated successfully!');

            if (onStudentUpdated) {
                onStudentUpdated(result.data);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong while updating the student.');
        }
    };

    return (
        <div className="w-full max-w-2xl mb-8">
            <h2 className="text-2xl font-bold mb-4">
                Edit Student
            </h2>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                {/* First Name */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="edit-firstName">
                        First Name
                    </label>

                    <input
                        id="edit-firstName"
                        type="text"
                        className="border border-gray-900 rounded-md px-2 py-2"
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
                    <label htmlFor="edit-lastName">
                        Last Name
                    </label>

                    <input
                        id="edit-lastName"
                        type="text"
                        className="border border-gray-900 rounded-md px-2 py-2"
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
                    <label htmlFor="edit-email">
                        Email
                    </label>

                    <input
                        id="edit-email"
                        type="email"
                        className="border border-gray-900 rounded-md px-2 py-2"
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

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={
                            !form.formState.isValid ||
                            form.formState.isSubmitting
                        }
                        className="bg-blue-600 text-white py-2 px-5 font-bold rounded-md disabled:bg-gray-500"
                    >
                        {form.formState.isSubmitting
                            ? 'Updating...'
                            : 'Update'}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 text-white py-2 px-5 font-bold rounded-md"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}