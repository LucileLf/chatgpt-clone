import { useEffect, useRef } from 'react'
import './newPrompt.scss'
import Upload from '../upload/Upload'
import { useState } from 'react';
import { IKImage } from 'imagekitio-react';
import model from "../../lib/gemini"
import Markdown from 'react-markdown'

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;


const NewPrompt = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const [img, setImg] = useState({
    isLoading:false,
    error:"",
    dbData:{}
  })

  const endRef= useRef(null)

  useEffect(()=> {
    endRef.current.scrollIntoView({behavior: 'smooth'})
  }, [question, answer, img])

  const add = async (text) => {
    setQuestion(text);
    const result = await model.generateContent(text);
    const response = await result.response;
    setAnswer(response.text)
    // console.log(text);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text)
  }

  return (
    <>
    {/* ADD NEW CHAT */}
    {img.isLoading && <div className=''>Loading...</div>}
    {img.dbData?.filePath && (
      <IKImage
        urlEndpoint={urlEndpoint}
        path={img.dbData?.filePath}
        width="380"
        transformation={[{width: 380}]}
      />
    )}
      {/* <button onClick={add}> TEST AI</button> */}
      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message'><Markdown>{answer}</Markdown></div>}

      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit}>
        {/* <label htmlFor="file">
          <img src="/attachment.png" alt="" />
        </label> */}
        <Upload setImg={setImg}/>
        <input id="file" type="file" multiple={false} hidden/>
        <input type="text" placeholder="Ask anything..." name='text'/>
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  )
}

export default NewPrompt
