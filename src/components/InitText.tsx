import { motion } from "framer-motion";

export default function InitText() {
  return (
    <motion.div initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: -30 }} transition={{ duration: 0.5 }}>
      <h2 className="text-center text-lg">모든 소리가 기록되는 곳,</h2>
      <h2 className="text-center text-lg">&apos;아카이브 오브 옹알&apos;에 오신 것을 환영해요!</h2>
    </motion.div>
  );
}
