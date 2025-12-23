import Skeleton from "../common/Skeleton";

const ProductSkeleton = () => {
  return (
    <div
      className="
        rounded-lg
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        p-4
      "
    >
      {/* Image */}
      <div className="overflow-hidden rounded-md">
        <Skeleton className="h-40 w-full" />
      </div>

      {/* Content */}
      <div className="mt-3 space-y-2">
        {/* Title */}
        <Skeleton className="h-4 w-3/4" />

        {/* Rating */}
        <Skeleton className="h-3 w-1/4" />

        {/* Price */}
        <Skeleton className="h-5 w-1/3" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
