'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { use } from 'react';

// This is for unwrapping the params Promise using React.use()
export default function EditNote({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [content, setContent] = useState(''); // Content is the only editable field
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Unwrap the params using React.use()
  const unwrappedParams = use(params);

  const fetchNote = async () => {
    const { data, error } = await supabase.from('notes').select('*').eq('id', unwrappedParams.id).single();

    if (error) {
      setErrorMsg(error.message);
    } else {
      setContent(data.content);
    }
  };

  useEffect(() => {
    if (unwrappedParams?.id) {
      fetchNote();
    }
  }, [unwrappedParams]);

  const handleUpdateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.from('notes').update({ content }).eq('id', unwrappedParams.id);

    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/notes');
    }

    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Note</h1>
      <form onSubmit={handleUpdateNote} className="bg-white p-6 rounded-lg shadow-md">
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
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            {loading ? 'Updating...' : 'Update Note'}
          </button>
        </div>
      </form>
      {errorMsg && <p className="mt-4 text-red-500">{errorMsg}</p>}
    </div>
  );
}
