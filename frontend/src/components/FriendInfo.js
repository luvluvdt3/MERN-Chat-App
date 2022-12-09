import React from 'react';
import { FaCaretSquareDown, FaEdit, FaSistrix } from "react-icons/fa";

const FriendInfo = ({ currentfriend, activeUser }) => {
    return (
        <div className='friend-info'>
            <input type="checkbox" id='gallery' />
            <div className='image-name'>
                <div className='image'>
                    <img src={`./image/${currentfriend.image}`} alt='' />
                </div>
                {
                    activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === currentfriend._id) ? <div className='active-user'>Online</div> : ''
                }

                <div className='name'>
                    <h4>{currentfriend.userName} </h4>
                </div>
            </div>


            <div className='others'>
                <div className='custom-chat'>
                    <h3>Coustomise Chat </h3>
                    <FaCaretSquareDown />
                </div>

                <div className='privacy'>
                    <h3>Privacy and Support </h3>
                    <FaCaretSquareDown />
                </div>

                <div className='media'>
                    <h3>Shared Media </h3>
                    <label htmlFor='gallery'> <FaCaretSquareDown /> </label>
                </div>
            </div>

            {/* Shared Medias */}
            <div className='gallery'>
                <img src='/image/photo.jpg' alt='' />
                <img src='/image/photo.jpg' alt='' />
            </div>

        </div>
    )
};

export default FriendInfo;