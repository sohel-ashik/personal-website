import '../styles/nav.css'
import { useContext } from 'react';
import RefDataContext from '../contexts/RefDataContext';

export default function Nav(){
    const {scrollToComponent,
        homeRef,
        aboutRef,
        skillRef,
        qualificationRef,
        contactRef,
        protfolioRef} = useContext(RefDataContext);


    return (
        <div className='parent bg-white'>
            
            <div className="nav select-none">
                <p className='text-lg bold'>Ashik</p>
                <div className="nav-elements">
                    <p onClick={()=>scrollToComponent(homeRef)}
                        className='nav-item'>Home</p>

                    <p onClick={()=>scrollToComponent(aboutRef)}
                        className='nav-item'>About</p>

                    <p onClick={()=>scrollToComponent(protfolioRef)}
                        className='nav-item'>Portfolio</p>

                    <p onClick={()=>scrollToComponent(skillRef)}
                        className='nav-item'>Skills</p>

                    <p onClick={()=>scrollToComponent(qualificationRef)}
                        className='nav-item'>Qualification</p>

                    <p onClick={()=>scrollToComponent(contactRef)}
                        className='nav-item'>Contact</p>
                </div>
            </div>
            
        </div>
    )
}