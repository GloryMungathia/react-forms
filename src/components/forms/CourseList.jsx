'use client';

import { useEffect, useState } from 'react';

export default function CourseList({
    refreshKey,
    onEdit,
}) {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getCourses = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/courses');
            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error?.message ||
                    'Failed to load courses'
                );
                return;
            }

            setCourses(result.data || []);
        } catch (error) {
            console.error(error);
            setError('Something went wrong while loading courses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCourses();
    }, [refreshKey]);

    const deleteCourse = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this course?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/courses/${id}`,
                {
                    method: 'DELETE',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(
                    result.error?.message ||
                    'Failed to delete course'
                );
                return;
            }

            setCourses((currentCourses) =>
                currentCourses.filter(
                    (course) => course.id !== id
                )
            );
        } catch (error) {
            console.error(error);
            alert(
                'Something went wrong while deleting the course.'
            );
        }
    };

    if (loading) {
        return <p>Loading courses...</p>;
    }

    if (error) {
        return (
            <p className="text-red-600">
                {error}
            </p>
        );
    }

    return (
        <div className="w-full max-w-2xl mt-10">
            <h2 className="text-2xl font-bold mb-4">
                Courses
            </h2>

            {courses.length === 0 ? (
                <p>No courses found.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="border border-gray-300 rounded-md p-4 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-bold">
                                    {course.code} - {course.title}
                                </p>

                                <p className="text-gray-600">
                                    Instructor: {course.instructor}
                                </p>

                                <p className="text-gray-600">
                                    Credits: {course.credits}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(course)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        deleteCourse(course.id)
                                    }
                                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}