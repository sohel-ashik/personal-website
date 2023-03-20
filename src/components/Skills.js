import '../styles/skills.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from 'react';
import {fontendArr,backendArr} from '../dataAndFiles/skillsData.js';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';


function CardForSkill({heading,subHeading}){

    return(
        <div className='skill-single-card'>
            <div className='skill-single-icon'>
                <FontAwesomeIcon icon={faCircleCheck}/>
            </div>
            <div className='skill-single-card-detail'>
                <p className='makeBold'>{heading}</p>
                <p>{subHeading}</p>
            </div>
        </div>
    )
}

const FrontEndCards = [];
const BackEndCards = [];

export default function Skills(){
    
    return(
        <div className="skill-parent-sec pt-8 lg:pt-20">
            <div className='skill-heading'>
                <p className='makeBold'>Skills</p>
                <p>My technical level</p>
            </div>

            <div className='skill-content-parent'>
                <div className='front-back-end-parent'>
                    <div className='front-back-end-heading'>
                        <p className='makeBold'>Frontend technologies</p>
                    </div>
                    <div className='front-back-end-cards'>
                        {fontendArr.map((ele)=>
                            <CardForSkill heading={ele.heading} subHeading={ele.subHeading}/>
                        )}
                    </div>

                </div>

                <div className='front-back-end-parent'>
                    <div className='front-back-end-heading'>
                        <p className='makeBold'>Backtend technologies</p>
                    </div>
                    <div className='front-back-end-cards'>
                        {backendArr.map((ele)=>
                            <CardForSkill heading={ele.heading} subHeading={ele.subHeading}/>
                        )}
                    </div>

                </div>
            </div>
        </div>
    )
}