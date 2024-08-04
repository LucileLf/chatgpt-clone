import { useEffect, useRef } from 'react'
import './newPrompt.scss'
import Upload from '../upload/Upload'
import { useState } from 'react';

import { IKImage } from 'imagekitio-react';

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;


const NewPrompt = () => {
  const [img, setImg] = useState({
    isLoading:false,
    error:"",
    dbData:{}
  })

  const endRef= useRef(null)

  useEffect(()=> {
    endRef.current.scrollIntoView({behavior: 'smooth'})
  }, [])

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
    <div className="endChat" ref={endRef}>
    </div>

      <form className="newForm">
        {/* <label htmlFor="file">
          <img src="/attachment.png" alt="" />
        </label> */}
        <Upload setImg={setImg}/>
        <input id="file" type="file" multiple={false} hidden/>
        <input type="text" placeholder="Ask anything..."/>
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  )
}

export default NewPrompt
