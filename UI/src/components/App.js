import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Timeline from './Routes/Timeline'
import History from './Routes/History'
import Profile from './Routes/Profile'
import About from './Routes/About'
import TweetsTimeline from './reusable/TweetsTimeline'
import SignupLogin from './Routes/SignupLogin'
// import Covid19 from './Routes/Covid19'

import Logout from './Routes/Logout'


class App extends React.Component {

    render() {

        return(

            <div className="p-0 container-fluid">
                <BrowserRouter>
                    <Switch>
                        {/* Route to login and register page */}
                        <Route path="/" exact component={SignupLogin} />
                        {/* Route to timline or home page */}
                        <Route path="/timeline" component={Timeline} />
                        {/* Route to the search history page */}
                        <Route path="/history" component={History} />
                        {/* Route to the user profile page */}
                        <Route path="/profile" component={Profile} />
                        {/* Route to the about page or developer info page */}
                        <Route path="/about" component={About} />
                        {/* This route is not available */}
                        {/* <Route path="/Covid19" component={Covid19} /> */}
                        {/* This route is to the tweetstimeline page display tweets of specific topic */}
                        <Route path="/tweetstimeline/:id" component={TweetsTimeline}  />
                        {/* Logout user from current session  */}
                        <Route path="/logout" component={Logout}  />
                    </Switch>
                </BrowserRouter>
            </div>
        )


    }
}

export default App;