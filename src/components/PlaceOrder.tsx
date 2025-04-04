// import { useCartContext } from "@/context/CartContext";
// import { IProduct } from "@/types/product";
// import { getProductsFromLocal, getUserFromLocal } from "@/utils/localstorage";
// // import { Button } from "@mui/material";

// const PlaceOrder = () => {
//   const { cartMap } = useCartContext();
//   const activeUser = getUserFromLocal();
//   if (!activeUser) {
//     alert("Login to place an order");
//     return;
//   }

//   const carts = JSON.parse(localStorage.getItem("carts") || "{}");
//   const orders = JSON.parse(localStorage.getItem("orders") || "{}");
//   const products = getProductsFromLocal();

//   const userCart = carts[activeUser] || [];

//   if (userCart.length === 0) {
//     alert("Your cart is empty. Add products before placing an order.");
//     return;
//   }

//   let orderValid = true;
//   let errorMessage = "";

//   userCart.forEach((product: IProduct) => {
//     const requestedQuantity = cartMap[product.id]?.quantity || 0;
//     if (requestedQuantity > product.stock) {
//       orderValid = false;
//       errorMessage += `Not enough stock for ${product.title}. Available: ${product.stock}, Requested: ${requestedQuantity}}\n`;
//     }
//   });

//   if (!orderValid) {
//     alert(`Order cannot be placed due to stock issues:\n${errorMessage}`);
//     return;
//   }

//   orders[activeUser] = orders[activeUser] || [];

//   const orderId = crypto.randomUUID();

//   const newOrder = {
//     id: orderId,
//     items: userCart.map((product: IProduct) => ({
//       ...product,
//       quantity: cartMap[product.id]?.quantity,
//     })),
//   };

//   orders[activeUser].push(newOrder);
//   userCart.forEach((product: IProduct) => {
//     const productIndex = products.findIndex((p) => p.id === product.id);
//     if (productIndex !== -1) {
//       products[productIndex].stock -= cartMap[product.id]?.quantity || 0;
//     }
//   });

//   localStorage.setItem("orders", JSON.stringify(orders));
//   localStorage.setItem("products", JSON.stringify(products));

//   delete carts[activeUser];
//   localStorage.setItem("carts", JSON.stringify(carts));

//   alert("Order placed successfully!");
//   window.location.reload();
// };

// //   return (
// //     <>
// //       <Button variant="contained" color="warning" onClick={PlaceOrder}>
// //         Place Order
// //       </Button>
// //     </>

// export default PlaceOrder;
