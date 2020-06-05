import React from 'react'
import {Redirect} from 'react-router-dom'
import Navbar from '../reusable/Navbar'
import axios from '../api/api'
import DataTable from '../reusable/DataTable'

class History extends React.Component {

    state = {history: []}
    async componentDidMount() {

        console.log("token" + localStorage.getItem("Token"))
        const response = await axios.get(`/history?id=`+localStorage.getItem("Token"))
        this.setState({history: response.data})


    }

    
    
    render() {

        if(localStorage.getItem("Token") ===null)
            return <Redirect to="/" />
        return(
            <>
                <Navbar />
                <DataTable data={this.state.history} />
            </>
        )
    }
}

export default History;