import React, { useState, useEffect, Component } from "react";
import { saveAs } from 'file-saver';
import { useHistory } from "react-router-dom";
import axios from 'axios';

import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import Navigation from './Nav';

const downloadIcon = <FontAwesomeIcon icon={ faDownload } />
const trashIcon = <FontAwesomeIcon icon={ faTrash } />



const Home = () => {
    var FileSaver = require('file-saver');
    const history = useHistory();
    const [documentss, setDocuments] = useState([]);
    const [selectedFile, setSelectedFile] = useState("");

    const fetchDocuments = async () => {
      let body = {
        'email': localStorage.getItem('email')
      }
      const { data } = await axios.post(
        "http://127.0.0.1:5000/api/users/list_uploadfiles", body
      );
      const data_documents = data["success"];
      setDocuments(data_documents);
      console.log(data_documents);
    };


    useEffect(() => {
        const adminEmail = localStorage.getItem('adminEmail');
        if (adminEmail) {
            history.push('/AdminHome');
        } else {
            const email = localStorage.getItem('email');
            if(!email) {
              history.push('/Login');
            }
            fetchDocuments();
        }
    }, []);

    const downloadFile = (document_name) => {
      console.log("ok")
      let body = {
        'filename': document_name,
        'email': localStorage.getItem('email')
      }

      axios.post("http://127.0.0.1:5000/api/users/download_file", body ,{responseType: 'blob'})
      .then((response) => {
        // Log somewhat to show that the browser actually exposes the custom HTTP header
        const fileNameHeader = "x-suggested-filename";
        const suggestedFileName = response.headers[fileNameHeader];
        const effectiveFileName = (suggestedFileName === undefined
                    ? ""
                    : suggestedFileName);
        console.log("Received header [" + fileNameHeader + "]: " + suggestedFileName
                    + ", effective fileName: " + effectiveFileName);
    
        // Let the user save the file.
        FileSaver.saveAs(response.data, effectiveFileName);
    
        }).catch((response) => {
            console.error("Could not Download file from the backend.", response);
        });

    }

    const deleteFile = (document_name) => {
      let body = {
        'filename': document_name,
        'email': localStorage.getItem('email')
      }

      axios.post("http://127.0.0.1:5000/api/users/delete_file", body)
      .then((response) => {
          console.log(response)
      }).catch((response) => {
          console.error("Could not delete file from the backend.", response);
      });
      window.location.reload();

    }

    const onFileUpload = () => {
    
      // Create an object of formData
      const formData = new FormData();
    
      // Update the formData object
      formData.append(
        "file",
        selectedFile,
        selectedFile.name
      );

      formData.append("email", localStorage.getItem('email'))
    
      // Details of the uploaded file
      console.log(selectedFile);
    
      // Request made to the backend api
      // Send formData object
      axios.post("http://127.0.0.1:5000/api/users/uploadfile", formData);
      window.location.reload();
    };
    
    // File content to be displayed after
    // file upload is complete
    const fileData = () => {
        if (this.state.selectedFile) {
          return (
            <div>
              <h2>File Details:</h2>
              <p>File Name: {this.state.selectedFile.name}</p>
              <p>File Type: {this.state.selectedFile.type}</p>
              <p>
                Last Modified:{" "}
                {this.state.selectedFile.lastModifiedDate.toDateString()}
              </p>
            </div>
          );
        } else {
          return (
            <div>
              <br />
              <h4>Choose before Pressing the Upload button</h4>
            </div>
          );
        }
    };

    return (
      <div className="app-container">
        <Navigation/>
        <h2>Liste des documents précédemment chargés</h2>
          <table>
            <thead>
              <tr>
                <th>Nom du document</th>
                <th>Date de création</th>
                <th>Télécharger</th>
              </tr>
            </thead>
            <tbody>
              {documentss.map((documentt)=> (
                <tr>
                  <td>{documentt.name}</td>
                  <td>{documentt.created}</td>
                  <td>
                  <button onClick={function(e) { downloadFile(documentt.name); }}>{downloadIcon}</button> 
                   <button onClick={function(e) { deleteFile(documentt.name)}}>{trashIcon}</button>
                  </td>
                </tr>
                ))}
                
            </tbody>
          </table>

        <h2>Envoyez vos documents !</h2>
      

          <div>
            <div>
              <label for="file">Choisir le fichier à upload ('txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif')</label>
              <input type="file" onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                      }} /> 
              <button onClick={onFileUpload}>Upload !</button>
            </div>
          
          {fileData}
          </div>
      </div>

    );
};

export default Home;