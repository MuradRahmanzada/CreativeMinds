import React from "react";

// Components
import Nav from "../components/Nav";


const Layout = ({children}) => {
  return (
    <div className="mx-6 md:max-w-2xl md:mx-auto font-montserrat">
      <Nav />
      {children}
    </div>
  );
};

export default Layout;
