// This ensures Tailwind includes these classes in the final build
export const TailwindSafelist = () => {
  return (
    <div className="hidden">
      bg-green-500 bg-red-500 bg-blue-500
      text-white text-black text-center
      p-2 p-4 p-6
      rounded shadow border w-full h-full
      hover:bg-blue-700 mt-4 mb-2
      flex items-center justify-center
    </div>
  );
};
