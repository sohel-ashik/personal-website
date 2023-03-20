import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons"
import { useContext } from "react";
import RefDataContext from "../contexts/RefDataContext";

import '../styles/footer.css'


export default function Footer(){
    const {scrollToComponent,aboutRef,protfolioRef,contactRef} = useContext(RefDataContext);

    return(
        <footer className="pb-28 bg-gray-100 rounded-xl 
            pt-10 flex flex-col footer-parent 
            shadow shadow-black 
            gap-2 select-none">
            <p className="text-xl makeBold lg:2xl">Ashik</p>
            <div className="footer-btn flex gap-4 text-gray-700">
                <p onClick={()=>scrollToComponent(aboutRef)} className="hover:cursor-pointer">About</p>
                <p onClick={()=>scrollToComponent(protfolioRef)} className="hover:cursor-pointer">projects</p>
                <p onClick={()=>scrollToComponent(contactRef)} className="hover:cursor-pointer">Contact</p>
            </div>
            <div className="footer-social-icon flex gap-3 text-xl lg:text-3xl pt-2 pb-2">
                <a href="https://www.facebook.com/sohel.ashik594">
                    <FontAwesomeIcon icon={faFacebook} className="hover:cursor-pointer"/>
                </a>
                <a href="https://twitter.com/SohelAshik2">
                    <FontAwesomeIcon icon={faTwitter} className="hover:cursor-pointer"/>
                </a>
                <a href="https://www.instagram.com/sohelashik/">
                    <FontAwesomeIcon icon={faInstagram} className="hover:cursor-pointer"/>
                </a>
            </div>

            <p className="text-sm text-gray-400">© Sohel Ashik. All right reserved</p>
        </footer>
    )
}