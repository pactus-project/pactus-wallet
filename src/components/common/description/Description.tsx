import { ReactElement } from "react";

interface DescriptionProps {
  content: string | ReactElement;
}

function Description({ content }: DescriptionProps) {
  return (
    <p className="text-text-secondary tablet:!text-md font-regular !leading-loose text-xs">
      {content}
    </p>
  );
}

export default Description;
