//ProductsForm component
//handles both adding new products and editing existing ones

export default function ProductsForm({
  cancelEdit,
  isEditing,
  onSubmit,
  onChange,
  formData,
}) {
  return (
    <div className="product-form-container">
      {/*hedaing will change dpending if we are adding or editing */}
      <h2>{isEditing ? "Edit Product " : "Product Form"}</h2>
      <form onSubmit={onSubmit} className="product-form">
        {/*product name input */}
        <div className="form-group">
          <label></label>
          <input
            className="form-group-input"
            type="text"
            name="productName"
            value={formData.productName}
            onChange={onChange}
            placeholder="Product Name"
          />
        </div>
        {/* brand input */}
        <div className="form-group">
          <label></label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={onChange}
            placeholder="Brand"
          />
        </div>
        {/*image url input */}
        <div className="form-group">
          <label></label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={onChange}
            placeholder="Image Link"
          />
        </div>
        {/*price input */}
        <div className="form-group">
          <label></label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={onChange}
            placeholder="Price"
          />
        </div>
        {/*submit and cancel buttons */}
        <div>
          {/* submit button text changes based on mode */}
          <button type="submit" className="submit-button">
            {isEditing ? "Edit Product" : "Submit"}
          </button>
          {/* show the cancel button onlt in edit mode*/}
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              className="cancel-button"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
