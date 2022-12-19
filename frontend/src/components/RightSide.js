import React from 'react';
import { FaPhoneAlt, FaVideo, FaRocketchat } from "react-icons/fa";
import Message from './Message';
import MessageSend from './MessageSend';
import FriendInfo from './FriendInfo';

// The remaining part of the screen except for the left part of friends list 
const RightSide = (props) => {
    const { currentfriend, inputHendle, newMessage, sendMessage, message, scrollRef, ImageSend, activeUser, typingMessage, themeMood } = props;//can change message state of Messenger from this component
    return (
        <div className='col-9'>
            <div className='right-side'>
                {/* (To be the base for the icon FaRocketchat  to open/close user's information below) */}
                <input type="checkbox" id='dot' />
                <div className='row'>
                    <div className='col-8'>
                        <div className='message-send-show'>
                            <div className='header'>
                                <div className='image-name'>
                                    <div className='image'>
                                        <img src={`./image/${currentfriend.image}`} alt='' />
                                        {
                                            // if is online then have the small green dot
                                            activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ? <div className='active-icon'></div> : ''
                                        }
                                    </div>
                                    <div className='name'>
                                        <h3> {currentfriend.userName} </h3>
                                    </div>
                                </div>

                                <div className='icons'>
                                    <div className='icon'>
                                        <FaPhoneAlt />
                                    </div>

                                    <div className='icon'>
                                        <FaVideo />
                                    </div>

                                    <div className='icon'>
                                        <label htmlFor='dot'>
                                            {/* htmlFor dot so that if click-> appear the User's information on the right, reclick->close it (defined in _rightSide.scss) */}
                                            <FaRocketchat />
                                        </label>
                                    </div>

                                </div>
                            </div>
                            <Message
                                message={message}
                                currentfriend={currentfriend}
                                scrollRef={scrollRef}
                                typingMessage={typingMessage}
                            />
                            <MessageSend
                                inputHendle={inputHendle}
                                newMessage={newMessage}
                                sendMessage={sendMessage}
                                ImageSend={ImageSend}
                                themeMood={themeMood}
                            />
                        </div>
                    </div>

                    <div className='col-4'>
                        <FriendInfo message={message} currentfriend={currentfriend} activeUser={activeUser} />
                    </div>


                </div>
            </div>
        </div>
    )
};

export default RightSide;