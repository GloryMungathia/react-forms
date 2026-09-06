'use client';

import { useEffect, useState } from 'react';

export default function StudentList({ refreshKey, onEdit }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch('/api/students');
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error?.message || 'Failed to load students.'
                    );
                }

                setStudents(result.data || []);
            } catch (err) {
                console.error('Failed to load students:', err);
                setError('Unable to load students. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [refreshKey]);

    const deleteStudent = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this student?'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (!response.ok) {
                alert(
                    result.error?.message ||
                    'Unable to delete student. Please try again.'
                );
                return;
            }

            setStudents((currentStudents) =>
                currentStudents.filter((student) => student.id !== id)
            );
        } catch (err) {
            console.error('Failed to delete student:', err);
            alert('Something went wrong. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">Loading students...</p>
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
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">
                        Student Records
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {students.length}{' '}
                        {students.length === 1 ? 'student' : 'students'} registered
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {students.length === 0 ? (
                <div className="px-6 py-10 text-center">
                    <p className="text-sm text-slate-500">
                        No students have been registered yet.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-slate-200">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
                        >
                            {/* Student Info */}
                            <div className="min-w-0">
                                <h4 className="text-base font-semibold text-slate-900">
                                    {student.firstName} {student.lastName}
                                </h4>

                                <p className="mt-1 text-sm text-slate-500">
                                    {student.email}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex shrink-0 gap-2">
                                <button
                                    type="button"
                                    onClick={() => onEdit(student)}
                                    className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                                >
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => deleteStudent(student.id)}
                                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100"
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