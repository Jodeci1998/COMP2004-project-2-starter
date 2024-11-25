import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import axios from "axios";
import ProductsForm from "./ProductsForm";

export default function GroceriesAppContainer() {
  /////states///////

  //initializing productQuantity as an empty array after getting productList
  //products.map((product) => ({ id: product.id, quantity: 0 }))
  const [productQuantity, setProductQuantity] = useState([]);

  const [cartList, setCartList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [productToEdit, setProductToEdit] = useState(null);
  //State to handle form data for adding and editing products
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
  });
  ///////useeffect/////
  useEffect(() => {
    handleProductsFromDB();
  }, []);
  ///useeffect for editing products
  useEffect(() => {
    if (productToEdit) {
      //if editing, please show formData with productToEdits details
      setFormData({
        productName: productToEdit.productName,
        brand: productToEdit.brand,
        image: productToEdit.image,
        price: productToEdit.price,
      });
    } else {
      // if there is no editing, reset formData
      setFormData({
        productName: "",
        brand: "",
        image: "",
        price: "",
      });
    }
  }, [productToEdit]);

  ///////handlers//////
  const handleProductsFromDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/products");
      //.then((result) => setProductList(result.data));
      setProductList(response.data);
      //initialize productQuantity based on the fetched products
      //to ensure each product has a quantity added ot it
      setProductQuantity(
        response.data.map((product) => ({ id: product.id, quantity: 0 }))
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  //handler for adding a new product

  const addProduct = (newProduct) => {
    axios
      .post("http://localhost:3000/products", newProduct)
      .then((response) => {
        //after adding the new product add another entry for the new product in productQuantity
        //with default of 0
        const addedProduct = response.data;
        setProductList([...productList, addedProduct]);
        setProductQuantity([
          ...productQuantity,
          { id: addedProduct.id, quantity: 0 },
        ]);
      })
      .catch((error) => {
        console.log("Error adding a product", error.message);
        alert("Failed to add product");
      });
  };

  const editProduct = (id, updatedProduct) => {
    axios
      .put(`http://localhost:3000/products/${id}`, updatedProduct)
      .then((response) => {
        const updatedList = productList.map((product) => {
          if (product.id === id) {
            return response.data;
          }
          return product;
        });
        setProductList(updatedList);
        setProductToEdit(null);
        alert("Product updated succesfully");
      })
      .catch((error) => {
        console.log("Error updating product", error.message);
        alert("Failed to update product");
      });
  };

  const beginEditProduct = (product) => {
    setProductToEdit(product);
  };

  const cancelEdit = () => {
    setProductToEdit(null);
  };

  const deleteProduct = (id) => {
    axios
      .delete(`http://localhost:3000/products/${id}`)
      .then(() => {
        const updatedList = productList.filter((product) => product.id !== id);
        setProductList(updatedList);
        alert("Product deleted succesfully!");
      })
      .catch((error) => {
        console.log("Error deleting products", error.message);
        alert("Failed to delete product");
      });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    //prevent the default form submission
    e.preventDefault();
    //basic validation check to see if all fields are filled
    if (
      !formData.productName ||
      !formData.brand ||
      !formData.image ||
      !formData.price
    ) {
      alert("Please fill the fields");
      //exit the function early
      return;
    }
    if (productToEdit) {
      //if productToEdit exists we are in edit mode
      editProduct(productToEdit.id, formData);
    } else {
      //if productToEdit is null we are in add mode
      addProduct(formData);
    }

    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
    });
  };

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };
  //modifying this handler
  //instead of products prop accepting producList
  const handleAddToCart = (productId) => {
    //const product = products.find((product) => product.id === productId);
    const product = productList.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };
  ////renderer/////
  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <ProductsForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          isEditing={!!productToEdit} //boolean indicating edit mode
          cancelEdit={cancelEdit}
        />
        <ProductsContainer
          products={productList}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          beginEditProduct={beginEditProduct}
          deleteProduct={deleteProduct}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
