import logo from './logoFileSharing.png';

import React from "react";
import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

import { Icon } from '@iconify/react';
import signOutAlt from '@iconify/icons-fa-solid/sign-out-alt'



const LogoutIcon = <Icon icon={ signOutAlt } />


export default function Navigation() {
    const history = useHistory();

    const logout = () =>{ 
        history.push("/Login");
    }
  return (
    <>
      <Navbar class="navbar" bg="dark" expand="lg">
        <Navbar.Brand class="navbar-menu" href="#home">FILESHARING</Navbar.Brand>
        <img class="navbar-logo" src={logo} width="100" height="100"/>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="justify-content-center">
            <Nav.Link class="navbar-link" href="Home">Envoyer des fichiers</Nav.Link>
            <Nav.Link class="navbar-link" href="#foo">Mes informations personnelles</Nav.Link>
          </Nav>
          <button 
          onClick={logout}
          >{LogoutIcon}
          </button>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}