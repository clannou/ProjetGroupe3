import logo from './whiteLogoFileSharing.png';

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { useHistory } from 'react-router-dom'
import { Icon } from '@iconify/react';
import signOutAlt from '@iconify/icons-fa-solid/sign-out-alt'

import styles from '../nav.module.css'

const LogoutIcon = <Icon icon={ signOutAlt } />


export default function App() {
  const history = useHistory();

  const logout = () =>{ 
      localStorage.removeItem('selectedEmail')
      localStorage.removeItem('adminEmail')
      history.push("/Login");
  }

  return (
    <>
      <Navbar className={styles.navBar}>
        <Navbar.Brand className={styles.navBrand} href="#home">FILESHARING</Navbar.Brand>
        <img className={styles.navLogo} src={logo} width="100" height="100"/>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className={styles.nav}>
            <Nav.Link className={styles.navLink} href="AdminHome">Liste des utilisateurs</Nav.Link>
          </Nav>
          <button className={styles.logoutLogo} onClick={logout}>{LogoutIcon}</button>
        </Navbar.Collapse>
      </Navbar>
    </>
  );
}