import React, { useState } from "react";
import axios from 'axios'
import { ChakraProvider } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Avatar,
  FormControl,
  FormHelperText,
  InputRightElement } from "@chakra-ui/react"
import { extendTheme } from "@chakra-ui/react"
import { createBreakpoints } from "@chakra-ui/theme-tools"
import { FaUserAlt, FaLock, FaMailBulk } from "react-icons/fa";

import Login from "./Login"

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
const CFaMailBulk = chakra(FaMailBulk)


const breakpoints = createBreakpoints({
  sm: "30em",
  md: "48em",
  lg: "62em",
  xl: "80em",
  "2xl": "96em",
})

const theme = extendTheme({ breakpoints })

const App = () => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  
  const handleRoute = () =>{ 
    history.push("/Login");
  }

  const register = () => {
    if (username.length == 0 || email.length == 0 || password.length == 0) {
      alert("Empty form")
      return
    }


    let data = {
      username: username,
      email: email,
      password: password,
    }
    axios.post('http://127.0.0.1:5000/api/users/register',
    data).then(response => {
      let obj = response.data;
      alert(obj)
    }).catch(error => {
      alert(error)
    })
  }

  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <ChakraProvider>
    <Flex
    flexDirection="column"
    width="100wh"
    height="100vh"
    backgroundColor="gray.200"
    justifyContent="center"
    alignItems="center"
  >
    <Stack
      flexDir="column"
      mb="2"
      justifyContent="center"
      alignItems="center"
    >
      <Avatar bg="teal.500" />
      <Heading color="teal.400">Welcome !</Heading>
      <Box minW={{ base: "90%", md: "468px" }}>
        <form>
          <Stack
            spacing={4}
            p="1rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >

            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input placeholder="Username" 
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaMailBulk color="gray.300" />}
                />
                <Input type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<CFaLock color="gray.300" />}
                />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
              
              borderRadius={10}
              type="submit"
              variant="solid"
              colorScheme="teal"
              width="full"
              onClick={register}
            >
              Register
            </Button>
          </Stack>
        </form>
      </Box>
    </Stack>
    <Box>
      Already an account?{" "}
      <Button
            onClick={handleRoute}>
              Login
        </Button>
      
    </Box>
    <h1>The username is : {username}</h1>
  </Flex>
  </ChakraProvider>
  );
};
  
export default App;