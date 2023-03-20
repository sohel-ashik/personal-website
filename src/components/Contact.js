import { faFacebookMessenger, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { faArrowRight, faComment,  faMailBulk, faMessage, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import '../styles/contact.css';

function ContactItemCard({logo,type,unique,loc}){
    return(
        <div className='contact-card-div'>
            <FontAwesomeIcon className='contact-card-icon' icon={logo}/>
            <p className='makeBold'>{type}</p>
            <p>{unique}</p>
            <div className='contact-direct-link'>
                <a href={loc}>Write me</a>
                <FontAwesomeIcon icon={faArrowRight}/>
            </div>
        </div>
    )
}

export default function Contact(){
    const [name,setName] = useState('');
    const [mail,setMail] = useState('');
    const [msg,setMsg] = useState('')

    const [focus, setFocus] = useState('');

    return(
        <>
        <div className='contact-heading-sec pt-8 lg:pt-20' >
                <p className='makeBold'>Contact Me</p>
                <p>Get in touch</p>
            </div>
        <div className='contact-div-parent' >
            
            <div className='social-contact-parent'>
                <p className='makeBold'>Talk to me</p>

                <ContactItemCard 
                    logo = {faEnvelope}
                    type="Email"
                    unique="sohelashik594@gmail.com"
                    loc='https://mail.google.com/mail/u/0/#inbox?compose=new'
                />
                <ContactItemCard 
                    logo = {faWhatsapp}
                    type="WhatsApp"
                    unique="+88 01772998823"
                    loc='#'
                />
                <ContactItemCard 
                    logo = {faFacebookMessenger}
                    type="Messenger"
                    unique="sohel.ashik594"
                    loc='https://www.facebook.com/sohel.ashik594'
                />
                
            </div>

            <div className='contact-send-message-parent'>
                <p className='text-center text-lg makeBold'>Send me your project</p>
                
                <fieldset className={`${'contact-fieldset'} ${focus === "name" ? "border-black transition-all duration-1000" : ""}`}>
                    <legend className={`${focus === 'name'? "makeBold": ""}`}>Name</legend>
                    <input type="text" placeholder='Name'
                        value={name}
                        onChange={(e)=>setName(e.target.value)}
                        onClick={()=>setFocus("name")}
                    />
                </fieldset>

                <fieldset className={`${'contact-fieldset'} ${focus === "mail" ? "border-black transition-all duration-1000" : ""}`}>
                    <legend className={`${focus === 'mail'? "makeBold": ""}`}>Mail</legend>
                    <input type="text" placeholder='Mail'
                        value={mail}
                        onChange={(e)=>setMail(e.target.value)}
                        onClick={()=>setFocus('mail')}
                    />
                </fieldset>

                <fieldset className={`${'contact-fieldset h-fit'} ${focus === "msg" ? "border-black transition-all duration-1000" : ""}`}>
                    <legend className={`${focus === 'msg'? "makeBold": ""}`}>Project</legend>
                    <textarea rows="5" placeholder='Write your project'
                        value={msg}
                        onChange={(e)=>setMsg(e.target.value)}
                        onClick={()=>setFocus("msg")}
                    ></textarea>
                </fieldset>

                <div onClick={()=>{
                    setFocus('');
                    setName('');
                    setMail('');
                    setMsg('');
                }} 
                        className='submit-message-project-btn'>
                    <p className='makeBold'>Send Message</p>
                    <FontAwesomeIcon icon={faPaperPlane}/>
                </div>
            </div>

        </div>
        </>
    )
}