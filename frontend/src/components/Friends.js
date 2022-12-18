import React from 'react';
import moment from 'moment';
import { FaRegCheckCircle } from "react-icons/fa";

//the friends list on the left
const Friends = (props) => {
    const { fndInfo, msgInfo } = props.friend;
    const myId = props.myId;
    const { activeUser } = props;
    // console.log(msgInfo.senderId);
    // console.log(myId)
    return (
        <div className='friend'>
            <div className='friend-image'>
                <div className='image'>
                    <img src={`./image/${fndInfo.image}`} alt='' />
                    {/* if is online -> have the green dot */}
                    {
                        activeUser && activeUser.length > 0 && activeUser.some(u => u.userId === fndInfo._id) ? <div className='active_icon'></div> : ''
                    }
                </div>
            </div>

            <div className='friend-name-seen'>
                <div className='friend-name'>
                    <h4 className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message Fd_name ' : 'Fd_name'} >{fndInfo.userName}</h4>
                    {/* if there is a new unread message from a friend-> the friend's name would be in bold (unseen_message css) */}

                    <div className='msg-time'>
                        {
                            msgInfo && msgInfo.senderId === myId ? <span>You: </span> : <span className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message ' : ''}> {fndInfo.userName + ': '} </span>
                        }

                        {
                            msgInfo && msgInfo.message.text ? <span className={msgInfo?.senderId !== myId && msgInfo?.status !== undefined && msgInfo.status !== 'seen' ? 'unseen_message ' : ''}>{msgInfo.message.text.slice(0, 10)}</span> : msgInfo && msgInfo.message.image ? <span>Sent An Image </span> : <span>Connected To You </span>
                        }
                        {/* Message's Content */}
                        <br />

                        <span>{msgInfo ? moment(msgInfo.createdAt).startOf('mini').fromNow() : moment(fndInfo.createdAt).startOf('mini').fromNow()}</span>
                        {/* Message's Time (ex: 2 hours ago)  */}
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