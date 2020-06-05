import React from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Timeline from './Routes/Timeline'
import History from './Routes/History'
import Profile from './Routes/Profile'
import About from './Routes/About'
import TweetsTimeline from './reusable/TweetsTimeline'
import SignupLogin from './Routes/SignupLogin'
import Covid19 from './Routes/Covid19'

import Logout from './Routes/Logout'


class App extends React.Component {

    render() {

        return(

            <div className="p-0 container-fluid">
                <BrowserRouter>
                    <Switch>
                        
                        <Route path="/" exact component={SignupLogin} />
                        <Route path="/timeline" component={Timeline} />
                        <Route path="/history" component={History} />
                        <Route path="/profile" component={Profile} />
                        <Route path="/about" component={About} />
                        <Route path="/Covid19" component={Covid19} />
                        
                        <Route path="/tweetstimeline/:id" component={TweetsTimeline}  />

                        <Route path="/logout" component={Logout}  />
                    </Switch>
                </BrowserRouter>
            </div>
        )


    }
}

export default App;