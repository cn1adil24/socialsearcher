import React from 'react'
import '../css/Entities.css'
import { Link } from 'react-router-dom';
class Entities extends React.Component {


    

    render() {

        
        return (

            <div className="py-3 mb-5 entities">
                <div className="container">
                    <div className="row">
                        
                        <div className="col-12">
                            <div className="d-sm-flex justify-content-start">
                                
                                <h5 className="another-search-head">People also search for</h5>

                                {

                                    this.props.entities.map((elem, i) => {

                                        return <div key={i} className="entity-item my-2">
                                            <Link className="nav-link entity-item-link" to={{pathname: '/timeline', state: elem.name}}>{elem.name}</Link>
                                        </div>


                                    })
                                }
                                
                            </div>
                        </div>

                    </div>
                </div>

            </div>



        )
    }


}

export default Entities;