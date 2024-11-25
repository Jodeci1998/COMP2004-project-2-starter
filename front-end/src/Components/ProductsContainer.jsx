import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  productQuantity,
  beginEditProduct,
  deleteProduct,
}) {
  return (
    <div className="ProductsContainer">
      {products.map((product) => {
        // Safely find the quantity for the current product
        const pq = productQuantity.find((p) => p.id === product.id);
        const quantity = pq ? pq.quantity : 0; // Default to 0 if not found

        return (
          <ProductCard
            key={product.id}
            {...product}
            handleAddQuantity={handleAddQuantity}
            handleRemoveQuantity={handleRemoveQuantity}
            handleAddToCart={handleAddToCart}
            productQuantity={quantity} // Pass the safe quantity
            beginEditProduct={beginEditProduct}
            deleteProduct={deleteProduct}
          />
        );
      })}
    </div>
  );
}
