import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {webProjectData,appProjectData,researchProjectData,allProjectData} from '../dataAndFiles/projectData.js'
import '../styles/protfolio.css';
import { useState } from 'react';


function ProtfolioSingleCard({title,imgSrc,source}){
    return(
        <div className='protfolio-single-card'>
            <div className='protfolio-pic-parent'>
                <div className='project-pic'>
                    <img src={imgSrc}/>
                </div>
            </div>

            <a href={source}>
                <div className='protfolio-details'>
                    <p className='makeBold'>{title}</p>
                    <a>Demo <FontAwesomeIcon icon={faArrowRight}/></a>
                </div>
            </a>
        </div>
    )
}

export default function Protfolio(){
    const [projectNavSelect, setProjectNavSelect] = useState(allProjectData);

    return(
        <div className='protfolio-parent pt-8 lg:pt-20'>
            <div className='protfolio-heading-sec'>
                <p className='makeBold'>Protfolio</p>
                <p>Most recent work</p>
            </div>

            <div className='protfolio-content-parent'>
                <div className='protfolio-nav-sec makeBold'>
                    <div className={`${"protfolio-nav-item"} ${projectNavSelect === allProjectData ? "text-white bg-gray-800 transition-all duration-300" : ""}`}
                        onClick={()=>setProjectNavSelect(allProjectData)}>All</div>
                    <div className={`${"protfolio-nav-item"} ${projectNavSelect === webProjectData ? "text-white bg-gray-800 transition-all duration-300" : ""}`}
                        onClick={()=>setProjectNavSelect(webProjectData)}>Web</div>
                    <div className={`${"protfolio-nav-item"} ${projectNavSelect === appProjectData ? "text-white bg-gray-800 transition-all duration-300" : ""}`}
                        onClick={()=>setProjectNavSelect(appProjectData)}>App</div>
                    <div className={`${"protfolio-nav-item"} ${projectNavSelect === researchProjectData ? "text-white bg-gray-800 transition-all duration-300" : ""}`} 
                        onClick={()=>setProjectNavSelect(researchProjectData)}>Research</div>
                </div>

                <div className={`${"protfolio-card-parent"}`}>
                    {projectNavSelect.map((ele)=><ProtfolioSingleCard 
                        imgSrc={ele.image}
                        source={ele.source}
                        title={ele.title}/>)}
                </div>

            </div>
            
        </div>
    )
}