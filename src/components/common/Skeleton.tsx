type Props = {
  className?: string;
};

const Skeleton = ({ className = "" }: Props) => {
  return (
    <div
      className={`
        animate-pulse
        rounded
        bg-gray-200 dark:bg-gray-700
        ${className}
      `}
    />
  );
};

export default Skeleton;
