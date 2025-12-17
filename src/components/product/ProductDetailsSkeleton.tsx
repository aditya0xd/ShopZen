import Skeleton from "../common/Skeleton";

const ProductDetailsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Skeleton className="h-80 w-full" />

      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-40" />
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
