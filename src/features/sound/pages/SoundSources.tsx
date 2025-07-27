import { useEffect, useState } from "react";
import GridHeader from "../../../components/GridHeader";
import Pagination from "../../../components/Pagination";
import SearchComponent from "../../../components/SearchComponent";
import { soundSouceSearchOptions } from "../../../constants/searchOptions";
import { soundListHeaderTitles } from "../../../constants/headerList";
import API_CONFIG from "../../../config/api";
import SpinnerIcon from "../../../components/icons/SpinnerIcon";
import SoundListItem from "../../../components/SoundListItem";
import { SoundListItem as SoundData } from "../../../types/sound";
import PageLayout from "../../../components/layout/PageLayout";

export default function SoundSources() {
  const [sounds, setSounds] = useState<SoundData[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

  const fetchSoundsdata = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BACK_ADMIN_API}/sound-sources?page=${currentPage}&size=${size}`);
      const { soundSources, pagination } = await response.json();
      console.log("soundSources", soundSources);
      console.log("pagination", pagination);

      setSounds(soundSources);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.totalElements);
      setSize(pagination.size);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchSoundsdata();
  }, [currentPage]);

  if (!sounds) return <SpinnerIcon />;
  return (
    <PageLayout>
      <section className="w-[65%] mx-8 py-10 md:py-20">
        <div className="flex items-center flex-col md:flex-row justify-between">
          <h1 className="font-bold text-base lg:text-lg">
            아・오・옹의 소리 {totalItems !== 0 && ` ・ ${totalItems} 개`}
          </h1>
          <SearchComponent onSearch={() => {}} options={soundSouceSearchOptions} />
        </div>

        <div className="flex items-center flex-col py-4">
          <GridHeader headerTitles={soundListHeaderTitles} />

          {sounds && (
            <ul className="w-full flex flex-col gap-5 ">
              {sounds.map((sound, index) => {
                return <SoundListItem key={index} sound={sound} currentPage={currentPage} size={size} index={index} />;
              })}
            </ul>
          )}
        </div>
        {totalPages !== 0 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </section>
    </PageLayout>
  );
}
