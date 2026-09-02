'use client';

import { useForm } from 'react-hook-form';

export default function Home() {
  const form = useForm({
    defaultValues: {
      firstName: 'Glory',
      lastName: 'Mutala',
      email: 'glorymutala@gmail.com',
    },
  });

  return (
    <div className='flex flex-col h-screen w-screen justify-center items-center'>
      <div className='flex flex-col gap-2 w-[30rem]'>
        <h1 className='text-2xl'>Student Registration</h1>
        <form>
          <div className='flex flex-col gap-1'>
            <label htmlFor='firstName'>First Name</label>
            <input
              className='border border-gray-900 rounded-md px-2 py-1'
              type='text'
              id='firstName'
              {...form.register('firstName', {
                required: true,
              })}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='lastName'>Last Name</label>
            <input
              className='border border-gray-900 rounded-md px-2 py-1'
              type='text'
              id='lastName'
              {...form.register('lastName', {
                required: true,
                validate: (value) => {
                  if (value.toLowerCase() !== 'maina') {
                    return false;
                  }
                  return true;
                },
              })}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor='email'>Email</label>
            <input
              className='border border-gray-900 rounded-md px-2 py-1'
              type='email'
              id='email'
              {...form.register('email')}
            />
          </div>

          <div className='flex flex-col py-3'>
            <button
              disabled={!form.formState.isValid || !form.formState.isDirty}
              type='submit'
              className='bg-pink-600 text-white py-2 px-2 font-bold uppercase rounded-full disabled:bg-gray-500 disabled:cursor-crosshair'>
              Save
            </button>
          </div>

          <div className='flex flex-col py-3'>{JSON.stringify(form.watch())}</div>
        </form>
      </div>
    </div>
  );
}