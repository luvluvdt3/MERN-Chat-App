import React from 'react';
import moment from 'moment';
import { FaRegCheckCircle } from "react-icons/fa";

//the friends list on the left
const Friends = (props) => {
    const { fndInfo, msgInfo } = props.friend;
    const myId = props.myId;
    // console.log(msgInfo.senderId);
    // console.log(myId)
    return (
        <div className='friend'>
            <div className='friend-image'>
                <div className='image'>
                    <img src={`./image/${fndInfo.image}`} alt='' />
                </div>
            </div>

            <div className='friend-name-seen'>
                <div className='friend-name'>
                    <h4>{fndInfo.userName}</h4>
                    <div className='msg-time'>
                        {
                            msgInfo && msgInfo.senderId === myId ? <span>You</span> : <span> {fndInfo.userName} </span>
                        }
                        {
                            msgInfo && msgInfo.message.text ? <span>{": " + msgInfo.message.text.slice(0, 10)} </span> : msgInfo && msgInfo.message.image ? <span> Sent An image </span> : <span>connected to you </span>
                        }
                        <span>{msgInfo ? moment(msgInfo.createdAt).startOf('mini').fromNow() : moment(fndInfo.createdAt).startOf('mini').fromNow()}</span>
                    </div>
                </div>

                {
                    // if current user is the sender
                    myId === msgInfo?.senderId
                        ?
                        <div className='seen-unseen-icon'>
                            {
                                //if current user has read the message
                                msgInfo.status === 'seen'
                                    ?
                                    <img src={`./image/${fndInfo.image}`} alt='' />
                                    :
                                    msgInfo.status === 'delivared'
                                        ? <div className='delivared'> <FaRegCheckCircle /> </div>
                                        :
                                        <div className='unseen'> </div>
                            }

                        </div>
                        :
                        // if current user hasnt read the message yet
                        <div className='seen-unseen-icon'>
                            {
                                msgInfo?.status !== undefined && msgInfo?.status !== 'seen' ? <div className='seen-icon'> </div> : ''
                            }
                        </div>
                }


            </div>

        </div>
    )
};

export default Friends;