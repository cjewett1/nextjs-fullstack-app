import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <div className="mx-6 md:max-w-2xl md:mx-auto font-poppins">
      <Nav />
      {/* By calling the children props, this will render out whatever dynamic content we have in main */}
      <main>{children}</main>
    </div>
  );
}
