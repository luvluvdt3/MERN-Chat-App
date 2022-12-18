import { FRIEND_GET_SUCCESS, MESSAGE_GET_SUCCESS, MESSAGE_SEND_SUCCESS, SOCKET_MESSAGE, UPDATE_FRIEND_MESSAGE, MESSAGE_SEND_SUCCESS_CLEAR, SEEN_MESSAGE, DELIVARED_MESSAGE, UPDATE, MESSAGE_GET_SUCCESS_CLEAR, SEEN_ALL } from "../types/messengerType";

const messengerState = {
    friends: [],
    message: [],
    mesageSendSuccess: false,
    message_get_success: false,
    themeMood: ''
}

export const messengerReducer = (state = messengerState, action) => {
    const { type, payload } = action;
    if (type === FRIEND_GET_SUCCESS) {
        return {
            ...state,
            friends: payload.friends
        }
    }

    if (type === MESSAGE_GET_SUCCESS) { //when receiver sees the message

        return {
            ...state,
            message_get_success: true,
            message: payload.message
        }
    }

    if (type === MESSAGE_SEND_SUCCESS) {
        return {
            ...state,
            mesageSendSuccess: true,
            message: [...state.message, payload.message] //add the message that the user just sent to the local state after succeedding uploading it to database
        }
    }

    //when another onl user send current onl user a message
    if (type === SOCKET_MESSAGE) {
        return {
            ...state,
            message: [...state.message, payload.message] // adding the new message to state message saved in Redux -> update the messages automatically in reel time
        }
    }

    if (type === UPDATE_FRIEND_MESSAGE) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.msgInfo.reseverId || f.fndInfo._id === payload.msgInfo.senderId);
        state.friends[index].msgInfo = payload.msgInfo;
        state.friends[index].msgInfo.status = payload.status;
        return state;
    }

    if (type === MESSAGE_SEND_SUCCESS_CLEAR) {
        return {
            ...state,
            mesageSendSuccess: false
        }
    }

    if (type === SEEN_MESSAGE) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.msgInfo.reseverId || f.fndInfo._id === payload.msgInfo.senderId);
        state.friends[index].msgInfo.status = 'seen';
        return {
            ...state
        };
    }

    if (type === DELIVARED_MESSAGE) {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.msgInfo.reseverId || f.fndInfo._id === payload.msgInfo.senderId);
        state.friends[index].msgInfo.status = 'delivared';
        return {
            ...state
        };
    }

    if (type === UPDATE) { //gets UPDATE request from Messenger everytime currentfriend changes and if there is any new message from this friend-> mark it as seen -> no more blue dot
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.id);
        if (state.friends[index].msgInfo) {
            state.friends[index].msgInfo.status = 'seen';
        }
        return {
            ...state
        }
    }

    if (type === MESSAGE_GET_SUCCESS_CLEAR) {
        return {
            ...state,
            message_get_success: false
        }
    }

    if (type === 'SEEN_ALL') {
        const index = state.friends.findIndex(f => f.fndInfo._id === payload.reseverId); //find the friend that received and has seen your message
        state.friends[index].msgInfo.status = 'seen'; //update the message as seen
        return {
            ...state
        }
    }

    if (type === 'THEME_GET_SUCCESS' || type === 'THEME_SET_SUCCESS') {
        return {
            ...state,
            themeMood: payload.theme
        }
    }
    return state;
}