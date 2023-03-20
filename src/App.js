import { useRef } from "react";
import About from "./components/About";
import BottomNav from "./components/BottomNav";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Nav from "./components/Nav";
import Protfolio from "./components/Protfolio";
import Qualification from "./components/Qualification";
import Skills from "./components/Skills";
import RefDataContext from './contexts/RefDataContext';
import './styles/app.css'

function App() {

    const homeRef = useRef(null);
    const aboutRef = useRef(null);
    const skillRef = useRef(null);
    const qualificationRef = useRef(null);
    const contactRef = useRef(null);
    const protfolioRef = useRef(null);

    const scrollToComponent = (ref) => {
        ref.current.scrollIntoView({ behavior: "smooth"});
    }

    return (
        <div>
            <RefDataContext.Provider value={
                        {scrollToComponent,
                        homeRef,
                        aboutRef,
                        skillRef,
                        qualificationRef,
                        contactRef,
                        protfolioRef
                    }}>
                <div className="App">
                        <Nav/>
                    <div ref={homeRef}><Home/></div>
                    <div ref={aboutRef}><About /></div>
                    <div ref={skillRef}><Skills/></div>
                    <div ref={qualificationRef}><Qualification/></div> 
                    <div ref={protfolioRef}><Protfolio/></div>
                    <div ref={contactRef}><Contact/></div>
                    
                
                </div>
                <BottomNav />
                <Footer/>
            </RefDataContext.Provider>
        </div>
    );
}

export default App;
