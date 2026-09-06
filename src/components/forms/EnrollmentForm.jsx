'use client';

import { useEffect, useState } from 'react';

export default function EnrollmentForm() {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const [selectedStudent, setSelectedStudent] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');

    const [enrolledCourses, setEnrolledCourses] = useState([]);

    const [loading, setLoading] = useState(true);
    const [loadingEnrollment, setLoadingEnrollment] = useState(false);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');

            const [studentsResponse, coursesResponse] =
                await Promise.all([
                    fetch('/api/students'),
                    fetch('/api/courses'),
                ]);

            const studentsResult = await studentsResponse.json();
            const coursesResult = await coursesResponse.json();

            if (!studentsResponse.ok) {
                throw new Error(
                    studentsResult.error?.message ||
                    'Failed to load students.'
                );
            }

            if (!coursesResponse.ok) {
                throw new Error(
                    coursesResult.error?.message ||
                    'Failed to load courses.'
                );
            }

            setStudents(studentsResult.data || []);
            setCourses(coursesResult.data || []);
        } catch (err) {
            console.error('Failed to load enrollment data:', err);
            setError('Unable to load enrollment data.');
        } finally {
            setLoading(false);
        }
    };

    const loadStudentCourses = async (studentId) => {
        if (!studentId) {
            setEnrolledCourses([]);
            setSelectedCourse('');
            return;
        }

        try {
            setLoadingEnrollment(true);
            setError('');
            setMessage('');

            const response = await fetch(
                `/api/students/${studentId}/courses`
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error?.message ||
                    'Failed to load enrolled courses.'
                );
            }

            setEnrolledCourses(result.data || []);
        } catch (err) {
            console.error('Failed to load student courses:', err);
            setError('Unable to load this student\'s courses.');
            setEnrolledCourses([]);
        } finally {
            setLoadingEnrollment(false);
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            await loadData();
        };

        fetchInitialData();
    }, []);
    
    const handleStudentChange = async (event) => {
        const studentId = event.target.value;

        setSelectedStudent(studentId);
        setSelectedCourse('');
        setMessage('');
        setError('');

        await loadStudentCourses(studentId);
    };

    const handleEnroll = async (event) => {
        event.preventDefault();

        if (!selectedStudent || !selectedCourse) {
            return;
        }

        try {
            setLoadingEnrollment(true);
            setMessage('');
            setError('');

            const response = await fetch(
                `/api/students/${selectedStudent}/courses`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        courseId: Number(selectedCourse),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error?.message ||
                    'Unable to enroll student in this course.'
                );
                return;
            }

            setMessage('Student enrolled successfully.');
            setSelectedCourse('');

            await loadStudentCourses(selectedStudent);
        } catch (err) {
            console.error('Failed to enroll student:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoadingEnrollment(false);
        }
    };

    const handleRemove = async (courseId) => {
        if (!selectedStudent) {
            return;
        }

        try {
            setLoadingEnrollment(true);
            setMessage('');
            setError('');

            const response = await fetch(
                `/api/students/${selectedStudent}/courses/${courseId}`,
                {
                    method: 'DELETE',
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setError(
                    result.error?.message ||
                    'Unable to remove this enrollment.'
                );
                return;
            }

            setMessage('Enrollment removed successfully.');

            await loadStudentCourses(selectedStudent);
        } catch (err) {
            console.error('Failed to remove enrollment:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoadingEnrollment(false);
        }
    };

    const enrolledCourseIds = new Set(
        enrolledCourses.map((course) => course.id)
    );

    const availableCourses = courses.filter(
        (course) => !enrolledCourseIds.has(course.id)
    );

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Loading enrollment information...
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* Accent */}
            <div className="h-1 bg-violet-600" />

            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                <h3 className="text-xl font-bold text-slate-900">
                    Manage Enrollment
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    Select a student and assign an available course.
                </p>
            </div>

            {/* Form Area */}
            <div className="px-6 py-6 sm:px-8 sm:py-8">
                <form
                    onSubmit={handleEnroll}
                    className="grid gap-6 sm:grid-cols-2"
                >
                    {/* Student */}
                    <div>
                        <label
                            htmlFor="student"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Student
                        </label>

                        <select
                            id="student"
                            value={selectedStudent}
                            onChange={handleStudentChange}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900"
                        >
                            <option value="">Select a student</option>

                            {students.map((student) => (
                                <option key={student.id} value={student.id}>
                                    {student.firstName} {student.lastName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Course */}
                    <div>
                        <label
                            htmlFor="course"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                        >
                            Course
                        </label>

                        <select
                            id="course"
                            value={selectedCourse}
                            onChange={(event) =>
                                setSelectedCourse(event.target.value)
                            }
                            disabled={!selectedStudent || loadingEnrollment}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-slate-900 disabled:bg-slate-50 disabled:text-slate-400"
                        >
                            <option value="">
                                {selectedStudent
                                    ? 'Select a course'
                                    : 'Select a student first'}
                            </option>

                            {availableCourses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.code} — {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Enroll Button */}
                    <div className="sm:col-span-2 flex justify-end">
                        <button
                            type="submit"
                            disabled={
                                !selectedStudent ||
                                !selectedCourse ||
                                loadingEnrollment
                            }
                            className="rounded-lg border border-violet-600 bg-violet-600 px-6 py-2.5 font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:border-violet-300 disabled:bg-violet-300 disabled:text-white"
                        >
                            {loadingEnrollment ? 'Processing...' : 'Enroll Student'}
                        </button>
                    </div>
                </form>

                {/* Messages */}
                {message && (
                    <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                        <p className="text-sm font-medium text-green-700">
                            {message}
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm font-medium text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {/* Enrolled Courses */}
                {selectedStudent && (
                    <div className="mt-8 border-t border-slate-200 pt-6">
                        <div className="mb-4">
                            <h4 className="text-lg font-bold text-slate-900">
                                Current Enrollments
                            </h4>

                            <p className="mt-1 text-sm text-slate-500">
                                Courses currently assigned to this student.
                            </p>
                        </div>

                        {enrolledCourses.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center">
                                <p className="text-sm text-slate-500">
                                    This student is not enrolled in any courses.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200">
                                {enrolledCourses.map((course) => (
                                    <div
                                        key={course.id}
                                        className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="rounded-md bg-violet-50 px-2.5 py-1 text-sm font-bold text-violet-700">
                                                    {course.code}
                                                </span>

                                                <span className="font-semibold text-slate-900">
                                                    {course.title}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {course.instructor} · {course.credits} credits
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemove(course.id)}
                                            disabled={loadingEnrollment}
                                            className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}