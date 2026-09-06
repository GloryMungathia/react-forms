'use client';

import { useState } from 'react';

import AddStudentForm from '@/components/forms/AddStudentForm';
import StudentList from '@/components/forms/StudentList';
import EditStudentForm from '@/components/forms/EditStudentForm';

import AddCourseForm from '@/components/forms/AddCourseForm';
import CourseList from '@/components/forms/CourseList';
import EditCourseForm from '@/components/forms/EditCourseForm';

import EnrollmentForm from '@/components/forms/EnrollmentForm';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [courseRefreshKey, setCourseRefreshKey] = useState(0);

  const [editingStudent, setEditingStudent] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleStudentCreated = () => {
    setRefreshKey((current) => current + 1);
  };

  const handleStudentUpdated = () => {
    setEditingStudent(null);
    setRefreshKey((current) => current + 1);
  };

  const handleCourseCreated = () => {
    setCourseRefreshKey((current) => current + 1);
  };

  const handleCourseUpdated = () => {
    setEditingCourse(null);
    setCourseRefreshKey((current) => current + 1);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Student & Course Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage student records, courses, and enrollment.
          </p>
        </div>
      </header>

      {/* Main */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Students */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Students
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add new students and manage existing records.
            </p>
          </div>

          <div className="space-y-8">
            {editingStudent ? (
              <EditStudentForm
                student={editingStudent}
                onStudentUpdated={handleStudentUpdated}
                onCancel={() => setEditingStudent(null)}
              />
            ) : (
              <AddStudentForm
                onStudentCreated={handleStudentCreated}
              />
            )}

            <StudentList
              refreshKey={refreshKey}
              onEdit={setEditingStudent}
            />
          </div>
        </section>

        {/* Courses */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Courses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage available courses.
            </p>
          </div>

          <div className="space-y-8">
            {editingCourse ? (
              <EditCourseForm
                course={editingCourse}
                onCourseUpdated={handleCourseUpdated}
                onCancel={() => setEditingCourse(null)}
              />
            ) : (
              <AddCourseForm
                onCourseCreated={handleCourseCreated}
              />
            )}

            <CourseList
              refreshKey={courseRefreshKey}
              onEdit={setEditingCourse}
            />
          </div>
        </section>

        {/* Enrollment */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Enrollment
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Manage student course enrollment.
            </p>
          </div>

          <EnrollmentForm />
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-center text-sm text-slate-500">
          Student & Course Management System
        </div>
      </footer>
    </main>
  );
}