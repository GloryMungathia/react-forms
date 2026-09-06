'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export default function EditCourseForm({
    course,
    onCourseUpdated,
    onCancel,
}) {
    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            code: '',
            title: '',
            instructor: '',
            credits: '',
        },
    });

    useEffect(() => {
        if (course) {
            form.reset({
                code: course.code,
                title: course.title,
                instructor: course.instructor,
                credits: course.credits,
            });
        }
    }, [course, form]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(
                `/api/courses/${course.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...data,
                        credits: Number(data.credits),
                    }),
                }
            );

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
                        'Failed to update course'
                    );
                }

                return;
            }

            alert('Course updated successfully!');

            if (onCourseUpdated) {
                onCourseUpdated(result.data);
            }
        } catch (error) {
            console.error(error);
            alert(
                'Something went wrong while updating the course.'
            );
        }
    };

    return (
        <div className="w-full max-w-2xl mb-8">
            <h2 className="text-2xl font-bold mb-6">
                Edit Course
            </h2>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-4"
            >
                {/* Course Code */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="edit-code">
                        Course Code
                    </label>

                    <input
                        id="edit-code"
                        type="text"
                        className="border border-gray-900 rounded-md px-2 py-2"
                        {...form.register('code', {
                            required: 'Course code is required',
                            pattern: {
                                value: /^[A-Za-z]{2,6}[0-9]{2,4}$/,
                                message:
                                    'Course code must contain 2–6 letters followed by 2–4 numbers',
                            },
                        })}
                    />

                    {form.formState.errors.code && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.code.message}
                        </p>
                    )}
                </div>

                {/* Title */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="edit-title">
                        Course Title
                    </label>

                    <input
                        id="edit-title"
                        type="text"
                        className="border border-gray-900 rounded-md px-2 py-2"
                        {...form.register('title', {
                            required: 'Course title is required',
                            minLength: {
                                value: 3,
                                message:
                                    'Course title must be at least 3 characters',
                            },
                            maxLength: {
                                value: 100,
                                message:
                                    'Course title must be at most 100 characters',
                            },
                        })}
                    />

                    {form.formState.errors.title && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                {/* Instructor */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="edit-instructor">
                        Instructor
                    </label>

                    <input
                        id="edit-instructor"
                        type="text"
                        className="border border-gray-900 rounded-md px-2 py-2"
                        {...form.register('instructor', {
                            required: 'Instructor is required',
                            minLength: {
                                value: 2,
                                message:
                                    'Instructor must be at least 2 characters',
                            },
                            maxLength: {
                                value: 60,
                                message:
                                    'Instructor must be at most 60 characters',
                            },
                        })}
                    />

                    {form.formState.errors.instructor && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.instructor.message}
                        </p>
                    )}
                </div>

                {/* Credits */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="edit-credits">
                        Credits
                    </label>

                    <input
                        id="edit-credits"
                        type="number"
                        min="1"
                        max="6"
                        className="border border-gray-900 rounded-md px-2 py-2"
                        {...form.register('credits', {
                            required: 'Credits are required',
                            valueAsNumber: true,
                            min: {
                                value: 1,
                                message: 'Credits must be at least 1',
                            },
                            max: {
                                value: 6,
                                message: 'Credits cannot be more than 6',
                            },
                            validate: (value) =>
                                Number.isInteger(value) ||
                                'Credits must be a whole number',
                        })}
                    />

                    {form.formState.errors.credits && (
                        <p className="text-red-600 text-sm">
                            {form.formState.errors.credits.message}
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
                            : 'Update Course'}
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