import {  faGrip, faList,faXmark,} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useContext, useState} from "react";
import RefDataContext from "../contexts/RefDataContext";
import singleItemData from "../dataAndFiles/bottomNavData";
import '../styles/bottomNav.css';


function ExpandSingleItem({title,logo,scrollTo,expandHandler}){
    const {scrollToComponent} = useContext(RefDataContext);
    const [iconHighlight,setIconHighLight] = useState('');
    const iconHandler = ()=>{
        setIconHighLight('text-yellow-500');
        setTimeout(() => {
            setIconHighLight('');
            expandHandler(false);
        }, 200);
    }

    return(
        <div onClick={()=>{scrollToComponent(scrollTo); iconHandler()}} 
            className={`${"p-1 text-white  flex flex-col gap-2 justify-center hover:cursor-pointer text-gray-800"} ${iconHighlight}`}>
            <FontAwesomeIcon className="nav-item-bottm text-2xl" icon={logo}/>
            <p className=" text-v-sm text-center">{title}</p>
        </div>
    )
}

function Compact({expandHandler}){
    return(
        <div className="bottom-div-parent">
            <div className="bottom-nav">
                <p className="makeBold">Ashik</p>
                <FontAwesomeIcon 
                    onClick={expandHandler}
                    className="expandIcon hover:cursor-pointer" 
                    icon={faGrip}/>
            </div>
        </div>
    )
}

function Expand({expandHandler}){
    const {homeRef,
        aboutRef,
        skillRef,
        qualificationRef,
        contactRef,
        protfolioRef} = useContext(RefDataContext);

    const map = new Map();
    map.set('Home',homeRef);
    map.set('About',aboutRef);
    map.set('Protfolio',protfolioRef);
    map.set('Skills',skillRef);
    map.set('Qualification',qualificationRef);
    map.set('Contact',contactRef);

    return(
        <div className="bottom-div-parent-expand">
            <div className="bottom-nav-expand">
                <FontAwesomeIcon 
                    className="hover:cursor-pointer text-xl"   
                    onClick={()=>{
                        expandHandler()
                    }}
                    icon={faXmark}/>
            </div>

            {/* this is for items showing in bottom */}
            <div className="flex justify-center">
                <div className="nav-elements-expand">
                    {singleItemData.map((ele)=>
                        <ExpandSingleItem 
                            title={ele.title} 
                            scrollTo={map.get(ele.title)}
                            expandHandler={expandHandler}
                            logo={ele.logo}/>
                    )}

                </div>
            </div>
            </div>
            
    )
}



export default function BottomNav(){

    const expandHandler = (custom = true)=>{
        setExpandClass(!expandClass && custom);
    }
    const [expandClass , setExpandClass] = useState(false);

    return(
        <>
            {expandClass && <div><Expand expandHandler={expandHandler}/></div>}
            {!expandClass && <Compact expandHandler={expandHandler}/>}
        </>
    )
}