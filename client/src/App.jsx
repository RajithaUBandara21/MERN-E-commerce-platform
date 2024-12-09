import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AdminLayout from "./components/admin-view/layout";
import AuthLayout from "./components/common/layout";
import CheckAuth from "./components/common/check-auth";
import ShoppingLayout from "./components/shopping-view/layout";
// import AdminDashboard from "./pages/admin-view/dashboard";
import AdminFeatures from "./pages/admin-view/features";
import AdminOrders from "./pages/admin-view/orders";
import AdminProducts from "./pages/admin-view/products";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import NotFound from "./pages/not-found";
import ShoppingAccount from "./pages/shopping-view/account";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingHome from "../../shopping-view/home";
import ShoppingListing from "../../shopping-view/listing";
// import PaymentSuccessPage from "../../shopping-view/payment-success";
// import PaypalReturnPage from "./pages/shopping-view/paypal-return";
// import SearchProducts from "../../shopping-view/search";
// import UnauthPage from "./pages/unauth-page";
import { checkAuth } from "./store/auth-slice";

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>



        <Route path="/admin" element={<AdminLayout/>} >
          <Route path="dashboard" element={<AdminDashbord/>} />
          <Route path="products" element={<AdminProducts/>} />
          <Route path="orders" element={<AdminOrders/>} />
          <Route path="features" element={<AdminFeatures/>} />
        
         </Route>
<Route path="/shop" element={<ShoppingLayout/>} >
<Route path="home" element={<ShoppingHome/>} />
<Route path="listning" element={<ShoppingListing/>} />
<Route path="checkout" element={<ShoppingCheckout/>} />
<Route path="account" element={<ShoppingAccount/>} />
</Route>


<Route path="*" element = {<NotFound/>} />


      </Routes>
    </div>
  );
}

export default App;
