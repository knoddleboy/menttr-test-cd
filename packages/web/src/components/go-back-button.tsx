import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import { IoChevronBack } from "react-icons/io5";
import { memo } from "react";

type Props = {
  navigateTo?: string;
};

const GoBackButton = ({ navigateTo }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (navigateTo) navigate(navigateTo);
    else navigate(-1);
  };

  return (
    <Button type="button" variant="secondary" className="w-10 h-10" onClick={handleClick}>
      <IoChevronBack className="text-neutral-700 size-5" />
    </Button>
  );
};

export default memo(GoBackButton);
