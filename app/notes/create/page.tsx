'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CreateNote() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.from('notes').insert([{ content }]);

    if (error) {
      setErrorMsg(error.message);
    } else {
      setContent('');
      router.push('/notes'); // Navigate to the notes list after creating a note
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Create a New Note</h1>
      <form onSubmit={handleCreateNote} className="bg-white p-6 rounded-lg shadow-md">
        <label htmlFor="content" className="block text-sm font-medium text-gray-600 mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none"
          >
            {loading ? 'Creating...' : 'Create Note'}
          </button>
        </div>
      </form>
      {errorMsg && <p className="mt-4 text-red-500">{errorMsg}</p>}
    </div>
  );
}
