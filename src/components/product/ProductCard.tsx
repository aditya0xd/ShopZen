import type { Product } from "../../types/product";
import { Link } from "react-router-dom";
import ProgressiveImage from "../common/ProgressiveImage";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="
        group
        rounded-lg
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        p-4
        transition
        hover:shadow-lg
        hover:-translate-y-0.5
      "
    >
      {/* Image */}
      <div className="overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
        <ProgressiveImage
          thumbnailSrc={product.thumbnail}
          highResSrc={product.image || product.images?.[0]}
          alt={product.title}
          loading="lazy"
          delayMs={600}
          className="
            h-40 w-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Content */}
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
          {product.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          ⭐ {product.rating}
        </p>

        <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
          ${product.price}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
