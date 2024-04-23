import { useAPI } from '/src/api/API'
import { User } from '/src/models/User'
import { useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { userState } from '/src/recoil/userState';

export function useUserState() {
  const { request } = useAPI()
  const [user, _setUser] = useRecoilState(userState);
  const isSigned = useMemo(() => user !== null, [user])

  const setUser = (newUser) => {
    if (newUser instanceof User) _setUser(newUser)
    else if (newUser === null) _setUser(null)
    else {
      _setUser(new User(newUser.nickname, newUser.email, newUser.profileImage))
    }
  }

  // 현재 로그인한 사용자 정보를 가져옴
  const fetchCurrentUser = async () => {
    const response = await request('/user/info')

    setUser(response.data)
  }

  return {
    user,
    setUser,
    isSigned,
    fetchCurrentUser,
  }
}

// 예시
// const { user, setUser, isSigned, fetchCurrentUser } = useUserState()
