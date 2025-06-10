import { usePageHeaderStore } from "@/stores/page-header";

const HeaderTitle = () => {
  const title = usePageHeaderStore((state) => state.title);

  return <h1 className="font-bold text-2xl text-neutral-700">{title}</h1>;
};

export default HeaderTitle;
