export default function SkeletonHero() {
  return (
    <div className="w-full h-[500px] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-full flex flex-col justify-end p-8 md:p-12">
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-gray-300 dark:bg-gray-700 rounded-full" />
          <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-8" />
        <div className="flex gap-4 text-sm">
          <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded" />
          <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
