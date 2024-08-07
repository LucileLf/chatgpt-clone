import './homepage.scss'
import { Link } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { useState } from 'react'
const Homepage = () => {

  const [typingStatus, setTypingStatus] = useState("")

  return (
    <div className='homepage'>
      <img src="/orbital.png" alt="" className='orbital'/>
      <div className="left">
        <h1>Dabdoube</h1>
        <h2>blablabla</h2>
        <h3>bliblibloubliblibloublibliblou</h3>
        <Link to="/dashboard">Get started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot.png" alt="" className="bot"/>
          <div className="chat">
            <img src={typingStatus === "human1" ? '/human1.jpeg' : typingStatus === 'human2' ? '/human2.jpeg' : 'bot.png'} alt="" className=''/>
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                'Human: We produce food for Mice',
                2000, ()=>{
                  setTypingStatus("bot")
                },
                'Bot: We produce food for Hamsters',
                2000, ()=>{
                  setTypingStatus("human2")
                },
                'Human2: We produce food for Guinea Pigs',
                2000, ()=>{
                  setTypingStatus("bot")
                },
                'Bot: We produce food for Chinchillas',
                2000, ()=>{
                  setTypingStatus("human1")
                },
              ]}
              wrapper="span"
              speed={50}
              cursor={true}
              omitDeletionAnimation={true}
              // style={{ fontSize: '2em', display: 'inline-block' }}
              // repeat={Infinity}
            />
          </div>
        </div>

      </div>
      <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link>Terms of Service</Link>
          <span></span>
          <Link>Privacy Policy</Link>
        </div>
      </div>
    </div>
  )
}

export default Homepage
