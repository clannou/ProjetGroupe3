import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons'
import Navigation from './NavAdmin'
import axios from 'axios';

const downloadIcon = <FontAwesomeIcon icon={ faDownload } />
const trashIcon = <FontAwesomeIcon icon={ faTrash } />

const UserDocuments = () => {
    var FileSaver = require('file-saver');
    const location = useLocation();
    const [documentss, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        console.log(localStorage.getItem('selectedEmail'))
        let body = {
          'email': localStorage.getItem('selectedEmail')
        }
        const { data } = await axios.post(
          "http://127.0.0.1:5000/api/users/list_uploadfiles", body
        );
        const data_documents = data["success"];
        setDocuments(data_documents);
        console.log(data_documents);
    };

    useEffect(() => {
        fetchDocuments();
    }, [location]);

    const downloadFile = (document_name) => {
        console.log("ok")
        let body = {
          'filename': document_name,
          'email': localStorage.getItem('selectedEmail')
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
          'email': localStorage.getItem('selectedEmail')
        }
  
        axios.post("http://127.0.0.1:5000/api/users/delete_file", body)
        .then((response) => {
            console.log(response)
        }).catch((response) => {
            console.error("Could not delete file from the backend.", response);
        });
        window.location.reload();
  
      }

    return (
        <div>
            <h1>Document de l'utilisateur</h1>
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
        </div>
    );

};

export default UserDocuments;