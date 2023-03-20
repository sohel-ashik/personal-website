import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faComputerMouse, faPaperPlane, faArrowDown } from "@fortawesome/free-solid-svg-icons"; 

import githubIcon from '../images/icons/githubIcon.svg';
import facebookIcon from '../images/icons/facebook.svg';
import linkedinIcon from '../images/icons/linkedin.svg';
import '../styles/home.css';
import { faFacebook, faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";


function SideBar({cName}){
    return(
        <div className={cName}>
            <div className="social-media-div ">
                <a href="https://github.com/sohel-ashik">
                    <FontAwesomeIcon icon={faGithub} className="hover:cursor-pointer"/>
                </a>
                <a href="https://www.facebook.com/sohel.ashik594">
                <FontAwesomeIcon icon={faFacebook} className="hover:cursor-pointer"/>
                </a>
                <a href="https://www.linkedin.com/in/sohel-ashik-7177271a3/">
                <FontAwesomeIcon icon={faLinkedin} className="hover:cursor-pointer"/>
                </a>
            </div>
        </div>
    )
}

export default function Home(){
    const [knocked,setKnocked] = useState('');

    return(
        <div className="home select-none ">
            
            <div className="details">
                <div className="name-details">

                    <SideBar cName="media-full"/>
                    <div className="inside-name-details">
                        <p className="dev-name text-4xl bold ">Sohel Siddique Ashik</p>
                        <div className="flex gap-1 pt-2">
                            <hr className="hr-div w-20 mt-4  border-gray-400 rounded-full"/>
                            <p className="dev-type text-gray-600 text-lg te">Developer</p>
                        </div>
                        <p className="mt-6">I'm a dedicated fullstack web developer with a talent for problem solving. I bring a wealth of experience and a meticulous attention to detail to every project. My expertise and passion for innovative web solutions make me a valuable asset to any team.</p>
                        <button onClick={()=>setKnocked('Knocked')} disabled = {knocked}
                            className="knock-me-btn disabled:opacity-50">{knocked ? knocked : "Knock me"}<FontAwesomeIcon icon={faPaperPlane} className="pl-1 knock-me-icon"/></button>

                        <div className="scroll-down">
                            <FontAwesomeIcon className="text-2xl text-gray-600" icon={faComputerMouse}/>
                            <p>Scroll Down</p>
                            <FontAwesomeIcon className="mt-1" icon={faArrowDown}/>
                        </div>
                    </div>
                </div>
                <div className="pic-sec">     
                    {/* <SideBar cName="media-half"/> */}
                    <div className="picture-div ">
                    </div>
                </div>

            </div>
        </div>
    )
}