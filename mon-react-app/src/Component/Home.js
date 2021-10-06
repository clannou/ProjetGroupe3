import React, { useState, useEffect, Component } from "react";
import { saveAs } from 'file-saver';
import { ChakraProvider } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import axios from 'axios';

const Home = () => {
    var FileSaver = require('file-saver');
    const history = useHistory();

    const logout = () =>{ 
        history.push("/Login");
    }

    const fetchDocuments = async () => {
      let body = {
        'email': 'chen_l@etna-alternance.net'
      }
      const { data } = await axios.post(
        "http://127.0.0.1:5000/api/users/list_uploadfiles", body
      );
      const data_documents = data["success"];
      setDocuments(data_documents);
      console.log(data_documents);
    };

    const [documentss, setDocuments] = useState([]);

    useEffect(() => {
      fetchDocuments();
    }, []);

    const [selectedFile, setSelectedFile] = useState("");


    const downloadFile = (document_name) => {
      console.log("ok")
      let body = {
        'filename': document_name,
        'email': 'chen_l@etna-alternance.net'
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

    const onFileUpload = () => {
    
      // Create an object of formData
      const formData = new FormData();
    
      // Update the formData object
      formData.append(
        "file",
        selectedFile,
        selectedFile.name
      );

      formData.append("email", "chen_l@etna-alternance.net")
    
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
        <ChakraProvider>
            <h1>Welcome to the home page !</h1>
        <Button
            onClick={logout}
        >
        Logout
        </Button>

        <br></br>
        <br></br>

        <div>
        {documentss.map((documentt) => (
            <div>
              {documentt.created} - {documentt.name} | <button onClick={function(e) { downloadFile(documentt.name); }}>Download</button> 
            </div>
          ))}
        </div>

        <br></br>

        <div>
              <h3>
                File Upload
              </h3>
              <div>
                  <input type="file" onChange={(e) => {
                    setSelectedFile(e.target.files[0]);
                  }} />
                  <button onClick={onFileUpload}>
                    Upload!
                  </button>
              </div>
            {fileData}
          </div>

        </ChakraProvider>
    );
};

export default Home;