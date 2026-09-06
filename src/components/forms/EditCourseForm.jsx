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
                code: course.code || '',
                title: course.title || '',
                instructor: course.instructor || '',
                credits: course.credits ?? '',
            });
        }
    }, [course, form]);

    const onSubmit = async (data) => {
        try {
            const response = await fetch(`/api/courses/${course.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    credits: Number(data.credits),
                }),
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
                            'Unable to update course. Please try again.',
                    });
                }

                return;
            }

            alert('Course updated successfully!');

            if (onCourseUpdated) {
                onCourseUpdated(result.data);
            }
        } catch (error) {
            console.error('Failed to update course:', error);

            form.setError('root.serverError', {
                type: 'server',
                message: 'Something went wrong. Please try again.',
            });
        }
    };

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Accent */}
            <div className="h-1 bg-indigo-600" />

            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">
                            Edit Course
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Update the course information below.
                        </p>
                    </div>

                    <span className="hidden text-sm text-slate-400 sm:block">
                        ID: {course.id}
                    </span>
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="px-6 py-6 sm:px-8 sm:py-8"
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    {/* Course Code */}
                    <div>
                        <label
                            htmlFor="code"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Course Code
                        </label>

                        <input
                            type="text"
                            id="code"
                            placeholder="e.g. CS101"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
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
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.formState.errors.code.message}
                            </p>
                        )}
                    </div>

                    {/* Course Title */}
                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Course Title
                        </label>

                        <input
                            type="text"
                            id="title"
                            placeholder="e.g. Introduction to Computing"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
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
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.formState.errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* Instructor */}
                    <div>
                        <label
                            htmlFor="instructor"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Instructor
                        </label>

                        <input
                            type="text"
                            id="instructor"
                            placeholder="e.g. John Smith"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
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
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.formState.errors.instructor.message}
                            </p>
                        )}
                    </div>

                    {/* Credits */}
                    <div>
                        <label
                            htmlFor="credits"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Credits
                        </label>

                        <input
                            type="number"
                            id="credits"
                            min="1"
                            max="6"
                            placeholder="1–6"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
                            {...form.register('credits', {
                                required: 'Credits are required',
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: 'Credits must be between 1 and 6',
                                },
                                max: {
                                    value: 6,
                                    message: 'Credits must be between 1 and 6',
                                },
                                validate: (value) =>
                                    Number.isInteger(value) ||
                                    'Credits must be a whole number',
                            })}
                        />

                        {form.formState.errors.credits && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.formState.errors.credits.message}
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

                {/* Actions */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 bg-white px-6 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            !form.formState.isValid ||
                            !form.formState.isDirty ||
                            form.formState.isSubmitting
                        }
                        className="rounded-lg border border-indigo-600 bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:border-indigo-300 disabled:bg-indigo-300 disabled:text-white"
                    >
                        {form.formState.isSubmitting
                            ? 'Updating...'
                            : 'Update Course'}
                    </button>
                </div>
            </form>
        </div>
    );
}