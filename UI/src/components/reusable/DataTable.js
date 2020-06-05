import React from 'react';
import {Link} from 'react-router-dom'
import { MDBDataTable } from 'mdbreact';
class DataTable extends React.Component {

   

    formatData () {

        const content= []
        this.props.data.forEach( (row, i) => {


            content.push({
                            number:i,
                            Searchterm: row.name,
                            Date: row.Date,
                            Search: <Link to={{pathname: '/timeline', state: row.name}}>Search</Link>
                        })

        })
        const data = {
            columns: [
              {
                label: '#',
                field: 'number',
                sort: 'asc',
                width: 150
              },
              {
                label: 'Search term',
                field: 'Searchterm',
                sort: 'asc',
                width: 270
              },
              {
                label: 'Date',
                field: 'Date',
                sort: 'asc',
                width: 200
              },
              {
                label: 'Search',
                field: 'Search',
                sort: 'asc',
                width: 200
              }
            ],
            rows: content
          };

          return data;

    }

    render(){
      
      return (

        <div className="container mt-4">
            <h2 className="text-center">History</h2>
            <MDBDataTable
                className="dataTable"
                striped
                bordered
                hover
                data={this.formatData()}
            />
        </div>


    )
    }
}

export default DataTable;