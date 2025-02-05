import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import InitHouseImage from "../components/InitHouseImage";
import CustomInput from "../components/CustomInput";
import Footer from "../components/layout/Footer";
import Button from "../components/common/buttons/Button";

export default function LoginPage() {
  const [isAnimationComplete, setIsAnimationComplete] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const validateFormData = () => {
    return formData.username.length > 3 && formData.password.length > 3;
  };

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateFormData()) {
      navigate("/houses");
    } else {
      alert("틀렸어요! 다시 시도해주세요");

      setFormData({
        username: "",
        password: "",
      });
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
    <div className="h-screen flex justify-center items-center">
      <Header />
      <div className="flex justify-center items-center relative border h-full w-full">
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
              <Button
                label="확인"
                type="submit"
                disabled={formData.username.length === 0 || formData.password.length === 0}
              />
            </div>
          </motion.form>
        )}
      </div>
      <Footer />
    </div>
  );
}
