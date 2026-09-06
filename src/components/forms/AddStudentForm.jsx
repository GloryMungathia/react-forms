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
                } else {
                    form.setError('root.serverError', {
                        type: 'server',
                        message:
                            result.error?.message ||
                            'Unable to create student. Please try again.',
                    });
                }

                return;
            }

            alert('Student created successfully!');

            form.reset();

            if (onStudentCreated) {
                onStudentCreated(result.data);
            }
        } catch (error) {
            console.error('Failed to create student:', error);

            form.setError('root.serverError', {
                type: 'server',
                message: 'Something went wrong. Please try again.',
            });
        }
    };

    const isSubmitting = form.formState.isSubmitting;

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Small top accent */}
            <div className="h-1 bg-blue-600" />

            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                <h3 className="text-xl font-bold text-slate-900">
                    Add Student
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Enter the student&apos;s information to create a new record.
                </p>
            </div>

            {/* Form */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-6 py-6 sm:px-8 sm:py-8"
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    {/* First Name */}
                    <div>
                        <label
                            htmlFor="firstName"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            First Name
                        </label>

                        <input
                            type="text"
                            id="firstName"
                            placeholder="Enter first name"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
                            {...form.register('firstName', {
                                required: 'First name is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'First name must be at least 2 characters',
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        'First name must be at most 50 characters',
                                },
                            })}
                        />

                        {form.formState.errors.firstName && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.formState.errors.firstName.message}
                            </p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label
                            htmlFor="lastName"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Last Name
                        </label>

                        <input
                            type="text"
                            id="lastName"
                            placeholder="Enter last name"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
                            {...form.register('lastName', {
                                required: 'Last name is required',
                                minLength: {
                                    value: 2,
                                    message:
                                        'Last name must be at least 2 characters',
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        'Last name must be at most 50 characters',
                                },
                            })}
                        />

                        {form.formState.errors.lastName && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.formState.errors.lastName.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Email Address
                        </label>

                        <input
                            type="email"
                            id="email"
                            placeholder="student@example.com"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
                            {...form.register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+\.\S+$/,
                                    message:
                                        'Please enter a valid email address',
                                },
                            })}
                        />

                        {form.formState.errors.email && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.formState.errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Server Error */}
                {form.formState.errors.root?.serverError && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm font-medium text-red-700">
                            {form.formState.errors.root.serverError.message}
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-5">
                    <p className="hidden text-sm text-slate-500 sm:block">
                        All fields are required.
                    </p>

                    <button
                        type="submit"
                        disabled={
                            !form.formState.isValid ||
                            !form.formState.isDirty ||
                            isSubmitting
                        }
                        className="
              rounded-lg
              border
              border-blue-600
              bg-blue-600
              px-6
              py-2.5
              font-semibold
              text-white
              hover:bg-blue-700
              disabled:border-blue-300
              disabled:bg-blue-300
              disabled:text-white
            "
                    >
                        {isSubmitting ? 'Saving...' : 'Save Student'}
                    </button>
                </div>
            </form>
        </div>
    );
}