"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Note {
  id: number;
  content: string;
  created_at: string;
}

export default function Notes() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);

  const fetchNotes = async () => {
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error.message);
    } else {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      console.error("error deleting note:", error.message);
    } else {
      fetchNotes();
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Notes</h1>

      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              ID
            </th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Content
            </th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Created At
            </th>
            <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note) => (
            <tr key={note.id} className="border-t hover:bg-gray-50">
              <td className="py-3 px-4 text-sm text-gray-700">{note.id}</td>
              <td className="py-3 px-4 text-sm text-gray-700">
                {note.content}
              </td>
              <td className="py-3 px-4 text-sm text-gray-500">
                {new Date(note.created_at).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm">
                <button
                  className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 focus:outline-none"
                  onClick={() => router.push(`/notes/edit/${note.id}`)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-4 ml-2 rounded hover:bg-red-600 focus:outline-none"
                  onClick={async () => {
                    setSelectedNoteId(note.id);
                    setIsModalOpen(true); // Re-fetch the notes after deletion
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none"
          onClick={() => router.push("/notes/create")}
        >
          Create New Note
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-80">
            <h3 className="text-xl font-semibold mb-4">Are you sure?</h3>
            <p className="mb-4 text-gray-600">
              Do you really want to delete this note? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 focus:outline-none" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none"
                onClick={() => {
                  if (selectedNoteId) {
                    handleDelete(selectedNoteId);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
