import { LastMessage } from './../model/lastmessage.interface';
import { PROFILE_LIST } from './profile.mockup';

const lastMsgList: LastMessage[] = [
    {
        user: PROFILE_LIST[0],
        date: new Date(),
        lastMessage: "How are you?"
    },
    {
        user: PROFILE_LIST[1],
        date: new Date(),
        lastMessage: "Really?"
    },
    {
        user: PROFILE_LIST[2],
        date: new Date(),
        lastMessage: "Okay, take care~"
    }
];

// PROFILE_LIST.forEach( profile => {
//     lastMsgList.push( 
//         {
//             user: profile,
//             date: new Date(),
//             lastMessage: profile.firstName+", how are you?"
//         }
//     )
// });

export const LASTMSG_LIST = lastMsgList;