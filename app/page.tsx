export default function Home() {
  return (
    <div>
      <p>
        Welcome to my order management demo. This is a webapp built with Next 13
        and hosted on Vercel. It supports some basic CRUD operations for
        Products and Orders. Orders require a Product to be created. Once an
        Order is moved to the Delivered status, the underlying Product will get
        its quantity updated.
      </p>
    </div>
  );
}
