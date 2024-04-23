export class User {

  constructor(nickname, email, profileImage = null) {
    this.nickname = nickname || '';
    this.email = email || '';
    this.profileImage = profileImage || '';
  }
}
