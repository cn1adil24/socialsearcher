import React from 'react'

import angry from '../images/angry-icon.png'
import smile from '../images/smile-icon.png'

class TweetsMetaData extends React.Component {

     render() {

          return (

               <div className="container entities mb-4">
                    <div className="row">
                         <div className="col-12">
                              <div className="d-sm-flex justify-content-around">
                                   <h5 className="text-dark mt-2">
                                        <i className="fas fa-user mr-2"></i>
                                        Unique User : {this.props.userCount}
                                   </h5>
                                   <h5 className="text-success mt-2">
                                        <img className="sent-icon mr-2" src={smile} alt="smile-icon" />
                                        Positive Tweets : {this.props.positiveCount}
                                   </h5>
                                   <h5 className="text-danger mt-2">
                                        <img className="sent-icon mr-2" src={angry} alt="angry-icon" />
                                        Negative Tweets : {this.props.negativeCount}
                                   </h5>
                                   
                              </div>

                         </div>

                    </div>
                    
               </div>
          )
     }
}
export default TweetsMetaData;