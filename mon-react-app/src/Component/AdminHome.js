import React, { useState, useEffect } from "react";
import NavigationAdmin from './NavAdmin'
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";

const clipboardIcon = <FontAwesomeIcon icon={ faClipboardList } />

const AdminHome = () => {

    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        let body = {
          'email': localStorage.getItem('email')
        }
        const { data } = await axios.post(
          "http://127.0.0.1:5000/api/users/list_users", body
        );
        const data_users = data["success"];
        setUsers(data_users);
        console.log(data_users);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const checkUserDocuments = () => {
        console.log("ok")
    }

    return (
        <div className="app-container">
            <NavigationAdmin/>
            <h1>Welcome to the admin home page !</h1>
            <h2>Liste des utilisateurs</h2>
          <table>
            <thead>
              <tr>
                <th>Nom des utilisateurs</th>
                <th>Email des utilisateurs</th>
                <th>Consulter les documents</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user)=> (
                <tr>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                  <button style={{'display': 'block', 'margin': 'auto' }} onClick={function(e) { checkUserDocuments(user.email); }}>{clipboardIcon}</button> 
                  </td>
                </tr>
                ))}
                
            </tbody>
          </table>
        </div>
    );

};

export default AdminHome;