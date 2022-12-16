import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaRegCheckCircle } from "react-icons/fa";

const Message = ({ message, currentfriend, scrollRef, typingMessage }) => {
    const { myInfo } = useSelector(state => state.auth);
    return (
        <>
            <div className='message-show'>
                {
                    message && message.length > 0 ? message.map((m, index) =>
                        // if its the user who sent the message
                        m.senderId === myInfo.id ? <div ref={scrollRef} className='my-message'>
                            <div className='image-message'>
                                <div className='my-text'>
                                    <p className='message-text'> {m.message.text === '' ? <img src={`./image/${m.message.image}`} /> : m.message.text} </p>
                                    {/* If message is text then display the text, if not, show the photo message getting from the Redux state*/}
                                    {
                                        index === message.length - 1 && m.senderId === myInfo.id ? m.status === 'seen' ? <img className='img' src={`./image/${currentfriend.image}`} alt='' /> : m.status === 'delivared' ? <span> <FaRegCheckCircle /> </span> : <span> <FaRegCheckCircle /> </span> : ''
                                    }
                                    {/* If the lastest message( is sent by current user) is delivered -> have the round check mark, if seen-> have the round avatar of receiver */}
                                </div>
                            </div>
                            <div className='time'>
                                {moment(m.createdAt).startOf('mini').fromNow()}
                            </div>
                        </div>
                            : //if its the friend who sent it
                            <div ref={scrollRef} className='fd-message'>
                                <div className='image-message-time'>
                                    <img src={`./image/${currentfriend.image}`} alt='' />
                                    <div className='message-time'>
                                        <div className='fd-text'>
                                            <p className='message-text'> {m.message.text === '' ? <img src={`./image/${m.message.image}`} /> : m.message.text} </p>
                                        </div>
                                        <div className='time'>
                                            {moment(m.createdAt).startOf('mini').fromNow()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                    )
                        : //if no message -> picture + ABC connected to you 3 months ago
                        <div className='friend_connect'>
                            <img src={`./image/${currentfriend.image}`} alt='' />
                            <h3>{currentfriend.userName} Connected To You </h3>
                            <span> {moment(currentfriend.createdAt).startOf('mini').fromNow()} </span>
                        </div>
                }
            </div>

            { //if the friend is typing message in real time then show "abc Typing Message..." else leave it empty
                typingMessage && typingMessage.msg && typingMessage.senderId === currentfriend._id ? <div className='typing-message'>
                    <div className='fd-message'>
                        <div className='image-message-time'>
                            <img src={`./image/${currentfriend.image}`} alt='' />
                            <div className='message-time'>
                                <div className='fd-text'>
                                    <p className='time'>Typing Message.... </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> : ''
            }
        </>
    )
};

export default Message;