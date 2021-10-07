import Register from './Register';
import Login from './Login';
import Home from './Home';
import AdminHome from './AdminHome';
import UserDocuments from './UserDocuments';
import Settings from './Settings';
import { BrowserRouter, Route } from "react-router-dom";

const Router = () => {
    return (
        <BrowserRouter>
            <Route path='/Login' component={Login} />
            <Route path='/Register' component={Register} />
            <Route path='/Home' component={Home} />
            <Route path='/AdminHome' component={AdminHome} />
            <Route path='/UserDocuments' component={UserDocuments} />
            <Route path='/Settings' component={Settings} />
        </BrowserRouter>
    );

};

export default Router;