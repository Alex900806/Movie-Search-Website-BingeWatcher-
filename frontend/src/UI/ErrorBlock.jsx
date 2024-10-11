export default function ErrorBlock({ title, message }) {
  return (
    <div className="flex justify-center py-96">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded relative max-w-lg w-full"
        role="alert"
      >
        <div className="flex items-center">
          <div className="error-block-icon bg-red-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4">
            !
          </div>
          <div className="error-block-text">
            <h2 className="font-bold text-lg">{title}</h2>
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
