import './chatPage.scss'
import NewPrompt from '../../components/newPrompt/NewPrompt.jsx'
import { useQuery } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import Markdown from 'react-markdown'
import { IKImage } from 'imagekitio-react'

const ChatPage = () => {

  const path = useLocation().pathname;
  const chatId = path.split('/').pop();

  const { isPending, error, data: chatMessages } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,{
        credentials:"include"

      }).then((res) =>
        res.json(),
      ),
  })

  return (
    <div className='chatPage'>
      <div className="wrapper">
        <div className="chat">
          {isPending ? "Loading" : error ? "Something went wrong" : chatMessages?.history?.map((msg, i) => (
            <>
              {msg.img && (
                <IKImage
                  urlEndPoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                  path={msg.img}
                  height="300"
                  width="400"
                  transformation={[{height:300, width:400}]}
                  loading='lazy'
                  lqip={{active:true, quality:20}}
                />
              )}
            <div key={i} className={`${msg.role === 'user' ? 'message user' : 'message'}`}>
              <Markdown>{msg.parts[0].text}</Markdown>
            </div>
           </>
          ))}

          {/* <div className="message user">Test message from user</div> */}

          {chatMessages && <NewPrompt chatData={chatMessages}/>}
          {/* <div ref={endRef} /> */}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
