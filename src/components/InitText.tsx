import { motion } from "framer-motion";

export default function InitText() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: -30 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center text-sm md:text-[20px]">
        시간을 담는 소리의 집,
      </h2>
      <h2 className="text-center text-sm md:text-[20px]">
        &apos;하우스 오브 옹알&apos;에 오신 걸 환영해요!
      </h2>
    </motion.div>
  );
}
