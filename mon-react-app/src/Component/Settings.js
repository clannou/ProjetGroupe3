import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Navigation from './Nav'
import { Input } from "@chakra-ui/react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload } from '@fortawesome/free-solid-svg-icons'

import { Form, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import axios from 'axios';

const uploadIcon = <FontAwesomeIcon icon={ faUpload } />

const Settings = () => {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [usernameInput, setUsernameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [currentPassInput, setCurrentPassInput] = useState("");
    const [newPassInput, setNewPassInput] = useState("");

    const fetchUserProfile = async () => {
        let body = {
          'email': localStorage.getItem('email')
        }
        const { data } = await axios.post(
          "http://127.0.0.1:5000/api/users/profile", body
        );
        const data_user_profile = data["success"];
        //setDocuments(data_documents);
        if (data_user_profile) {
            setUsername(data_user_profile.username)
            setEmail(data_user_profile.email)
        }
    };

    useEffect(() => {
        const adminEmail = localStorage.getItem('adminEmail');
        if (adminEmail) {
            history.push('/AdminHome');
        } else {
            const email = localStorage.getItem('email');
            fetchUserProfile();
        }
    }, []);

    const updateUsername = async () => {
        if (usernameInput.length == 0) {
          alert("Empty email")
          return
        }
        const email = localStorage.getItem('email');
        let body = {
            email: email,
            username: usernameInput
        }
        const { data } = await axios.put(
            "http://127.0.0.1:5000/api/users/username", body
        );
        const data_user = data["success"];
        if (data_user) {
            window.location.reload();
        }
    }

    const updateEmail = async () => {
        if (emailInput.length == 0) {
          alert("Empty email")
          return
        }
        const email = localStorage.getItem('email');
        let body = {
            email: email,
            new_email: emailInput
        }
        const { data } = await axios.put(
            "http://127.0.0.1:5000/api/users/email", body
        );
        const data_user = data["success"];
        //setDocuments(data_documents);
        if (data_user) {
            localStorage.setItem('email', emailInput)

            window.location.reload();
        }
    }

    const updatePassword = async () => {
        if (currentPassInput.length == 0 || newPassInput.length == 0) {
          alert("Password input are empty !")
          return
        }
        if (currentPassInput == newPassInput) {
            alert("Password are identical !")
          return
        }
        const email = localStorage.getItem('email');
        let body = {
            email: email,
            password: currentPassInput,
            newPassword: newPassInput
        }
        const { data } = await axios.put(
            "http://127.0.0.1:5000/api/users/password", body
        );
        const data_user = data["success"];
        if (data_user) {
            window.location.reload();
        }
    }

    return (
        <div>
            <Navigation/>
            <h1>Informations personnelles</h1>
            <Form.Label className="pseudo">Pseudo de l'utilisateur : {username} </Form.Label>
            <br/>
            <Form.Label className="pseudo">Email de l'utilisateur : {email} </Form.Label>

            <Form>
                <Row className="mb-3">

                <h1>Modifier les informations</h1>

                <Form.Group className="col-md-8 pseudo" as={Col} controlId="formGridNouveauPseudo">
                    <Form.Label className="pseudo">Nouveau Pseudo</Form.Label>
                    <Form.Control className="pseudo" 
                        type="text" 
                        placeholder="Entrer nouveau pseudo"
                        value={usernameInput}
                        onChange={(e) => {
                            setUsernameInput(e.target.value);
                        }} 
                    />
                    <Button className="bouton" 
                        variant="primary" 
                        onClick={updateUsername}>
                        Sauvegarder
                    </Button>
                </Form.Group>

                <Form.Group className="col-md-8 pseudo" as={Col} controlId="formGridNouveauPseudo">
                    <Form.Label className="pseudo">Nouvel Email</Form.Label>
                    <Form.Control className="pseudo" 
                        type="email" 
                        placeholder="Entrer nouvel email"
                        value={emailInput}
                        onChange={(e) => {
                            setEmailInput(e.target.value);
                        }} 
                    />
                    <Button className="bouton" 
                        variant="primary" 
                        onClick={updateEmail}>
                        Sauvegarder
                    </Button>
                </Form.Group>

                <Form.Group className="col-12 col-md-5 nouveaumdp" as={Col} controlId="formGridNouveaumdp">
                    <Form.Label className= "ancienmdp">Ancien mot de passe</Form.Label>
                    <Form.Control className= "ancienmdp" 
                        type="password" 
                        placeholder="Entrer votre ancien mot de passe"
                        value={currentPassInput}
                        onChange={(e) => {
                            setCurrentPassInput(e.target.value);
                        }}  />
                </Form.Group>

                <Form.Group className="col-12 col-md-5 ancienmdp" as={Col} controlId="formGridAncienmdp">
                    <Form.Label className= "nouveaumdp">Nouveau mot de passe</Form.Label>
                    <Form.Control className= "nouveaumdp" 
                        type="password" 
                        placeholder="Entrer votre nouveau mot de passe"
                        value={newPassInput}
                        onChange={(e) => {
                            setNewPassInput(e.target.value);
                        }}  
                    />
                </Form.Group>
                </Row>

                <Button className="bouton" 
                    variant="primary" 
                    onClick={updatePassword}
                >
                    Sauvegarder mot de passe
                </Button>
            </Form>

        </div>


    );

};

export default Settings;