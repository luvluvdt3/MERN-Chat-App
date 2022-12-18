import React from 'react';
import { FaCaretSquareDown, FaEdit, FaSistrix } from "react-icons/fa";

//The hidden component hidden on the very right side, appear when click on the icon FaRocketchat in RightSide
const FriendInfo = ({ currentfriend, activeUser, message }) => {
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
                {
                    message && message.length > 0 ? message.map((m, index) => m.message.image && <img key={index} src={`./image/${m.message.image}`} />) : ''
                }
                {/* All the images exchanged between current user and current friend */}
            </div>

        </div>
    )
};

export default FriendInfo;