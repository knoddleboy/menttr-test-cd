import UserAvatar, { type UserAvatarProps } from "@/components/user-avatar";
import { useRef, useState } from "react";
import { FaPen } from "react-icons/fa6";

type Props = {
  onChange: (file: File) => void;
} & UserAvatarProps;

const ChangeAvatar = ({ onChange, ...userAvatarProps }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onChange(file);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="cursor-pointer rounded-full relative"
        onClick={triggerFilePicker}
      >
        <div className="z-1 absolute -right-1 bottom-0">
          <div className="bg-white p-2 rounded-full border-2 border-neutral-600">
            <FaPen className="size-[18px] text-neutral-600" />
          </div>
        </div>
        <UserAvatar
          className="size-28 text-5xl border-2 border-white outline-none shadow-sm"
          {...userAvatarProps}
          avatar={preview ?? userAvatarProps.avatar}
        />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ChangeAvatar;
