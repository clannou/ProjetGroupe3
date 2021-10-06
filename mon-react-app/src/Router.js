import App from './App';
import Login from './Login';
import { BrowserRouter, Route } from "react-router-dom";

const Router = () => {
    return (
        <BrowserRouter>
            <Route path='/Home' component={App} />
            <Route path='/Login' component={Login} />
        </BrowserRouter>
    );

};

export default Router;