const SecondaryButton = ({ text, onClick }) => {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default SecondaryButton;
