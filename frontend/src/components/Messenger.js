import React, { useEffect, useState, useRef } from 'react';
import { FaEllipsisH, FaEdit, FaSistrix, FaSignOutAlt } from "react-icons/fa";
import ActiveFriend from './ActiveFriend';
import Friends from './Friends';
import RightSide from './RightSide';
import { useDispatch, useSelector } from 'react-redux';
import { getFriends, messageSend, getMessage, ImageMessageSend, seenMessage, updateMessage, getTheme, themeSet } from '../store/actions/messengerAction';
import { io } from 'socket.io-client'
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';
import notificationSound from '../audio/notification.mp3';
import sendingSound from '../audio/sending.mp3';
import { userLogout } from '../store/actions/authAction';

const Messenger = () => {
    const scrollRef = useRef();
    const socket = useRef();
    // console.log(socket) //current: Socket {connected: true, receiveBuffer: Array(0),...

    const [notificationSPlay] = useSound(notificationSound);
    const [sendingSPlay] = useSound(sendingSound);

    const { friends, message, mesageSendSuccess, message_get_success, themeMood, new_user_add } = useSelector(state => state.messenger);

    const { myInfo } = useSelector(state => state.auth);

    const [currentfriend, setCurrentFriend] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [activeUser, setActiveUser] = useState([]);
    const [socketMessage, setSocketMessage] = useState('');
    const [typingMessage, setTypingMessage] = useState('');

    useEffect(() => {
        socket.current = io('ws://localhost:8000') //not http protocol, but ws
        socket.current.on('getMessage', (data) => { //listen to event  when current user in online and just got new message of another user
            console.log(data) //message, receiverId, senderId sent by socket 
            setSocketMessage(data);
        })
    }, [])

    useEffect(() => {
        dispatch(getTheme());
    }, []);

    //if receive message from an online friend while online -> save the message's infos into redux
    useEffect(() => {
        if (socketMessage && currentfriend) { //sender's side
            if (socketMessage.senderId === currentfriend._id && socketMessage.reseverId === myInfo.id) {
                dispatch({
                    type: 'SOCKET_MESSAGE',
                    payload: {
                        message: socketMessage
                    }
                })

                dispatch(seenMessage(socketMessage));
                socket.current.emit('messageSeen', socketMessage);

                //update the lastest messages in receiver's side
                dispatch({
                    type: 'UPDATE_FRIEND_MESSAGE',
                    payload: {
                        msgInfo: socketMessage,
                        status: 'seen'
                    }
                })
            }
        }
        setSocketMessage('') //make local state of socketMessage back to empty, so it only update once, not for internity lol
    }, [socketMessage]); //update every time socketMessage changes (in this case, changed by event getMessage)

    useEffect(() => { //send user's data to socket
        socket.current.emit('addUser', myInfo.id, myInfo)
    }, []); //custom event called AddUser with 2 datas passed to the socket

    useEffect(() => {
        if (mesageSendSuccess) {
            socket.current.emit('sendMessage', message[message.length - 1]);
            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: message[message.length - 1]
                }
            })
            dispatch({
                type: 'MESSAGE_SEND_SUCCESS_CLEAR'
            })
        }
    }, [mesageSendSuccess]);

    useEffect(() => {
        //listen to updating users list from socket
        socket.current.on('getUser', (users) => {
            //console.log(users) //all active users
            const filterUser = users.filter(u => u.userId !== myInfo.id) //filter out the current user's self out of the list lol
            setActiveUser(filterUser);
        })
        //listen to typing mesage event 
        socket.current.on('typingMessageGet', (data) => {
            setTypingMessage(data);
        })

        socket.current.on('msgSeenResponse', msg => {
            dispatch({
                type: 'SEEN_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })

        socket.current.on('msgDelivaredResponse', msg => {
            dispatch({
                type: 'DELIVARED_MESSAGE',
                payload: {
                    msgInfo: msg
                }
            })
        })

        socket.current.on('seenSuccess', data => { //listen to seen message event from socket
            dispatch({
                type: 'SEEN_ALL',
                payload: data
            })
        })

        //listens to event called new_user_add from socket
        socket.current.on('new_user_add', data => {
            dispatch({
                type: 'NEW_USER_ADD',
                payload: {
                    new_user_add: data
                }
            })
        })
    }, []);

    useEffect(() => { //everytime that receiver sees a new message
        if (message.length > 0) {
            if (message[message.length - 1].senderId !== myInfo.id && message[message.length - 1].status !== 'seen') { //check that user is receiver and the message in database is not yet "seen"
                dispatch({
                    type: 'UPDATE', //activate every time currentfriend changes
                    payload: {
                        id: currentfriend._id
                    }
                })
                socket.current.emit('seen', { senderId: currentfriend._id, reseverId: myInfo.id }) //send the seen message info to socket
                dispatch(seenMessage({ _id: message[message.length - 1]._id })) //use seenMessage action to update the lastest message's status in the database into "seen"
            }
        }
        dispatch({
            type: 'MESSAGE_GET_SUCCESS_CLEAR' //update message_get_success as false 
        })
    }, [message_get_success]);

    const inputHendle = (e) => {
        setNewMessage(e);
        //send event of typing message to the socket 
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: e
        })
    }

    const sendMessage = () => {
        // console.log(newMessage);
        sendingSPlay();
        const data = {
            senderName: myInfo.userName, //why not id though?
            reseverId: currentfriend._id, //receiver is current friend's id (just in case he wont change it)
            message: newMessage ? newMessage : '???' //if its empty then send the heart. hmm cute
        }

        //put this in the useEffect messageSendSuccess instead
        //pass new message to socket for realtime chat
        // socket.current.emit('sendMessage', {
        //     senderId: myInfo.id,
        //     senderName: myInfo.userName,
        //     reseverId: currentfriend._id,
        //     time: new Date(),
        //     message: {
        //         text: newMessage ? newMessage : '???',
        //         image: ''
        //     }
        // })

        //send to socket to show that the message is now empty-> no more typing... since the send action doesnt trigger the typingMessage event on its own
        socket.current.emit('typingMessage', {
            senderId: myInfo.id,
            reseverId: currentfriend._id,
            msg: ''
        })
        dispatch(messageSend(data));
        setNewMessage('') //delete the remaining message in the message box when done
    }

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getFriends()); //execute the function
        dispatch({ type: 'NEW_USER_ADD_CLEAR' })
    }, [new_user_add]); //every time new_user_add changes(meaning the socket triggered the event of newly registered user just logged in) -> reload the friends list then empty new_user_add state 

    useEffect(() => { //can have more than 1 useEffect
        if (friends && friends.length > 0)
            setCurrentFriend(friends[0].fndInfo)  //display first friend at the beginning
    }, [friends]);

    useEffect(() => {
        dispatch(getMessage(currentfriend._id));
        if (friends.length > 0) { //if this user has friend

        }
    }, [currentfriend?._id]); //will get updated automatically every time current friend changes (I love u, useEffect)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' }) // put the new message into the view by pushing older messages up 
    }, [message]);

    //if receive a message while in the chatbox with another friend -> receive notification with toast
    useEffect(() => {
        if (socketMessage && socketMessage.senderId !== currentfriend._id && socketMessage.reseverId === myInfo.id) { //receiver's side
            notificationSPlay();
            toast.success(`${socketMessage.senderName} just sent you a message!`)
            dispatch(updateMessage(socketMessage))
            socket.current.emit('delivaredMessage', socketMessage);

            dispatch({
                type: 'UPDATE_FRIEND_MESSAGE',
                payload: {
                    msgInfo: socketMessage,
                    status: 'delivared'
                }
            })
        }
    }, [socketMessage]);

    const ImageSend = (e) => {
        if (e.target.files.length !== 0) {
            sendingSPlay();
            const imagename = e.target.files[0].name;
            const newImageName = Date.now() + imagename;

            //send Image in reel time to socket
            socket.current.emit('sendMessage', {
                senderId: myInfo.id,
                senderName: myInfo.userName,
                reseverId: currentfriend._id,
                time: new Date(),
                message: {
                    text: '',
                    image: newImageName
                }
            })

            const formData = new FormData();

            formData.append('senderName', myInfo.userName);
            formData.append('imageName', newImageName);
            formData.append('reseverId', currentfriend._id);
            formData.append('image', e.target.files[0]);
            dispatch(ImageMessageSend(formData));
        }
    }

    const GIFSend = (e) => {
        sendingSPlay();
        //   'https://media.giphy.com/media/' + id + 'giphy.gif'               
        const imagename = 'https://media.giphy.com/media/'+e.id+'/giphy.gif';
        //send Image in reel time to socket
        socket.current.emit('sendMessage', {
            senderId: myInfo.id,
            senderName: myInfo.userName,
            reseverId: currentfriend._id,
            time: new Date(),
            message: {
                text: '',
                image: imagename
            }
        })

        const formData = new FormData();

        formData.append('senderName', myInfo.userName);
        formData.append('imageName', imagename);
        formData.append('reseverId', currentfriend._id);
        formData.append('image', imagename);
        dispatch(ImageMessageSend(formData));
    }

    const [hide, setHide] = useState(true);

    const logout = () => {
        dispatch(userLogout());
        socket.current.emit('logout', myInfo.id);
    }

    const search = (e) => {
        const getFriendClass = document.getElementsByClassName('hover-friend'); //get all the container of each friend in the friends list (which contains child component Friends)
        const frienNameClass = document.getElementsByClassName('Fd_name'); //get the containers of all friends names div (can be found in child component Friends)
        for (var i = 0; i < getFriendClass.length, i < frienNameClass.length; i++) {
            let text = frienNameClass[i].innerText.toLowerCase();
            if (text.indexOf(e.target.value.toLowerCase()) > -1) {
                getFriendClass[i].style.display = '';
            } else {
                getFriendClass[i].style.display = 'none';
            }
        }//loop through every container in friends list, if the name of the friend matchs value of event(input of friend search) then still display it, else then not displayed
    }

    return (
        <div className={themeMood === 'dark' ? 'messenger theme' : 'messenger'}>
            {/* if theme==dark then the whole stuff is in dark mode with class .messenger.theme , if not then just normal mode  */}
            <Toaster
                position={'top-right'}
                reverseOrder={false}
                toastOptions={{
                    style: {
                        fontSize: '18px'
                    }
                }}
            />
            <div className='row'>
                <div className='col-3'>
                    <div className='left-side'>
                        <div className='top'>
                            <div className='image-name'>
                                <div className='image'>
                                    <img src={`./image/${myInfo.image}`} alt='' />
                                    {/* way to call a photo in /public/images */}
                                </div>
                                <div className='name'>
                                    <h3>{myInfo.userName} </h3>
                                </div>
                            </div>

                            <div className='icons'>
                                <div onClick={() => setHide(!hide)} className='icon'>
                                    <FaEllipsisH />
                                </div>
                                <div className='icon'>
                                    <FaEdit />
                                </div>
                                <div className={hide ? 'theme_logout' : 'theme_logout show'}>
                                    <h3>Dark Mode </h3>
                                    <div className='on'>
                                        <label htmlFor='dark'>ON</label>
                                        <input onChange={(e) => dispatch(themeSet(e.target.value))} type="radio" value="dark" name="theme" id="dark" />
                                        {/* Turn on/off dark mode */}

                                    </div>

                                    <div className='of'>
                                        <label htmlFor='white'>OFF</label>
                                        <input onChange={(e) => dispatch(themeSet(e.target.value))} type="radio" value="white" name="theme" id="white" />
                                        {/* Turn on/off normal mode */}
                                    </div>

                                    <div onClick={logout} className='logout'>
                                        <FaSignOutAlt /> Logout
                                    </div>



                                </div>
                            </div>
                        </div>

                        <div className='friend-search'>
                            <div className='search'>
                                <button> <FaSistrix /> </button>
                                <input onChange={search} type="text" placeholder='Search' className='form-control' />
                            </div>
                        </div>

                        {/* The small vertial scroll list of active friends */}
                        <div className='active-friends'>
                            {
                                activeUser && activeUser.length > 0 ? activeUser.map(u => <ActiveFriend setCurrentFriend={setCurrentFriend} user={u} />) : ''
                            }

                        </div>

                        <div className='friends'>
                            {
                                friends && friends.length > 0 ? friends.map((fd) => <div onClick={() => setCurrentFriend(fd.fndInfo)} className={currentfriend._id === fd.fndInfo._id ? 'hover-friend active' : 'hover-friend'}>
                                    {/* if is current friend that user is looking at -> class=hover-friend-active. which gives it gray background */}
                                    <Friends myId={myInfo.id} friend={fd} activeUser={activeUser} />
                                </div>) : 'No Friend'
                            }
                            {/* If there is friend then show them though component Friends, if not show text "No Friend" */}
                            {/* If click on the user-> set current friend */}
                        </div>
                    </div>
                </div>
                {
                    currentfriend ? <RightSide
                        currentfriend={currentfriend}
                        inputHendle={inputHendle}
                        newMessage={newMessage}
                        sendMessage={sendMessage}
                        message={message}
                        scrollRef={scrollRef}
                        ImageSend={ImageSend}
                        activeUser={activeUser}
                        typingMessage={typingMessage}
                        GIFSend={GIFSend}
                    /> : 'Please Select your Friend'
                }
                {/* if not choose a friend yet then display "Plese Select Ur Friend" else: display RightSide*/}
            </div>

        </div>
    )
};

export default Messenger;