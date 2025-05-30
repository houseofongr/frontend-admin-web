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

export interface UserV2 {
  id: number;
  name: string;
  nickname: string;
  phoneNumber: string;
  email: string;
  registeredDate: number;
  termsOfUseAgreement: string;
  personalInformationAgreement: boolean;
  snsAccounts: UserSNSInfo[];
}