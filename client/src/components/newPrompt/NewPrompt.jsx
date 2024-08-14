import { useEffect, useRef } from 'react'
import './newPrompt.scss'
import Upload from '../upload/Upload'
import { useState } from 'react';
import { IKImage } from 'imagekitio-react';
import model from "../../lib/gemini"
import Markdown from 'react-markdown'
import { useMutation, useQueryClient } from "@tanstack/react-query"

const NewPrompt = ({chatData}) => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const [img, setImg] = useState({
    isLoading:false,
    error:"",
    dbData: {},
    aiData: {}
  })

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello, I have 2 dogs in my house." }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 100,
    },
  });

  const endRef= useRef(null)
  const formRef= useRef(null)

  useEffect(()=> {
    endRef.current.scrollIntoView({behavior: 'smooth'})
  }, [chatData, question, answer, img.dbData])

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn:  ()=>{
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatData._id}`, {
        method:"PUT",
        credentials: "include",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined
        }) // text:text
      }).then(res=>res.json())
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['chat', chatData._id] })
      .then(()=>{
        // reset form ref
        formRef.current.reset()
        //reset answer, question, image
        setQuestion("")
        setAnswer("")
        setImg({
          isLoading:false,
          error:"",
          dbData: {},
          aiData: {}
        });
      });
    },
    onError:(err)=> {
      console.error(err);
    },
  });


  const add = async (text, isInitial) => {
    if(!isInitial) setQuestion(text);
    try {
      // get result from ai
      const result = await chat.sendMessageStream(Object.entries(img.aiData).length ? [img.aiData, text] : [text]);
      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      // run function to update data in db + invalidate single chat
      mutation.mutate();
    }catch(err){
      console.log(err);
    }

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false)
  }

  // NOT NEEDED FOR PRODUCTION
  const hasRun = useRef(false)

  useEffect(()=>{
    if(!hasRun.current){
      //if only one message, generate answer and send to db
      if (chatData?.history?.length === 1) {
        add(chatData.history[0].parts[0].text, true);
      }
    }
    hasRun.current=true;
  }, [])

  return (
    <>
    {/* ADD NEW CHAT */}
    {img.isLoading && <div className=''>Loading...</div>}
    {img.dbData?.filePath && (
      <IKImage
        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
        path={img.dbData?.filePath}
        width="380"
        transformation={[{width: 380}]}
      />
    )}
      {/* <button onClick={add}> TEST AI</button> */}
      {question && <div className='message user'>{question}</div>}
      {answer && <div className='message'><Markdown>{answer}</Markdown></div>}

      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
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
