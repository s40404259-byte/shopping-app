import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section>
      <h2>Welcome to Flipkart-style app</h2>
      <p>Customer + Seller + Admin all in one place.</p>
      <Link to="/products">Go to products</Link>
    </section>
  );
}
