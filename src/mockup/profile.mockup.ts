import {Profile} from '../model/profile.interface';

const profileList: Profile[] = [
    {
        firstName: 'A',
        lastName: 'a',
        email: 'a@a.com',
        avatar:'assets/imgs/avatar.png',
        status: 'A',
        phonenumber: '010-1111-1111'
    },
    {
        firstName: 'B',
        lastName: 'b',
        email: 'b@b.com',
        avatar:'assets/imgs/avatar.png',
        status: 'B',
        phonenumber: '010-2222-2222' 
    },
    {
        firstName: 'Seowoo',
        lastName: 'Park',
        email: 'swpark@gmail.com',
        avatar:'assets/imgs/avatar.png',
        status: 'I am happy',
        phonenumber: '010-4383-9975' 
    },
];

export const PROFILE_LIST = profileList;
