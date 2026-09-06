'use client';

import { useEffect, useState } from 'react';

export default function StudentList({ refreshKey, onEdit }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getStudents = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await fetch('/api/students');
            const result = await response.json();

            if (!response.ok) {
                setError(result.error?.message || 'Failed to load students');
                return;
            }

            setStudents(result.data || []);
        } catch (error) {
            console.error(error);
            setError('Something went wrong while loading students.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudents();
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
                alert(result.error?.message || 'Failed to delete student');
                return;
            }

            setStudents((currentStudents) =>
                currentStudents.filter((student) => student.id !== id)
            );
        } catch (error) {
            console.error(error);
            alert('Something went wrong while deleting the student.');
        }
    };

    if (loading) {
        return <p>Loading students...</p>;
    }

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    return (
        <div className="w-full max-w-2xl mt-10">
            <h2 className="text-2xl font-bold mb-4">
                Students
            </h2>

            {students.length === 0 ? (
                <p>No students found.</p>
            ) : (
                <div className="flex flex-col gap-3">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="border border-gray-300 rounded-md p-4 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-bold">
                                    {student.firstName} {student.lastName}
                                </p>

                                <p className="text-gray-600">
                                    {student.email}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => onEdit(student)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteStudent(student.id)}
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