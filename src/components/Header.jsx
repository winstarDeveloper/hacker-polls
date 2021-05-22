import React from "react";
import { Link } from "react-router-dom";

import { Modal } from "react-bootstrap";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const Header = () => {
  const [show, setShow] = React.useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = (event) => {
    alert("You have been Logged out!");
    sessionStorage.clear();
    window.location.reload(false);
  };

  const clearVote = () => {
    window.localStorage.clear();
    alert('Local storage Vote cleared');
    window.location.reload(false);
  }

  return (
    <div className="header">
      <AppBar position="static">
        <Toolbar>
          <Link className="header__home" to="/">
            <Typography variant="h6">Hacker Poll</Typography>
          </Link>
          <div className="header__btns">
            {sessionStorage.getItem("token") ? (
              <>
                <span className="header__login" onClick={handleLogout}>
                  <Link to="/login">
                    <Button color="inherit">Logout</Button>
                  </Link>
                </span>
                <span className="header__login">
                  <Link to="/login">
                    <Button color="inherit">Dashboard</Button>
                  </Link>
                </span>
              </>
            ) : (
              <span className="header__login">
                <Link to="/login">
                  <Button color="inherit">Login</Button>
                </Link>
              </span>
            )}

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Hacker Poll Project</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Created by Prayush Kale as a Task for Coda Global FullStack Superhero Hiring Challenge.
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={handleClose}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>

            <span className="header__about" onClick={handleShow}>
              <Button color="inherit">About</Button>
            </span>

            { window.localStorage.getItem("voted") ? (
               <span className="header__about" onClick={clearVote}>
               <Button color="inherit">Clear Vote</Button>
             </span>
            ) : (null)}
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
