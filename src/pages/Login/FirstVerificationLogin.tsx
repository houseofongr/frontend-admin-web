import React, { useCallback, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import InitHouseImage from "../../components/InitHouseImage";
import CustomInput from "../../components/CustomInput";
import { IoAlertCircleOutline } from "react-icons/io5";
import LoginButton from "../../components/common/buttons/LoginButton";
import API_CONFIG from "../../config/api";

export default function FirstVerificationLogin() {
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState<string>("");

  // const navigate = useNavigate();

  // 프론트 검증
  const validateFormData = () => {
    setMessage("");

    if (formData.username.length < 5) {
      setMessage("아이디는 5자 이상이어야 합니다!");
      return false;
    }

    const password = formData.password;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!(hasLetter && hasNumber && hasSpecialChar)) {
      setMessage("비밀번호는 문자, 숫자, 특수문자를 모두 포함해야 합니다.");
      return false;
    }

    return true;
  };

  const formSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const requestBody = new URLSearchParams({
      username: formData.username,
      password: formData.password,
    }).toString();

    console.log("Request Body:", requestBody);
    // navigate("/login/2nd"); // 2차 관리자 검증 페이지로 이동

    try {
      const response = await fetch(`${API_CONFIG.BACK_API}/authn/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestBody,
        // redirect: "manual", //fetch가 자동 리다이렉트 하지 않도록 설정
      });

      // 백에서 리다이렉트 처리:  성공 시 메인 페이지, 실패 시 로그인 페이지

      // if (response.status === 302) {
      //   const location = response.headers.get("Location");
      //   console.log("Redirect Location:", location);
      //   // navigate("/houses");
      //   if (location) {
      //     window.location.href = location;
      //   }
      // } else {
      if (!response.ok) {
        setMessage("로그인에 실패했습니다. 관리자가 맞나요?");
        setFormData({
          username: "",
          password: "",
        });
      }
      // }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const onChangeHandler = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  return (
    <div className="flex-center relative border h-full w-full">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: -100 }}
        transition={{
          duration: 0.7,
        }}
        onAnimationComplete={() => setIsAnimationComplete(true)}
      >
        <InitHouseImage />
      </motion.div>

      {isAnimationComplete && (
        <motion.form
          onSubmit={formSubmitHandler}
          initial={{ opacity: 0, y: 180 }}
          animate={{ opacity: 1, y: 120 }}
          transition={{ duration: 0.7 }}
          className="absolute z-10 flex-center flex-col gap-2"
        >
          {message && (
            <div className="transition-colors duration-300 text-red-500 text-sm mt-2 px-2 bg-red-100 flex items-center gap-0.5 ">
              <IoAlertCircleOutline />
              <p>{message}</p>
            </div>
          )}
          <CustomInput
            label="아이디"
            name="username"
            value={formData.username}
            elType="input"
            onChange={onChangeHandler}
          />
          <CustomInput
            label="패스워드"
            name="password"
            type="password"
            elType="input"
            value={formData.password}
            onChange={onChangeHandler}
          />
          <div className="mt-4">
            <LoginButton
              label="확인"
              type="submit"
              disabled={formData.username.length === 0 || formData.password.length === 0}
            />
          </div>
        </motion.form>
      )}
    </div>
  );
}
