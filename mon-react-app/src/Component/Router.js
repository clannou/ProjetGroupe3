import Register from './Register';
import Login from './Login';
import Home from './Home';
import AdminHome from './AdminHome';
import { BrowserRouter, Route } from "react-router-dom";

const Router = () => {
    return (
        <BrowserRouter>
            <Route path='/Register' component={Register} />
            <Route path='/Login' component={Login} />
            <Route path='/Home' component={Home} />
            <Route path='/AdminHome' component={AdminHome} />
        </BrowserRouter>
    );

};

export default Router;