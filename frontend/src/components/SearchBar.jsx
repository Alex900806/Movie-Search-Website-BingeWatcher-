import { Form } from "react-router-dom";

export default function SearchBar() {
  return (
    <Form
      method="post"
      className="flex flex-row items-center w-full max-w-lg mt-8 space-x-4"
    >
      <input
        type="text"
        name="query"
        className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        placeholder="今天想看點什麼呢？"
        required
      />
      <button
        type="submit"
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-yellow-400 hover:text-black transition duration-300 shadow-md"
      >
        搜尋
      </button>
    </Form>
  );
}
