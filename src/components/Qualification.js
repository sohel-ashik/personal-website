import { faBriefcase, faCalendar, faCalendarWeek, faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import {educationArr, experienceArr} from '../dataAndFiles/qualificationData'
import '../styles/qualification.css';


function QualificationCardInside({heading,subHeading, duration,id}){
    return(
        <div className={`${"quali-single-card-parent"} ${id ? "quali-single-card-parent-left text-right" : ""}`}>
            <p className='makeBold'>{heading}</p>
            <p className={`${"quali-subheading"}`}>{subHeading}</p>

            <div className='quali-single-card-date'>
                <FontAwesomeIcon icon={faCalendarWeek}/>
                <p>{duration}</p>
            </div>
        </div>
    )
}

function QualificationSingleCard({heading,subHeading, duration,id}){
    return(
        <>
            <div className='design-circle-parent'>
                <div className='design-circle'></div>
            </div>

            <div className='compact-temp'>
                <div className='temp-cardl'>
                    {id && <QualificationCardInside 
                        heading={heading}
                        subHeading={subHeading}
                        duration={duration}
                        id = {id}
                    />}
                </div>
                                
                <div className='temp-card'>
                    {!id && <QualificationCardInside 
                        heading={heading}
                        subHeading={subHeading}
                        duration={duration}
                    />
                    
                    }
                </div>
            </div>
        </>
        
    )
}

export default function Qualification(){
    const [qualiSwich, setQualiSwitch] = useState(true);

    return(
        <div className='qualification-parent-div mb-32 pt-8 lg:pt-20'>
            <div className='qualification-heading'>
                <p className='makeBold'>Qualification</p>
                <p>My personal journey</p>
            </div>

            <div className='quali-content'>
                <div className='quali-content-heading'>
                    <div className='quali-content-heading-item' 
                        onClick={()=>setQualiSwitch(true)}>
                        <FontAwesomeIcon 
                            className='text-xl'
                            icon={faGraduationCap}/>
                        <p className={`${qualiSwich ? "makeBold text-fuchsia-600 " : ""}`}>Education</p>
                    </div>
                    <div className='quali-content-heading-item'
                    onClick={()=>setQualiSwitch(false)}>
                        <FontAwesomeIcon 
                            className='text-xl'
                            icon={faBriefcase}/>
                        <p className={`${!qualiSwich ? "makeBold text-fuchsia-600 " : ""}`}>Experience</p>
                    </div>
                </div>
                
                <div className='content-education-div'>

                    {qualiSwich && educationArr.map((ele)=>
                        <QualificationSingleCard
                            heading={ele.type}
                            subHeading={ele.institute}
                            duration={ele.duration}
                            id={ele.id%2 ? true : false}
                        />
                    )}

                    {!qualiSwich && experienceArr.map((ele)=>
                        <QualificationSingleCard
                            heading={ele.type}
                            subHeading={ele.institute}
                            duration={ele.duration}
                            id={ele.id%2 ? true : false}
                        />
                    )}
                    
                </div>

            </div>

        </div>
    )
}