export default function DetailInfoStep() {
  return (
    <div className="min-w-[100px] w-[1000px]">
      <div className="text-xl font-semibold mb-4">세부정보 작성</div>
      <div className="flex h-[500px] border">
        <div className="flex flex-1 flex-col w-48 space-y-3">
          <div className="bg-amber-100 flex-2 flex items-center justify-center">
            썸네일
          </div>
          <div className="bg-amber-200 flex-1 flex items-center justify-center">
            썸뮤직
          </div>
        </div>

        <div className="flex flex-col flex-1 ml-4 space-y-3">
          <div className="flex-1 bg-amber-300 p-2">제목</div>
          <div className="flex-2 bg-amber-400 p-2">설명</div>
          <div className="flex-1 bg-amber-500 p-2">공개여부</div>
          <div className="flex-1 bg-amber-600 p-2">태그</div>
        </div>
      </div>
    </div>
  );
}
