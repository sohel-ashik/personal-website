import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faBriefcase,faHeadset,faFileLines } from "@fortawesome/free-solid-svg-icons";
import '../styles/about.css';

export default function About(){

    return(
        <div className="about-parent pt-10">
            <div className="about-heading">
                <div>
                    <p className="text-3xl makeBold">About Me</p>
                    <p className="text-sm text-gray-600">My Introduction</p>
                </div>
            </div>

            <div className="about-content-all">
                <div className="about-pic-parent">
                    <div className="about-pic"></div>
                </div>
                
                <div className="description-sec">

                    <div className="card-sec">
                        <div className="card-item">
                            <FontAwesomeIcon 
                                className="card-icon"
                                icon={faLightbulb}/>
                            <p className="makeBold">Experience</p>
                            <p>Fresher</p>
                        </div>

                        <div className="card-item">
                            <FontAwesomeIcon 
                                className="card-icon"
                                icon={faBriefcase} />
                            <p className="makeBold">Completed</p>
                            <p>5+ projects</p>
                        </div>

                        <div className="card-item">
                            <FontAwesomeIcon
                                className="card-icon"
                                icon={faHeadset}/>
                            <p className="makeBold">Support</p>
                            <p>Online 24/7</p>
                        </div>

                    </div>
                    
                    <div className="description-para">
                        <p>
                        I'm a skilled developer with expertise in React.js, JavaScript, Node.js, and Express. I have a strong grasp of UI development with Tailwind CSS and Bootstrap. With over 5 successful projects under my belt, I'm well-equipped to take on any web development challenge. Let's build something amazing together!
                        </p>

                        <div className="flex justify-center">
                            <div className="cv-download">
                                <p className="">Download CV</p>
                                <FontAwesomeIcon
                                    className="text-lg text-white"
                                    icon={faFileLines}/>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}