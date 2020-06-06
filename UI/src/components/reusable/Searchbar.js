import React from 'react'
import '../css/Searchbar.css'

// const cache = {}

class Searchbar extends React.Component {

    state = {term: '', error: ''}

    componentDidMount() {

        // if(cache["term"] !== undefined)
        //     this.setState({term: cache["term"]})
    }
    onFormSubmit = (event) => {

        event.preventDefault();

        if(this.state.term === ''){

            this.setState( {error: 'Please enter the search term'})
        }
        else{
            this.setState( {error: ''})
            this.props.onFormSubmit(this.state.term)
        }
    }

    onChange = (value) => {

        this.setState({term: value, error: ''})
        // cache["term"] = value
    } 
    render() {

        return (

            <div className="container mt-5">
                <div className="row">
                    <div className="col-12 col-md-8 col-lg-8">
                        <form onSubmit={this.onFormSubmit} className="card card-sm">
                            <div className="card-body py-0 pr-0 row no-gutters align-items-center">
                                <div className="col-auto">
                                    <i className="fa fa-superpowers h4 text-body mt-2"></i>
                                </div>
                                <div className="col">
                                    <input 
                                        className="form-control form-control-lg form-control-borderless"
                                        type="text"
                                        placeholder="search"
                                        value={this.state.term}
                                        onChange={e => this.onChange(e.target.value) } />
                                </div>
                                
                                <div className="col-auto">
                                    <button className="search-button btn btn-lg" type="submit"><i className="fa fa-search"></i></button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
                <div className="row error-text">                
                    <div className="col">
                        
                        <small className="text-danger">{this.state.error}</small>
                    </div>
                </div>
            </div>
        )

    }
}

export default Searchbar;