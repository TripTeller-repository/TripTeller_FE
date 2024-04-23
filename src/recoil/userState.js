import { atom } from 'recoil';
import { RECOIL_KEYS } from './consts'
// eslint-disable-next-line no-unused-vars
import { User } from '/src/models/User'



export const userState = atom({
  key: RECOIL_KEYS.USER,
  /**
   * User 객체
   * 로그인한 경우 User 객체가 있고
   * 로그인이 안되있는 경우 null임
   * 
   * @type {User}
   * */
  default: null, // new User('', '', '/img/profile_default.webp')
});
