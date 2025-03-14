import { RiPlayListFill } from "react-icons/ri";

export default function NoDataNotice() {
  return (
    <div className="w-full flex-col flex-center py-5">
      <p> 조회를 요청한 데이터가 없습니다.</p>
      <div>
        각 아이템의 오른쪽 리스트 아이콘
        <RiPlayListFill size={17} style={{ display: "inline", marginLeft: 5, marginRight: 5 }} />을 클릭해주세요.
      </div>
    </div>
  );
}
