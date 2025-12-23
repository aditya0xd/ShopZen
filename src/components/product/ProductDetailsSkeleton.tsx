import Skeleton from "../common/Skeleton";

const ProductDetailsSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      {/* Image Skeleton */}
      <div className="rounded-lg overflow-hidden">
        <Skeleton className="h-80 w-full" />
      </div>

      {/* Content Skeleton */}
      <div className="space-y-5">
        {/* Title */}
        <Skeleton className="h-7 w-3/4" />

        {/* Rating */}
        <Skeleton className="h-4 w-32" />

        {/* Description */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Price */}
        <Skeleton className="h-8 w-40" />

        {/* CTA Button */}
        <Skeleton className="h-12 w-44 rounded-md" />
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
