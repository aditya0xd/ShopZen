import Skeleton from "../common/Skeleton";

const ProductSkeleton = () => {
  return (
    <div className="border rounded-lg bg-white p-4">
      <Skeleton className="h-40 w-full" />

      <div className="mt-3 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
