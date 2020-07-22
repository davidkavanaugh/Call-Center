import React from 'react';
import { Route, Switch } from 'react-router-dom';

import PrivateRoute from "./PrivateRoute";
import Register from '../Register/Register';
import Login from '../Login/Login';
import Dashboard from '../Dashboard/Dashboard';
import CreateCallCenter from '../CreateCallCenter/CreateCallCenter';
import AccountSettings from '../Settings/Settings';
import CallCenter from '../CallCenter/CallCenter';
import Editor from '../Editor/Editor';
import Invite from '../Invite/Invite';
import NewCallScript from '../CallScript/NewCallScript';
import EditCallScript from '../CallScript/EditCallScript';
import NewClient from '../CallCenter/NewClient';
import Client from '../CallCenter/Client';
import AddNote from '../CallCenter/AddNote';
import Note from '../CallCenter/Note';

const Routes = props => {
    return (
        <React.Fragment>
            <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />

                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/account-settings" component={AccountSettings} />
                <PrivateRoute exact path="/create-call-center" component={CreateCallCenter} />
                <PrivateRoute exact path="/call-center/:id" component={CallCenter} />
                <PrivateRoute exact path="/call-center/editor/:id" component={Editor} />
                <PrivateRoute exact path="/invite/:id" component={Invite} />
                <PrivateRoute exact path='/call-center/new-call-script/:id' component={NewCallScript} />
                <PrivateRoute exact path='/call-center/editor/:id/edit-call-script/:id' component={EditCallScript} />
                <PrivateRoute exact path='/call-center/new-client/:id' component={NewClient} />
                <PrivateRoute exact path='/call-center/:callCenterId/client/:clientId' component={Client} />
                <PrivateRoute exact path='/call-center/:callCenterId/client/:clientId/add-note/:noteId' component={AddNote} />
                <PrivateRoute exact path='/call-center/:callCenterId/client/:clientId/note/:noteId' component={Note} />
                {/* <Route component={NotFound} /> */}
            </Switch>
        </React.Fragment>
    );
  };
  
  export default Routes;