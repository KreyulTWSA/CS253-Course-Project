import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/orders/myorders/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setOrders(res.data);

      const storeIds = [...new Set(res.data.map((order => order.store)))];

      const storesArray = await Promise.all(
        storeIds.map(async (id) => {
          try {
            const response = await axios.get(`http://127.0.0.1:8000/stores/${id}/`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            return response.data; 
          } catch (error) {
            console.error(`Failed to fetch store ${id}:`, error);
            return null; 
          }
        })
      );
      
      const storesMap = {};
      storesArray.forEach((storeDetails) => {
        if (storeDetails) {
          storesMap[storeDetails.id] = storeDetails;
        }
      });
      
      const ordersWithStores = res.data.map((order) => ({
        ...order,
        storeDetails: storesMap[order.store] || null,
      }));
      
      setOrders(ordersWithStores);

    } catch (err) {
      console.error("Error fetching orders", err);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/orders/cancel/${orderId}/`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 3000,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error cancelling order", err);
      toast.error("Failed to cancel order. Please try again.", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/orders/confirm/${orderId}/`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      toast.success(res.data.message, {
        position: "top-center",
        autoClose: 3000,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error confirming delivery", err);
      toast.error("Failed to confirm delivery. Please try again.", {
        position: "top-center",
        autoClose: 1000,
      });
    }
  };
  
  // Helper function to display product name, handling deleted products
  const getProductName = (item) => {
    if (item.product_details) {
      return item.product_details.name;
    } else if (item.product_info) {
      return `${item.product_info.name} (deleted)`;
    }
    return "Product no longer available";
  };
  
  // Helper function to calculate item price, handling deleted products
  const getItemPrice = (item) => {
    const price = item.product_details ? item.product_details.price : (item.product_info ? item.product_info.price : item.price);
    return price * item.quantity;
  };

  return (
    <div className="orders-page" >
      <Header/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>

      <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
          }}
        >
       {orders.map((order) => (
        <div key={order.id} className="border rounded p-3 mb-4" style={{backgroundColor: 'rgb(187, 187, 187)', position:'relative'}}>
          <div style={{fontSize:"1.2rem", fontWeight:"bold"}}>{order?.storeDetails?.name}</div>
          <div className="font-semibold">Order Number: {order.id}</div>
          <div>Status: {order.status}</div>
          <div>Payment: {order.payment_method}</div>
          <div>Total: ₹{order.total_price}</div>
          <div>Delivery Address: {order.delivery_address}</div>
          <div>Date: {new Date(order.created_at).toLocaleString()}</div>
          
          <h5 className="text-semibold mt-4">Ordered Items: </h5>
          <ul className="ml-4 mt-2 mb-4" style={{paddingBottom:"25px"}}>
            {order.items.map((item) => (
              <li key={item.id}>
                {getProductName(item)} × {item.quantity} = ₹{getItemPrice(item)}
              </li>
            ))}
          </ul>

          {order.status !== "delivered" && order.status !== "cancelled" && (
            <div className="mt-2 space-x-2" style={{position:'absolute', bottom:'10px', left:'10px'}}>
              <button style={{backgroundColor: 'rgb(251, 29, 29)', border: 'none', borderRadius:'5px'}}
                onClick={() => cancelOrder(order.id)}
                className="px-3 mx-3 py-1 bg-red-500 text-white rounded"
              >
                Cancel Order
              </button>
              <button style={{backgroundColor: 'rgb(0, 145, 31)', border: 'none', borderRadius:'5px'}}
                onClick={() => confirmDelivery(order.id)}
                className="px-3 mx-3 py-1 bg-green-600 text-white rounded"
              >
                Order Recieved
              </button>
            </div>
          )}
        </div>
      ))}
      </div>
      <ToastContainer/>
    </div>
    </div>
  );
};

export default Orders;