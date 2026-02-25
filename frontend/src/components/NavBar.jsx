import { Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <header className="nav">
      <strong>Flipkart Lite</strong>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/shipping">Shipping</Link>
        <Link to="/payment">Payment</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/seller">Seller</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/login">Login</Link>
      </nav>
    </header>
  );
}
