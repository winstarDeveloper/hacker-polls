import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="col-3-of-4 text-center mx-auto">
      <h1> Error 404 </h1>
      <img src="/404.gif" alt="404" />
      <h3>The page does not Exist</h3>
      <Link to="/">
        Home
      </Link>
    </div>
  );
};

export default NotFound;
