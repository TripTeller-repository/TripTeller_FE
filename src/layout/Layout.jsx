import Header from "/src/layout/header/Header";
import Footer from "/src/layout/footer/Footer";

function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
