import React, { useState, useEffect } from "react";
import NavigationAdmin from './NavAdmin'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList, faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";
import styles from '../table.module.css';

import Popup from './Popup';
import UserDocuments from "./UserDocuments";

const clipboardIcon = <FontAwesomeIcon icon={ faClipboardList } />
const downloadIcon = <FontAwesomeIcon icon={ faDownload } />
const trashIcon = <FontAwesomeIcon icon={ faTrash } />

const AdminHome = () => {

    const [users, setUsers] = useState([]);
    const history = useHistory();

    const [documents, setDocuments] = useState("");

    const [isOpen, setIsOpen] = useState(false);
 
    const togglePopup = (user_email) => {
      localStorage.setItem('selectedEmail', user_email)
      setIsOpen(!isOpen);
    }


    const fetchUsers = async () => {
        let body = {
          'email': localStorage.getItem('adminEmail')
        }
        const { data } = await axios.post(
          "http://127.0.0.1:5000/api/users/list_users", body
        );
        const data_users = data["success"];
        setUsers(data_users);
        console.log(data_users);
    };

    useEffect(() => {
        const email = localStorage.getItem('adminEmail');
        if(!email) {
          history.push('/Login');
        }
        fetchUsers();
    }, []);

    const checkUserDocuments = (user_email) => {
        localStorage.setItem('selectedEmail', user_email)
        history.push({
            pathname: '/UserDocuments',
            email: user_email
        });
    }

    return (
      <div className="app-container">
        <NavigationAdmin/>
    <h1>Bienvenue sur votre espace administrateur</h1>
    <h2>Vous pouvez retrouver ici la liste de vos utilisateurs, consulter leurs documents, les télécharger ou les supprimer.</h2>
    <h3>Liste des utilisateurs</h3>
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.theadth}>Username</th>
          <th className={styles.theadth}>Email</th>
          <th className={styles.theadth}>Documents envoyés</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user)=> (
          <tr>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>
              <div>
                <input className={styles.tbodytdbutton} type="button" value="Consulter ses documents" onClick={function(e) {togglePopup(user.email) }}/>
                {isOpen && 
                <Popup content={<>
                <UserDocuments/>
                </>} handleClose={togglePopup}
                />}
              </div>
            </td>
          </tr>
        ))}
          
      </tbody>
    </table>

  </div>



        
    );

};

export default AdminHome;