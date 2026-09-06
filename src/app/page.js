'use client';

import { useState } from 'react';

import AddStudentForm from '@/components/forms/AddStudentForm';
import StudentList from '@/components/forms/StudentList';
import EditStudentForm from '@/components/forms/EditStudentForm';

import AddCourseForm from '@/components/forms/AddCourseForm';
import CourseList from '@/components/forms/CourseList';
import EditCourseForm from '@/components/forms/EditCourseForm';

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
    <main className="min-h-screen py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* STUDENTS */}
        <section className="mb-16">
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
        </section>

        {/* COURSES */}
        <section>
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
        </section>

      </div>
    </main>
  );
}