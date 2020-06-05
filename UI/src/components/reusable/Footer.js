import React from 'react'
import '../css/Footer.css'

const Footer = () => {


    return(


        <>
            <footer  className="footer">
                <div className="container text-center py-4">
                    <p>Copy right &copy; {new Date().getFullYear()}</p>
                </div>
            </footer>

        </>


    )
}
export default Footer;