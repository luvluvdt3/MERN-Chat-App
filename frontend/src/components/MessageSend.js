import React from 'react';
import { FaPlusCircle, FaFileImage, FaGift, FaPaperPlane } from "react-icons/fa";
import InputEmoji from "react-input-emoji";

const MessageSend = ({ inputHendle, newMessage, sendMessage, emojiSend, ImageSend, themeMood}) => {
    return (

        <div className='message-send-section'>
            <input type="checkbox" id='emoji' />
            <div className='file hover-attachment'>
                <div className='add-attachment'>
                    Add Attachment
                </div>
                <FaPlusCircle />
            </div>

            <div className='file hover-image'>
                <div className='add-image'>
                    Add Image
                </div>
                {/* Input for pic, which is supported by label htmlFor pic down here */}
                <input onChange={ImageSend} type="file" id="pic" className='form-control' />

                <label htmlFor='pic'> <FaFileImage /> </label>
            </div>

            <div className='file hover-gift'>
                <div className='add-gift'>
                    Add gift
                </div>
                <FaGift />
            </div>

            <div className='message-type'>
                <InputEmoji
                    value={newMessage}
                    onChange={(e)=>inputHendle(e)}
                    placeholder="Type a message"
                    onEnter={()=>sendMessage()}
                    name='message' id='message' className='form-control'
                    theme = {themeMood}
                    borderColor="#a189f0"
                />
            </div>

            <div onClick={sendMessage} className='file'>
                <FaPaperPlane />
            </div>
        </div>

    )
};

export default MessageSend;