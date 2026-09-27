import type { Prompt } from "../types";

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Voting Column */}
        <div className="flex flex-col items-center text-gray-500 font-bold">
          <button className="hover:text-orange-500 text-xl">▲</button>
          <span className="text-lg text-black">{prompt.prompt_upvotes}</span>
          <button className="hover:text-blue-500 text-xl">▼</button>
        </div>

        {/* Content Column */}
        <div className="flex-1">
          <p className="text-lg font-medium text-gray-800 mb-2">
            {prompt.body}
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Posted by u/{prompt.user_id}</span>
            <span>{new Date(prompt.created_at).toLocaleString()}</span>
            <span className="bg-gray-100 px-2 py-1 rounded-full">
              {prompt.response_count} Responses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}