import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { Button } from "@chakra-ui/react";

const AdminHome = () => {
    const history = useHistory();

    const logout = () =>{ 
        history.push("/Login");
    }

    return (
        <ChakraProvider>
            <h1>Welcome to the admin home page !</h1>
        <Button
            onClick={logout}
        >Logout</Button>
        </ChakraProvider>
    );

};

export default AdminHome;