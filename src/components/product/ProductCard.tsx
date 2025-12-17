import type { Product } from "../../types/product";
import { Link } from "react-router-dom";

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  return (
    <Link
      to={`/products/${product.id}`}
      className="border rounded-lg bg-white p-4 hover:shadow-md transition"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-40 w-full object-cover rounded"
      />

      <div className="mt-3">
        <h3 className="text-sm font-semibold line-clamp-1">{product.title}</h3>

        <p className="text-gray-500 text-sm mt-1">⭐ {product.rating}</p>

        <p className="mt-2 font-bold">₹{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
