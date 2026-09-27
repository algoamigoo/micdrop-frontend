import { useQuery } from "@tanstack/react-query";
import { getPrompts } from "../api/prompt";
import PromptCard from "../components/PromptCard";

export default function Home() {
  // React Query automatically handles loading and error states!
  const { data: prompts, isLoading, isError } = useQuery({
    queryKey: ["prompts"],
    queryFn: getPrompts,
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading prompts...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Failed to load prompts.</div>;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">MicDrop</h1>
      
      {/* Create Prompt Button (We will build this form later) */}
      <button className="w-full bg-purple-600 text-white py-2 rounded-lg mb-6 hover:bg-purple-700 font-semibold">
        + Add a Prompt
      </button>

      {/* Prompt List */}
      <div>
        {prompts?.length === 0 ? (
          <p className="text-center text-gray-500">No prompts yet. Be the first!</p>
        ) : (
          prompts?.map((prompt) => (
            <PromptCard key={prompt.post_id} prompt={prompt} />
          ))
        )}
      </div>
    </div>
  );
}