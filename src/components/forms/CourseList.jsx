'use client';

import { useEffect, useState } from 'react';

export default function CourseList({ refreshKey, onEdit }) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch('/api/courses');
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error?.message || 'Failed to load courses.'
                    );
                }

                setCourses(result.data || []);
            } catch (err) {
                console.error('Failed to load courses:', err);
                setError('Unable to load courses. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [refreshKey]);

    const deleteCourse = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this course?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/courses/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok) {
                alert(
                    result.error?.message ||
                    'Unable to delete course. Please try again.'
                );
                return;
            }

            setCourses((currentCourses) =>
                currentCourses.filter((course) => course.id !== id)
            );
        } catch (err) {
            console.error('Failed to delete course:', err);
            alert('Something went wrong. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Loading courses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <p className="text-sm font-medium text-red-700">
                    {error}
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-5">
                <h3 className="text-xl font-bold text-slate-900">
                    Course Records
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    {courses.length}{' '}
                    {courses.length === 1 ? 'course' : 'courses'} available
                </p>
            </div>

            {/* Empty State */}
            {courses.length === 0 ? (
                <div className="px-6 py-10 text-center">
                    <p className="text-sm text-slate-500">
                        No courses have been added yet.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-200">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="px-6 py-5"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                {/* Course Information */}
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-sm font-bold text-indigo-700">
                                            {course.code}
                                        </span>

                                        <h4 className="text-base font-semibold text-slate-900">
                                            {course.title}
                                        </h4>
                                    </div>

                                    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
                                        <span>
                                            Instructor: {course.instructor}
                                        </span>

                                        <span>
                                            Credits: {course.credits}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex shrink-0 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(course)}
                                        className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteCourse(course.id)}
                                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}