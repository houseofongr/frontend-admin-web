export interface UserSNSInfo {
  domain: "KAKAO" | "NAVER";
  email: "string";
}

export interface User {
  id: number;
  realName: string;
  nickName: string;
  phoneNumber: string;
  registeredDate: string;
  snsAccounts: UserSNSInfo[];
}

export interface UserHome {
  id: number;
  title: string;
  author: string;
  description: string;
  createdDate: string;
  updatedDate: string;
}
